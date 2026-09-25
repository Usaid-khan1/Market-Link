<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\MarketRequest;
use App\Http\Resources\MarketResource;
use App\Models\Market;
use Illuminate\Http\JsonResponse;

class MarketController extends Controller
{
    /**
     * Display a listing of markets.
     */
    public function index(): JsonResponse
    {
        $markets = Market::latest()->get();

        return $this->success(MarketResource::collection($markets), 'Markets retrieved successfully');
    }

    /**
     * Store a newly created market in storage.
     */
    public function store(MarketRequest $request): JsonResponse
    {
        $market = Market::create($request->validated());

        return $this->success(new MarketResource($market), 'Market created successfully', 201);
    }

    /**
     * Display the specified market.
     */
    public function show(Market $market): JsonResponse
    {
        return $this->success(new MarketResource($market), 'Market details retrieved successfully');
    }

    /**
     * Update the specified market in storage.
     */
    public function update(MarketRequest $request, Market $market): JsonResponse
    {
        $market->update($request->validated());

        return $this->success(new MarketResource($market), 'Market updated successfully');
    }

    /**
     * Remove the specified market from storage.
     */
    public function destroy(Market $market): JsonResponse
    {
        $market->delete();

        return $this->success(null, 'Market deleted successfully');
    }
}
