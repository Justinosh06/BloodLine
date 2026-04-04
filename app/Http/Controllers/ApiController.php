<?php

namespace App\Http\Controllers;

use App\Models\BloodRequest;
use App\Models\BloodStock;
use App\Models\Donation;
use App\Models\User;
use App\Services\BloodRequestService;
use App\Services\DonationService;
use App\Services\AnalyticsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ApiController extends Controller
{
    protected $bloodRequestService;
    protected $donationService;
    protected $analyticsService;

    public function __construct(
        BloodRequestService $bloodRequestService, 
        DonationService $donationService,
        AnalyticsService $analyticsService
    ) {
        $this->bloodRequestService = $bloodRequestService;
        $this->donationService = $donationService;
        $this->analyticsService = $analyticsService;
    }

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

    public function getHospitalInventory()
    {
        $user = Auth::user();
        $bloodStocks = BloodStock::where('hospital_id', $user->id)
            ->get()
            ->map(function ($stock) {
                return [
                    'id' => $stock->id,
                    'blood_type' => $stock->blood_type,
                    'available' => $stock->getAvailableUnits(),
                    'available_units' => $stock->getAvailableUnits(),
                    'status' => $stock->isCriticalStock() ? 'critical' : ($stock->isLowStock() ? 'low' : 'adequate'),
                ];
            });

        return response()->json($bloodStocks);
    }

    public function getDonorStats()
    {
        $user = Auth::user();
        return response()->json([
            'totalDonations' => $user->total_donations,
            'lastDonation' => $user->last_donation_date,
            'eligibilityDays' => $user->canDonate() ? 0 : max(0, 56 - ($user->last_donation_date ? $user->last_donation_date->diffInDays(now()) : 0)),
            'bloodType' => $user->blood_type,
            'isAvailable' => $user->canDonate(),
        ]);
    }

    public function getHospitalStats()
    {
        $user = Auth::user();
        return response()->json([
            'totalRequests' => BloodRequest::where('user_id', $user->id)->count(),
            'pendingRequests' => BloodRequest::where('user_id', $user->id)->where('status', 'pending')->count(),
            'fulfilledRequests' => BloodRequest::where('user_id', $user->id)->where('status', 'fulfilled')->count(),
            'totalUnitsRequested' => BloodRequest::where('user_id', $user->id)->sum('units_required'),
        ]);
    }

    public function updateRequestStatus(Request $request, BloodRequest $bloodRequest)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:pending,fulfilled,cancelled',
        ]);

        $bloodRequest->update([
            'status' => $validated['status'],
        ]);

        return response()->json($bloodRequest->fresh());
    }

    public function createDonation(Request $request)
    {
        $validated = $request->validate([
            'blood_request_id' => 'required|exists:blood_requests,id',
            'units_donated' => 'required|integer|min:1|max:2',
        ]);

        $user = Auth::user();
        if (!$user->canDonate()) {
            return response()->json(['error' => 'Not eligible'], 422);
        }

        try {
            $donation = $this->donationService->registerDonation(
                $validated['blood_request_id'],
                $user->id,
                $validated['units_donated']
            );
            return response()->json($donation);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Registration failed'], 500);
        }
    }

    public function getSystemStats()
    {
        return response()->json($this->analyticsService->getSystemStats());
    }

    public function searchDonors(Request $request)
    {
        $validated = $request->validate([
            'blood_type' => 'nullable|string',
            'city' => 'nullable|string',
        ]);

        $query = User::where('role', 'donor')->where('is_available', true);
        if ($request->blood_type) $query->where('blood_type', $request->blood_type);
        if ($request->city) $query->where('address', 'like', "%{$request->city}%");

        return response()->json($query->get());
    }
}
