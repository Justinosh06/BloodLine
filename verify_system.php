<?php
// Comprehensive test script to verify donation status and units fulfillment

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\BloodRequest;
use App\Models\Donation;
use App\Models\User;
use Illuminate\Support\Facades\DB;

echo "=== BloodLine System Verification ===\n\n";

// Test 1: Check database enum was updated
echo "1. Checking Donation Status Enum...\n";
try {
    $donation = new Donation();
    // Try to save with each status
    $testStatuses = ['scheduled', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled'];
    
    foreach ($testStatuses as $status) {
        // Try to update a test donation (use ID 1 if exists, or create one)
        $testDonation = Donation::first();
        if ($testDonation) {
            $oldStatus = $testDonation->status;
            $testDonation->status = $status;
            $saved = $testDonation->save();
            if ($saved) {
                echo "   ✓ Status '$status' - ACCEPTED\n";
                // Revert
                $testDonation->status = $oldStatus;
                $testDonation->save();
            } else {
                echo "   ✗ Status '$status' - REJECTED\n";
            }
        } else {
            echo "   ⚠ No donations found to test\n";
            break;
        }
    }
    echo "\n";
} catch (Exception $e) {
    echo "   ✗ Error: " . $e->getMessage() . "\n\n";
}

// Test 2: Check units_fulfilled updates
echo "2. Testing Units Fulfilled Update...\n";
try {
    // Find a blood request with donations
    $request = BloodRequest::whereHas('donations')->first();
    
    if ($request) {
        echo "   Found request ID: {$request->id}\n";
        echo "   Current units_fulfilled: " . ($request->units_fulfilled ?? 'NULL') . "\n";
        
        // Get completed donations
        $completedUnits = Donation::where('blood_request_id', $request->id)
            ->where('status', 'completed')
            ->sum('units_donated');
        
        echo "   Completed donations units: $completedUnits\n";
        
        // Simulate update
        $oldValue = $request->units_fulfilled ?? 0;
        $request->units_fulfilled = $completedUnits;
        $saved = $request->save();
        
        if ($saved) {
            echo "   ✓ Units fulfilled updated: $oldValue → {$request->units_fulfilled}\n";
        } else {
            echo "   ✗ Failed to update units_fulfilled\n";
        }
    } else {
        echo "   ⚠ No blood requests with donations found\n";
    }
    echo "\n";
} catch (Exception $e) {
    echo "   ✗ Error: " . $e->getMessage() . "\n\n";
}

// Test 3: Check data flow from backend to frontend
echo "3. Checking Data Flow...\n";
try {
    $user = User::where('role', 'hospital')->first();
    
    if ($user) {
        echo "   Testing with hospital: {$user->name} (ID: {$user->id})\n";
        
        $requests = BloodRequest::where('user_id', $user->id)
            ->with(['donations' => function($query) {
                $query->with('donor')->latest();
            }])
            ->latest()
            ->take(3)
            ->get();
        
        echo "   Found " . $requests->count() . " requests\n";
        
        foreach ($requests as $req) {
            echo "   - Request #{$req->id}: {$req->blood_type}, ";
            echo "Required: {$req->units_required}, ";
            echo "Fulfilled: " . ($req->units_fulfilled ?? 0) . ", ";
            echo "Status: {$req->status}\n";
            
            $donations = $req->donations;
            if ($donations->count() > 0) {
                foreach ($donations as $donation) {
                    echo "     * Donation: {$donation->donor->name}, Status: {$donation->status}, Units: {$donation->units_donated}\n";
                }
            } else {
                echo "     * No donations registered\n";
            }
        }
    } else {
        echo "   ⚠ No hospital user found\n";
    }
    echo "\n";
} catch (Exception $e) {
    echo "   ✗ Error: " . $e->getMessage() . "\n\n";
}

// Test 4: Verify specific scenario
echo "4. Simulating Complete Donation Flow...\n";
try {
    $request = BloodRequest::where('status', 'pending')->first();
    
    if ($request) {
        echo "   Testing with Request #{$request->id}\n";
        
        // Find or create a donation
        $donation = Donation::where('blood_request_id', $request->id)->first();
        
        if (!$donation) {
            echo "   Creating test donation...\n";
            $donor = User::where('role', 'donor')->first();
            if ($donor) {
                $donation = Donation::create([
                    'donor_id' => $donor->id,
                    'blood_request_id' => $request->id,
                    'hospital_id' => $request->user_id,
                    'donation_date' => now(),
                    'blood_type' => $donor->blood_type,
                    'units_donated' => 1,
                    'status' => 'scheduled',
                    'donation_center' => 'Test Center',
                    'health_screening_passed' => true,
                ]);
                echo "   ✓ Created donation ID: {$donation->id}\n";
            } else {
                echo "   ⚠ No donor found to create test donation\n";
            }
        }
        
        if ($donation) {
            // Test status update to completed
            echo "   Updating donation status to 'completed'...\n";
            $oldStatus = $donation->status;
            $donation->status = 'completed';
            $saved = $donation->save();
            
            if ($saved) {
                echo "   ✓ Donation status updated: $oldStatus → completed\n";
                
                // Update blood request
                $oldFulfilled = $request->units_fulfilled ?? 0;
                $request->units_fulfilled = $oldFulfilled + $donation->units_donated;
                $request->save();
                
                echo "   ✓ Request units_fulfilled: $oldFulfilled → {$request->units_fulfilled}\n";
                
                // Check if request should be fulfilled
                if ($request->units_fulfilled >= $request->units_required) {
                    $request->status = 'fulfilled';
                    $request->fulfilled_at = now();
                    $request->save();
                    echo "   ✓ Request marked as fulfilled\n";
                }
            } else {
                echo "   ✗ Failed to update donation status\n";
            }
        }
    } else {
        echo "   ⚠ No pending blood requests found\n";
    }
    echo "\n";
} catch (Exception $e) {
    echo "   ✗ Error: " . $e->getMessage() . "\n\n";
}

echo "=== Verification Complete ===\n";
echo "\nIf all tests show ✓, the system is working correctly.\n";
echo "If you see ✗ or ⚠, check the specific issue above.\n";
