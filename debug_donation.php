<?php

// Debug script to test donation status update
// Run this with: php debug_donation.php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\BloodRequest;
use App\Models\Donation;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

echo "=== BloodLine Donation System Debug ===\n\n";

// Test 1: Check database connection
echo "1. Testing Database Connection...\n";
try {
    $test = DB::select('SELECT 1 as test');
    echo "   ✓ Database connection successful\n\n";
} catch (Exception $e) {
    echo "   ✗ Database connection failed: " . $e->getMessage() . "\n\n";
    exit(1);
}

// Test 2: Check if donations table exists
echo "2. Checking Donations Table...\n";
try {
    $count = Donation::count();
    echo "   ✓ Donations table exists, count: $count\n\n";
} catch (Exception $e) {
    echo "   ✗ Donations table error: " . $e->getMessage() . "\n\n";
}

// Test 3: Check if blood_requests table exists
echo "3. Checking Blood Requests Table...\n";
try {
    $count = BloodRequest::count();
    echo "   ✓ BloodRequests table exists, count: $count\n\n";
} catch (Exception $e) {
    echo "   ✗ BloodRequests table error: " . $e->getMessage() . "\n\n";
}

// Test 4: Check for test data
echo "4. Checking for Test Data...\n";
$pendingRequests = BloodRequest::where('status', 'pending')->count();
$scheduledDonations = Donation::where('status', 'scheduled')->count();
echo "   Pending Blood Requests: $pendingRequests\n";
echo "   Scheduled Donations: $scheduledDonations\n\n";

// Test 5: Test status update directly
echo "5. Testing Direct Status Update...\n";
$donation = Donation::where('status', 'scheduled')->first();
if ($donation) {
    $oldStatus = $donation->status;
    $donation->status = 'in_progress';
    $saved = $donation->save();
    
    if ($saved) {
        echo "   ✓ Direct save() works\n";
        echo "   Donation ID: {$donation->id}\n";
        echo "   Status changed: $oldStatus → {$donation->status}\n\n";
        
        // Revert back
        $donation->status = $oldStatus;
        $donation->save();
        echo "   ✓ Status reverted to: {$donation->status}\n\n";
    } else {
        echo "   ✗ Direct save() failed\n\n";
    }
} else {
    echo "   ⚠ No scheduled donations found to test\n\n";
}

// Test 6: Check model fillable fields
echo "6. Checking Model Configuration...\n";
$donation = new Donation();
$fillable = $donation->getFillable();
echo "   Donation fillable fields: " . implode(', ', $fillable) . "\n";

$request = new BloodRequest();
$fillable = $request->getFillable();
echo "   BloodRequest fillable fields: " . implode(', ', $fillable) . "\n\n";

// Test 7: Check for validation errors
echo "7. Checking Validation Rules...\n";
echo "   Status allowed values: scheduled, accepted, in_progress, completed, rejected, cancelled\n";
echo "   Urgency allowed values: low, medium, high, critical\n\n";

echo "=== Debug Complete ===\n";
echo "\nTroubleshooting Tips:\n";
echo "1. Check if units_fulfilled is updating in blood_requests table\n";
echo "2. Check if status column in donations table accepts all status values\n";
echo "3. Check Laravel logs: storage/logs/laravel.log\n";
echo "4. Check browser console for JavaScript errors\n";
echo "5. Check Network tab in browser dev tools for HTTP status codes\n";
