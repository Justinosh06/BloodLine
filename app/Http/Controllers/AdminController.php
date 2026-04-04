<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\BloodRequest;
use App\Models\BloodStock;
use App\Models\Donation;
use App\Services\AnalyticsService;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    protected $analyticsService;

    public function __construct(AnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    public function index()
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => $this->analyticsService->getSystemStats(),
            'recentRequests' => BloodRequest::with('user')->latest()->take(10)->get(),
            'bloodInventory' => $this->analyticsService->getBloodInventory(),
            'monthlyTrends' => $this->analyticsService->getMonthlyTrends(),
            'donationStatus' => $this->analyticsService->getDonationStatusDistribution(),
            'urgencyDistribution' => $this->analyticsService->getUrgencyDistribution(),
            'hospitalPerformance' => $this->analyticsService->getHospitalPerformance(),
        ]);
    }

    public function globalRequests()
    {
        $requests = BloodRequest::with(['user', 'donations.donor'])
            ->latest()
            ->get();

        $summary = [
            'total' => $requests->count(),
            'pending' => $requests->where('status', 'pending')->count(),
            'fulfilled' => $requests->where('status', 'fulfilled')->count(),
            'urgent' => $requests->whereIn('urgency_level', ['high', 'critical'])->count(),
        ];

        return Inertia::render('Admin/GlobalRequests', [
            'requests' => $requests,
            'summary' => $summary,
        ]);
    }

    public function inventory()
    {
        $bloodStocks = BloodStock::with('hospital')
            ->get()
            ->groupBy('blood_type');

        $allBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        $inventorySummary = [];

        foreach ($allBloodTypes as $bloodType) {
            $stocks = $bloodStocks->get($bloodType, collect());
            $totalAvailable = $stocks->sum(function ($stock) {
                return $stock->getAvailableUnits();
            });
            $totalReserved = $stocks->sum('units_reserved');

            $inventorySummary[] = [
                'blood_type' => $bloodType,
                'total_available' => $totalAvailable,
                'total_reserved' => $totalReserved,
                'percentage' => $totalAvailable > 0 ? min(100, ($totalAvailable / 20) * 100) : 0,
                'status' => $totalAvailable <= 2 ? 'critical' : ($totalAvailable <= 5 ? 'low' : 'adequate'),
                'hospitals' => $stocks->map(function ($stock) {
                    return [
                        'hospital_name' => $stock->hospital->name ?? 'Unknown Hospital',
                        'available' => $stock->getAvailableUnits(),
                        'reserved' => $stock->units_reserved,
                    ];
                }),
            ];
        }

        return Inertia::render('Admin/Inventory', [
            'inventory' => $inventorySummary,
        ]);
    }

    public function analytics()
    {
        return Inertia::render('Admin/Analytics', [
            'stats' => $this->analyticsService->getSystemStats(),
            'monthlyTrends' => $this->analyticsService->getMonthlyTrends(12),
            'donationStatus' => $this->analyticsService->getDonationStatusDistribution(),
            'urgencyDistribution' => $this->analyticsService->getUrgencyDistribution(),
            'hospitalPerformance' => $this->analyticsService->getHospitalPerformance(10),
            'bloodTypeAnalysis' => $this->getBloodTypeAnalysis(),
        ]);
    }

    public function users()
    {
        return Inertia::render('Admin/Users', [
            'users' => User::latest()->get(),
        ]);
    }

    public function updateUserRole(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|in:admin,hospital,donor',
        ]);

        $user->update([
            'role' => $request->role,
        ]);

        return back()->with('success', 'User role updated successfully.');
    }

    private function getBloodTypeAnalysis()
    {
        $allBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        $analysis = [];
        foreach ($allBloodTypes as $bloodType) {
            $analysis[] = [
                'blood_type' => $bloodType,
                'requested' => (int)BloodRequest::where('blood_type', $bloodType)->sum('units_required'),
                'fulfilled' => (int)BloodRequest::where('blood_type', $bloodType)->sum('units_fulfilled'),
                'in_stock' => (int)BloodStock::where('blood_type', $bloodType)->sum(DB::raw('units_available - units_reserved')),
            ];
        }
        return $analysis;
    }
}
