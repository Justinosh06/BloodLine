<?php

namespace App\Http\Controllers;

use App\Models\BloodRequest;
use App\Models\BloodStock;
use App\Models\Donation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ApiController extends Controller
{
    // Get available blood requests for donors
    public function getAvailableRequests(Request $request)
    {
        $user = Auth::user();
        
        $requests = BloodRequest::where('status', 'pending')
            ->where('expires_at', '>', now())
            ->when($user->isDonor(), function ($query) use ($user) {
                return $query->where('blood_type', $user->blood_type);
            })
            ->with('user')
            ->latest()
            ->get();

        return response()->json($requests);
    }

    // Get hospital inventory
    public function getHospitalInventory()
    {
        $user = Auth::user();
        
        $bloodStocks = BloodStock::where('hospital_id', $user->id)
            ->get()
            ->map(function ($stock) {
                return [
                    'id' => $stock->id,
                    'blood_type' => $stock->blood_type,
                    'available_units' => $stock->getAvailableUnits(),
                    'status' => $stock->isCriticalStock() ? 'critical' : ($stock->isLowStock() ? 'low' : 'adequate'),
                ];
            });

        return response()->json($bloodStocks);
    }

    // Get donor statistics
    public function getDonorStats()
    {
        $user = Auth::user();
        
        $stats = [
            'totalDonations' => $user->total_donations,
            'lastDonation' => $user->last_donation_date,
            'eligibilityDays' => $user->canDonate() ? 0 : max(0, 56 - $user->last_donation_date->diffInDays(now())),
            'bloodType' => $user->blood_type,
            'isAvailable' => $user->canDonate(),
        ];

        return response()->json($stats);
    }

    // Get hospital statistics
    public function getHospitalStats()
    {
        $user = Auth::user();
        
        $stats = [
            'totalRequests' => BloodRequest::where('user_id', $user->id)->count(),
            'pendingRequests' => BloodRequest::where('user_id', $user->id)->where('status', 'pending')->count(),
            'fulfilledRequests' => BloodRequest::where('user_id', $user->id)->where('status', 'fulfilled')->count(),
            'totalUnitsRequested' => BloodRequest::where('user_id', $user->id)->sum('units_required'),
        ];

        return response()->json($stats);
    }

    // Create blood donation
    public function createDonation(Request $request)
    {
        $validated = $request->validate([
            'blood_request_id' => 'nullable|exists:blood_requests,id',
            'hospital_id' => 'required|exists:users,id',
            'donation_date' => 'required|date|after_or_equal:today',
            'donation_center' => 'required|string',
        ]);

        $user = Auth::user();
        
        if (!$user->canDonate()) {
            return response()->json(['error' => 'You are not eligible to donate at this time'], 422);
        }

        $donation = Donation::create([
            'donor_id' => $user->id,
            'blood_request_id' => $validated['blood_request_id'],
            'hospital_id' => $validated['hospital_id'],
            'donation_date' => $validated['donation_date'],
            'blood_type' => $user->blood_type,
            'units_donated' => 1,
            'status' => 'scheduled',
            'donation_center' => $validated['donation_center'],
        ]);

        return response()->json($donation, 201);
    }

    // Update blood request status
    public function updateRequestStatus(Request $request, BloodRequest $bloodRequest)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,fulfilled,cancelled,expired',
            'units_fulfilled' => 'nullable|integer|min:0',
        ]);

        $bloodRequest->update($validated);

        if ($validated['status'] === 'fulfilled') {
            $bloodRequest->update([
                'fulfilled_at' => now(),
                'units_fulfilled' => $validated['units_fulfilled'] ?? $bloodRequest->units_required,
            ]);
        }

        return response()->json($bloodRequest);
    }

    // Get system statistics for admin
    public function getSystemStats()
    {
        $stats = [
            'totalDonors' => User::where('role', 'donor')->count(),
            'totalHospitals' => User::where('role', 'hospital')->count(),
            'pendingRequests' => BloodRequest::where('status', 'pending')->count(),
            'completedDonations' => Donation::where('status', 'completed')->count(),
            'totalUnitsCollected' => Donation::where('status', 'completed')->sum('units_donated'),
            'urgentRequests' => BloodRequest::whereIn('urgency_level', ['high', 'critical'])
                ->where('status', 'pending')->count(),
        ];

        return response()->json($stats);
    }

    // Search donors by blood type and location
    public function searchDonors(Request $request)
    {
        $validated = $request->validate([
            'blood_type' => 'required|string',
            'location' => 'nullable|string',
        ]);

        $donors = User::where('role', 'donor')
            ->where('blood_type', $validated['blood_type'])
            ->where('is_available', true)
            ->when(isset($validated['location']), function ($query) use ($validated) {
                return $query->where('address', 'like', '%' . $validated['location'] . '%');
            })
            ->get(['id', 'name', 'blood_type', 'phone', 'last_donation_date', 'total_donations']);

        return response()->json($donors);
    }
}
