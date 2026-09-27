<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FarmerProfile;
use App\Models\Market;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChatController extends Controller
{
    /**
     * Handle incoming chat queries from MarketLink Assistant.
     */
    public function chat(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'message' => 'required|string|max:1000',
            'history' => 'nullable|array|max:10',
            'history.*.role' => 'required_with:history|string|in:user,assistant,system',
            'history.*.content' => 'required_with:history|string|max:2000',
        ]);

        $userMessage = trim($validated['message']);
        $rawHistory = $validated['history'] ?? [];

        // Slice history to only the last 6 messages for focused multi-turn context
        $history = array_slice($rawHistory, -6);

        // Retrieve live MarketLink database data
        try {
            $contextData = $this->buildMarketLinkContext($userMessage);
        } catch (\Throwable $e) {
            Log::warning('Failed to retrieve full MarketLink context: ' . $e->getMessage());
            $contextData = ['context_string' => 'Live catalog currently being refreshed.'];
        }

        $systemPrompt = $this->buildSystemPrompt($contextData['context_string']);

        // Build messages payload for Groq
        $messagesPayload = [
            ['role' => 'system', 'content' => $systemPrompt],
        ];

        foreach ($history as $h) {
            $role = ($h['role'] === 'user') ? 'user' : 'assistant';
            $content = trim($h['content']);
            if (!empty($content)) {
                $messagesPayload[] = [
                    'role' => $role,
                    'content' => $content,
                ];
            }
        }

        // Add the current user query
        $messagesPayload[] = [
            'role' => 'user',
            'content' => $userMessage,
        ];

        // Call Groq API server-side
        $apiKey = config('services.groq.api_key') ?: env('GROQ_API_KEY');
        $model = config('services.groq.model') ?: env('GROQ_MODEL', 'openai/gpt-oss-120b');

        if (empty($apiKey)) {
            Log::error('GROQ_API_KEY is not configured.');
            return response()->json([
                'success' => false,
                'reply' => "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
            ], 200);
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
            ])->timeout(18)->post('https://api.groq.com/openai/v1/chat/completions', [
                'model' => $model,
                'messages' => $messagesPayload,
                'temperature' => 0.3,
                'max_tokens' => 600,
            ]);

            if ($response->successful()) {
                $body = $response->json();
                $replyContent = $body['choices'][0]['message']['content'] ?? '';

                // Clean up any stray reasoning tags if present
                $replyContent = preg_replace('/<think>.*?<\/think>/s', '', $replyContent);
                $replyContent = trim($replyContent);

                if (empty($replyContent)) {
                    $replyContent = "I'm here to help you navigate MarketLink Harvesting! Could you please clarify what product, farmer, or market you're looking for?";
                }

                return response()->json([
                    'success' => true,
                    'reply' => $replyContent,
                    'matches' => $contextData['matched_items'] ?? [],
                ]);
            } else {
                Log::error('Groq API Error: ' . $response->body());
                return response()->json([
                    'success' => false,
                    'reply' => "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
                ], 200);
            }
        } catch (\Throwable $e) {
            Log::error('Groq Connection Exception: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'reply' => "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
            ], 200);
        }
    }

    /**
     * Retrieve real data from the database and structure it into AI context.
     */
    private function buildMarketLinkContext(string $query): array
    {
        $today = now()->format('l'); // e.g. "Sunday", "Saturday"
        $lowerQuery = strtolower($query);

        // 1. Markets
        $markets = Market::all();
        $marketSummaries = [];
        foreach ($markets as $m) {
            $days = is_array($m->operating_days) ? implode(', ', $m->operating_days) : (string)$m->operating_days;
            $isOpenToday = is_array($m->operating_days) && in_array($today, $m->operating_days);
            $marketSummaries[] = sprintf(
                "- %s: Location at \"%s\". Operating Days: [%s]. Timings: %s. %s",
                $m->market_name,
                $m->address,
                $days,
                $m->timings,
                $isOpenToday ? "(OPEN TODAY - {$today}!)" : "(Closed today - {$today})"
            );
        }

        // 2. Farmers / Stalls
        $farmers = FarmerProfile::with('user')->where('status', 'approved')->get();
        $farmerSummaries = [];
        foreach ($farmers as $f) {
            $farmerName = $f->user->name ?? $f->contact_person;
            $operatingDays = is_array($f->operating_days) ? implode(', ', $f->operating_days) : (string)$f->operating_days;
            $pickupStart = $f->pickup_time_start ? substr($f->pickup_time_start, 0, 5) : '08:00';
            $pickupEnd = $f->pickup_time_end ? substr($f->pickup_time_end, 0, 5) : '14:00';

            $farmerSummaries[] = sprintf(
                "- %s (Contact: %s, User: %s): Located at \"%s\". Active Days: [%s]. Pickup Window: %s to %s.",
                $f->stall_name,
                $f->contact_person,
                $farmerName,
                $f->address,
                $operatingDays,
                $pickupStart,
                $pickupEnd
            );
        }

        // 3. Products
        $products = Product::with(['farmer.farmerProfile', 'market', 'category'])
            ->where('status', 'available')
            ->get();

        $productSummaries = [];
        $matchedItems = [];

        foreach ($products as $p) {
            $stallName = $p->farmer->farmerProfile->stall_name ?? ($p->farmer->name ?? 'Local Grower');
            $marketName = $p->market->market_name ?? 'Local Farmers Market';
            $categoryName = $p->category->name ?? 'General Produce';

            $line = sprintf(
                "- %s (ID: %d): $%s per %s. Stock: %d %s available. Category: %s. Farmer/Stall: %s. Available at Market: %s. Description: \"%s\".",
                $p->name,
                $p->id,
                number_format((float)$p->price, 2),
                $p->unit,
                $p->stock_quantity,
                $p->unit,
                $categoryName,
                $stallName,
                $marketName,
                $p->description
            );
            $productSummaries[] = $line;

            // Keyword match checking
            $productKeywords = strtolower($p->name . ' ' . $categoryName . ' ' . $stallName);
            if (
                str_contains($productKeywords, 'tomato') && str_contains($lowerQuery, 'tomato') ||
                str_contains($productKeywords, 'apple') && str_contains($lowerQuery, 'apple') ||
                str_contains($productKeywords, 'honey') && str_contains($lowerQuery, 'honey') ||
                str_contains($productKeywords, 'kale') && str_contains($lowerQuery, 'kale') ||
                str_contains($productKeywords, 'vegetable') && str_contains($lowerQuery, 'vegetable')
            ) {
                $matchedItems[] = [
                    'id' => $p->id,
                    'name' => $p->name,
                    'price' => $p->price,
                    'unit' => $p->unit,
                    'farmer' => $stallName,
                    'market' => $marketName,
                ];
            }
        }

        // Assemble context string
        $contextParts = [];
        $contextParts[] = "CURRENT LOCAL SYSTEM TIME: " . now()->format('Y-m-d H:i') . " (Day of week: {$today})";

        $contextParts[] = "\nMARKET DIRECTORY (Live from database):";
        $contextParts[] = implode("\n", $marketSummaries);

        $contextParts[] = "\nAPPROVED FARMERS & STALLS (Live from database):";
        $contextParts[] = implode("\n", $farmerSummaries);

        $contextParts[] = "\nIN-STOCK HARVEST PRODUCTS (Live from database):";
        $contextParts[] = implode("\n", $productSummaries);

        $contextParts[] = "\nHOW MARKETLINK HARVESTING WORKS:";
        $contextParts[] = "- Platform Model: MarketLink connects local farm lovers directly with verified regional farmers and weekend markets.";
        $contextParts[] = "- Pay-at-Pickup: Free online reservations! No upfront credit card payments online. Customers inspect produce at the stall and pay the farmer directly with cash, card, or market vouchers.";
        $contextParts[] = "- Pickup Bays: Each farmer packs harvested goods into dedicated named crates held at their designated stall bay until 1 hour before market closing.";

        return [
            'context_string' => implode("\n", $contextParts),
            'matched_items' => $matchedItems,
        ];
    }

    /**
     * Build the MarketLink system prompt adhering strictly to specifications.
     */
    private function buildSystemPrompt(string $realDataContext): string
    {
        return <<<EOT
You are MarketLink Assistant, the helpful AI assistant for MarketLink Harvesting.

MarketLink Harvesting connects customers with farmers and markets.

Your job is to help customers:
* Find specific products/items
* Find products available from farmers
* Find products available at markets
* Provide market availability information
* Provide market opening and closing times
* Provide farmer availability information
* Explain pickup windows
* Provide product information
* Answer frequently asked questions
* Help customers understand how MarketLink Harvesting works

Always prioritize real MarketLink data when it is available.
If relevant live data is provided from the application's database, use that data when answering the customer.

Never invent:
* Product availability
* Farmer names
* Market names
* Prices
* Market timings
* Pickup times
* Product details
* Stock information

If the required information is not available, clearly tell the customer that the information is currently unavailable or needs to be confirmed.

Keep responses helpful, concise, warm, and easy to understand.
If the customer asks a follow-up question, use the previous conversation context to understand what they are referring to.

================ REAL MARKETLINK HARVESTING DATA ================
{$realDataContext}
================================================================
EOT;
    }
}
