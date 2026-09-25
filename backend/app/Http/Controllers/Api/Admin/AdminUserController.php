<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateCustomerStatusRequest;
use App\Http\Requests\Admin\UpdateFarmerStatusRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    /**
     * List all farmers with search and status filtering.
     */
    public function farmers(Request $request): JsonResponse
    {
        $query = User::where('role', 'farmer')->with('farmerProfile');

        if ($request->filled('status')) {
            $status = $request->query('status');
            $query->whereHas('farmerProfile', fn ($q) => $q->where('status', $status));
        }

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhereHas('farmerProfile', fn ($fp) => $fp->where('stall_name', 'like', "%{$search}%"));
            });
        }

        $farmers = $query->latest()->get();

        return $this->success(UserResource::collection($farmers), 'Farmers retrieved successfully');
    }

    /**
     * View farmer details including stall profile and sales metrics.
     */
    public function farmerShow(int $id): JsonResponse
    {
        $farmer = User::where('role', 'farmer')->with('farmerProfile')->findOrFail($id);

        $ordersCount = $farmer->ordersAsFarmer()->count();
        $totalRevenue = (float) $farmer->ordersAsFarmer()
            ->whereIn('order_status', ['completed', 'accepted', 'ready'])
            ->sum('total_amount');
        $productsCount = $farmer->products()->count();

        return $this->success([
            'user' => new UserResource($farmer),
            'stats' => [
                'total_orders' => $ordersCount,
                'total_revenue' => $totalRevenue,
                'products_count' => $productsCount,
            ],
        ], 'Farmer details retrieved successfully');
    }

    /**
     * Approve, suspend, or set pending for a farmer.
     */
    public function updateFarmerStatus(UpdateFarmerStatusRequest $request, int $id): JsonResponse
    {
        $farmer = User::where('role', 'farmer')->with('farmerProfile')->findOrFail($id);
        $status = $request->validated()['status'];

        if ($farmer->farmerProfile) {
            $farmer->farmerProfile->update(['status' => $status]);
        }

        // If suspended, suspend the user account as well
        if ($status === 'suspended') {
            $farmer->update(['status' => 'suspended']);
        } elseif ($status === 'approved') {
            $farmer->update(['status' => 'active']);
        }

        $farmer->load('farmerProfile');

        return $this->success(new UserResource($farmer), "Farmer status updated to {$status}");
    }

    /**
     * List all customers with search and status filtering.
     */
    public function customers(Request $request): JsonResponse
    {
        $query = User::where('role', 'customer');

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $customers = $query->latest()->get();

        return $this->success(UserResource::collection($customers), 'Customers retrieved successfully');
    }

    /**
     * View customer details with order history stats.
     */
    public function customerShow(int $id): JsonResponse
    {
        $customer = User::where('role', 'customer')->findOrFail($id);

        $ordersCount = $customer->ordersAsCustomer()->count();
        $totalSpent = (float) $customer->ordersAsCustomer()
            ->whereIn('order_status', ['completed', 'accepted', 'ready'])
            ->sum('total_amount');
        $reviewsCount = $customer->reviewsWritten()->count();

        return $this->success([
            'user' => new UserResource($customer),
            'stats' => [
                'total_orders' => $ordersCount,
                'total_spent' => $totalSpent,
                'reviews_count' => $reviewsCount,
            ],
        ], 'Customer details retrieved successfully');
    }

    /**
     * Activate or deactivate/suspend a customer.
     */
    public function updateCustomerStatus(UpdateCustomerStatusRequest $request, int $id): JsonResponse
    {
        $customer = User::where('role', 'customer')->findOrFail($id);
        $status = $request->validated()['status'];

        $customer->update(['status' => $status]);

        return $this->success(new UserResource($customer), "Customer status updated to {$status}");
    }
}
