<?php

namespace App\Http\Controllers\Api\Farmer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Farmer\FarmerProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class FarmerProductController extends Controller
{
    /**
     * Display a listing of the farmer's products.
     */
    public function index(Request $request): JsonResponse
    {
        $farmerId = $request->user()->id;

        $query = Product::where('farmer_id', $farmerId)
            ->with(['category', 'market'])
            ->withAvg('reviews', 'rating')
            ->withCount('reviews');

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->query('category_id'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $products = $query->latest()->get();

        return $this->success(ProductResource::collection($products), 'Farmer products retrieved successfully');
    }

    /**
     * Store a newly created product in storage.
     */
    public function store(FarmerProductRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $validated['farmer_id'] = $request->user()->id;

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = 'prod_' . time() . '_' . Str::random(8) . '.' . $file->getClientOriginalExtension();
            $destinationPath = public_path('uploads/products');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            $file->move($destinationPath, $filename);
            $validated['image'] = asset('uploads/products/' . $filename);
        }

        $product = Product::create($validated);
        $product->load(['category', 'market']);

        return $this->success(new ProductResource($product), 'Product created successfully', 201);
    }

    /**
     * Upload standalone product image.
     */
    public function uploadImage(Request $request): JsonResponse
    {
        $request->validate([
            'image' => ['required', 'file', 'image', 'mimes:jpeg,png,jpg,webp,gif', 'max:5120'],
        ]);

        $file = $request->file('image');
        $filename = 'prod_' . time() . '_' . Str::random(8) . '.' . $file->getClientOriginalExtension();
        $destinationPath = public_path('uploads/products');
        if (!file_exists($destinationPath)) {
            mkdir($destinationPath, 0755, true);
        }
        $file->move($destinationPath, $filename);

        $url = asset('uploads/products/' . $filename);

        return $this->success([
            'url' => $url,
            'filename' => $filename,
        ], 'Image uploaded successfully');
    }

    /**
     * Display the specified product.
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $product = Product::where('farmer_id', $request->user()->id)
            ->with(['category', 'market', 'reviews.customer'])
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->findOrFail($id);

        return $this->success(new ProductResource($product), 'Product details retrieved successfully');
    }

    /**
     * Update the specified product in storage.
     */
    public function update(FarmerProductRequest $request, int $id): JsonResponse
    {
        $product = Product::where('farmer_id', $request->user()->id)->findOrFail($id);
        $validated = $request->validated();

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = 'prod_' . time() . '_' . Str::random(8) . '.' . $file->getClientOriginalExtension();
            $destinationPath = public_path('uploads/products');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            $file->move($destinationPath, $filename);
            $validated['image'] = asset('uploads/products/' . $filename);
        }

        $product->update($validated);
        $product->load(['category', 'market']);

        return $this->success(new ProductResource($product), 'Product updated successfully');
    }

    /**
     * Remove the specified product from storage.
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $product = Product::where('farmer_id', $request->user()->id)->findOrFail($id);
        $product->delete();

        return $this->success(null, 'Product deleted successfully');
    }

    /**
     * Quick status toggle (available / sold_out).
     */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'status' => ['required', Rule::in(['available', 'sold_out'])],
        ]);

        $product = Product::where('farmer_id', $request->user()->id)->findOrFail($id);
        $product->update(['status' => $request->input('status')]);

        return $this->success(new ProductResource($product), "Product marked as {$request->input('status')}");
    }
}
