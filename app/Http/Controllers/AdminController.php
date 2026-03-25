<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\BloodRequest;
use App\Models\BloodStock;
use App\Models\Donation;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function index()
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

        $recentRequests = BloodRequest::with('user')
            ->latest()
            ->take(10)
            ->get();

        $bloodInventory = BloodStock::selectRaw('blood_type, SUM(units_available - units_reserved) as total_available')
            ->groupBy('blood_type')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->blood_type => $item->total_available];
            });

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentRequests' => $recentRequests,
            'bloodInventory' => $bloodInventory,
        ]);
    }

    public function globalRequests()
    {
        $requests = BloodRequest::with(['user', 'donations'])
            ->withCount('donations')
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
                        'hospital_name' => $stock->hospital->name,
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
}