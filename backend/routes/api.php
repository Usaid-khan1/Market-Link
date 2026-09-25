<?php

use App\Http\Controllers\Api\Admin\AdminDashboardController;
use App\Http\Controllers\Api\Admin\AdminModerationController;
use App\Http\Controllers\Api\Admin\AdminUserController;
use App\Http\Controllers\Api\Admin\AnnouncementController;
use App\Http\Controllers\Api\Admin\CategoryController;
use App\Http\Controllers\Api\Admin\MarketController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Farmer\FarmerInsightsController;
use App\Http\Controllers\Api\Farmer\FarmerOrderController;
use App\Http\Controllers\Api\Farmer\FarmerProductController;
use App\Http\Controllers\Api\Farmer\FarmerProfileController;
use App\Http\Controllers\Api\Farmer\FarmerReviewController;
use App\Http\Controllers\Api\Customer\CustomerBrowseController;
use App\Http\Controllers\Api\Customer\CustomerFavoriteController;
use App\Http\Controllers\Api\Customer\CustomerNotificationController;
use App\Http\Controllers\Api\Customer\CustomerOrderController;
use App\Http\Controllers\Api\Customer\CustomerReviewController;
use App\Http\Controllers\Api\Farmer\FarmerStockTemplateController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Announcements visible to all users (public & authenticated)
Route::get('/announcements', [AnnouncementController::class, 'publicIndex']);

// Public catalog & directory browsing (markets, products, farmers)
Route::prefix('browse')->group(function () {
    Route::get('/markets', [CustomerBrowseController::class, 'markets']);
    Route::get('/markets/{id}', [CustomerBrowseController::class, 'marketShow']);
    Route::get('/products', [CustomerBrowseController::class, 'products']);
    Route::get('/products/{id}', [CustomerBrowseController::class, 'productShow']);
    Route::get('/farmers/{id}', [CustomerBrowseController::class, 'farmerShow']);
});

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    /*
    |--------------------------------------------------------------------------
    | Phase 1: Admin Dashboard Modules
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/ping', function () {
            return response()->json([
                'success' => true,
                'message' => 'Admin route access confirmed.',
                'data' => ['role' => 'admin'],
            ]);
        });

        // 1. Dashboard summary & Reports
        Route::get('/dashboard/summary', [AdminDashboardController::class, 'summary']);
        Route::get('/reports', [AdminDashboardController::class, 'reports']);

        // 2. Manage Farmers
        Route::get('/farmers', [AdminUserController::class, 'farmers']);
        Route::get('/farmers/{id}', [AdminUserController::class, 'farmerShow']);
        Route::patch('/farmers/{id}/status', [AdminUserController::class, 'updateFarmerStatus']);

        // 3. Manage Customers
        Route::get('/customers', [AdminUserController::class, 'customers']);
        Route::get('/customers/{id}', [AdminUserController::class, 'customerShow']);
        Route::patch('/customers/{id}/status', [AdminUserController::class, 'updateCustomerStatus']);

        // 4. Manage Markets (CRUD)
        Route::apiResource('markets', MarketController::class);

        // 5. Manage Categories (CRUD)
        Route::apiResource('categories', CategoryController::class);

        // 6. Content Moderation (Products & Reviews)
        Route::get('/moderation/products', [AdminModerationController::class, 'products']);
        Route::delete('/moderation/products/{id}', [AdminModerationController::class, 'deleteProduct']);
        Route::get('/moderation/reviews', [AdminModerationController::class, 'reviews']);
        Route::delete('/moderation/reviews/{id}', [AdminModerationController::class, 'deleteReview']);

        // 7. Platform Announcements (Admin CRUD)
        Route::apiResource('announcements', AnnouncementController::class);
    });

    /*
    |--------------------------------------------------------------------------
    | Phase 2: Farmer Dashboard Modules
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:farmer')->prefix('farmer')->group(function () {
        Route::get('/ping', function () {
            return response()->json([
                'success' => true,
                'message' => 'Farmer route access confirmed.',
                'data' => ['role' => 'farmer'],
            ]);
        });

        // 1. Farmer Profile & Stall Configuration
        Route::get('/profile', [FarmerProfileController::class, 'show']);
        Route::match(['put', 'patch'], '/profile', [FarmerProfileController::class, 'update']);

        // 2. Dashboard Insights & Sales Summary
        Route::get('/insights', [FarmerInsightsController::class, 'index']);

        // 3. Product Catalog Management (CRUD + status toggle)
        Route::get('/products', [FarmerProductController::class, 'index']);
        Route::post('/products', [FarmerProductController::class, 'store']);
        Route::get('/products/{id}', [FarmerProductController::class, 'show']);
        Route::match(['put', 'patch'], '/products/{id}', [FarmerProductController::class, 'update']);
        Route::delete('/products/{id}', [FarmerProductController::class, 'destroy']);
        Route::patch('/products/{id}/status', [FarmerProductController::class, 'updateStatus']);

        // 4. Weekly Stock Templates (Recurring stock & reset)
        Route::get('/stock-templates', [FarmerStockTemplateController::class, 'index']);
        Route::post('/stock-templates', [FarmerStockTemplateController::class, 'saveBatch']);
        Route::post('/stock-templates/apply', [FarmerStockTemplateController::class, 'applyTemplate']);

        // 5. Pre-Order Management
        Route::get('/orders', [FarmerOrderController::class, 'index']);
        Route::get('/orders/{id}', [FarmerOrderController::class, 'show']);
        Route::patch('/orders/{id}/status', [FarmerOrderController::class, 'updateStatus']);

        // 6. Reviews & Responses
        Route::get('/reviews', [FarmerReviewController::class, 'index']);
        Route::post('/reviews/{id}/reply', [FarmerReviewController::class, 'reply']);
    });

    /*
    |--------------------------------------------------------------------------
    | Phase 3: Customer Dashboard Modules
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:customer')->prefix('customer')->group(function () {
        Route::get('/ping', function () {
            return response()->json([
                'success' => true,
                'message' => 'Customer route access confirmed.',
                'data' => ['role' => 'customer'],
            ]);
        });

        // 1. Pre-Orders Management
        Route::get('/orders', [CustomerOrderController::class, 'index']);
        Route::post('/orders', [CustomerOrderController::class, 'store']);
        Route::get('/orders/{id}', [CustomerOrderController::class, 'show']);
        Route::match(['put', 'patch'], '/orders/{id}', [CustomerOrderController::class, 'modify']);
        Route::post('/orders/{id}/cancel', [CustomerOrderController::class, 'cancel']);
        Route::post('/orders/{id}/reorder', [CustomerOrderController::class, 'reorder']);

        // 2. Favorites (Farmers & Products)
        Route::get('/favorites', [CustomerFavoriteController::class, 'index']);
        Route::post('/favorites/toggle', [CustomerFavoriteController::class, 'toggle']);

        // 3. Ratings & Reviews (Post-fulfillment)
        Route::get('/reviews', [CustomerReviewController::class, 'index']);
        Route::post('/reviews', [CustomerReviewController::class, 'store']);

        // 4. In-App Notifications
        Route::get('/notifications', [CustomerNotificationController::class, 'index']);
        Route::patch('/notifications/{id}/read', [CustomerNotificationController::class, 'markAsRead']);
        Route::patch('/notifications/read-all', [CustomerNotificationController::class, 'markAllAsRead']);
    });
});
