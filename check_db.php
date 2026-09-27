<?php
require 'backend/vendor/autoload.php';
$app = require_once 'backend/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$user = App\Models\User::find(8);
$profile = App\Models\FarmerProfile::where('user_id', 8)->first();
$profile->market_ids = [3];
$profile->stall_name = "Test farmer Stall";
$profile->stall_number = "Stall #7, North Gazebo";
$profile->save();

$refreshed = App\Models\FarmerProfile::where('user_id', 8)->first();
echo "Refreshed Profile:\n";
echo "Market IDs: " . json_encode($refreshed->market_ids) . "\n";
echo "Stall Name: " . $refreshed->stall_name . "\n";

// Test CustomerBrowseController::stalls()
$controller = new App\Http\Controllers\Api\Customer\CustomerBrowseController();
$res = $controller->stalls(Illuminate\Http\Request::create('/api/browse/stalls', 'GET'));
echo "\nStalls:\n" . json_encode($res->getData(), JSON_PRETTY_PRINT);

// Test CustomerBrowseController::marketShow(3)
$resM = $controller->marketShow(3);
echo "\nMarketShow(3):\n" . json_encode($resM->getData(), JSON_PRETTY_PRINT);
