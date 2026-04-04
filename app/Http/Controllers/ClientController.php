<?php

namespace App\Http\Controllers;

use App\Events\BloodRequestCreated;
use App\Models\BloodRequest;
use App\Models\BloodStock;
use App\Models\Donation;
use App\Models\User;
use App\Services\BloodRequestService;
use App\Services\DonationService;
use App\Http\Requests\BloodRequestCreateRequest;
use App\Http\Requests\DonationCreateRequest;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ClientController extends Controller
{
    protected $bloodRequestService;
    protected $donationService;

    public function __construct(BloodRequestService $bloodRequestService, DonationService $donationService)
    {
        $this->bloodRequestService = $bloodRequestService;
        $this->donationService = $donationService;
    }

    public function index()
    {
        $user = Auth::user();

        $stats = [
            'activeRequests' => BloodRequest::where('status', 'pending')->count(),
            'totalDonors' => User::where('role', 'donor')->count(),
            'livesSaved' => Donation::where('status', 'completed')->count(),
        ];

        if ($user->isDonor()) {
            return $this->donorDashboard($stats);
        } else {
            return $this->hospitalDashboard($stats);
        }
    }

    private function donorDashboard(array $stats)
    {
        $user = Auth::user();
        
        $upcomingDonations = Donation::where('donor_id', $user->id)
            ->whereIn('status', ['scheduled', 'in_progress'])
            ->with('bloodRequest.user')
            ->orderBy('donation_date', 'asc')
            ->take(5)
            ->get();
        
        $donorStats = [
            'totalDonations' => $user->total_donations,
            'lastDonation' => $user->last_donation_date,
            'eligibilityDays' => $user->canDonate() ? 0 : max(0, 56 - ($user->last_donation_date ? $user->last_donation_date->diffInDays(now()) : 0)),
            'bloodType' => $user->blood_type,
            'isAvailable' => $user->canDonate(),
            'hasUpcomingDonation' => $upcomingDonations->isNotEmpty(),
            'upcomingDonationDate' => $upcomingDonations->first()?->donation_date,
            'upcomingDonationDays' => $upcomingDonations->first()?->donation_date ? now()->diffInDays($upcomingDonations->first()->donation_date, false) : null,
        ];

        $urgentNeeds = BloodRequest::where('blood_type', $user->blood_type)
            ->where('status', 'pending')
            ->where('expires_at', '>', now())
            ->whereIn('urgency_level', ['high', 'critical'])
            ->with('user')
            ->take(5)
            ->get();

        $donationHistory = Donation::where('donor_id', $user->id)
            ->where('status', 'completed')
            ->with('bloodRequest')
            ->latest()
            ->take(10)
            ->get();

        return Inertia::render('Donor/Dashboard', [
            'stats' => $stats,
            'donorStats' => $donorStats,
            'urgentNeeds' => $urgentNeeds,
            'donationHistory' => $donationHistory,
            'upcomingDonations' => $upcomingDonations,
        ]);
    }

    private function hospitalDashboard(array $stats)
    {
        $user = Auth::user();
        
        $hospitalStats = [
            'totalRequests' => BloodRequest::where('user_id', $user->id)->count(),
            'pendingRequests' => BloodRequest::where('user_id', $user->id)->where('status', 'pending')->count(),
            'fulfilledRequests' => BloodRequest::where('user_id', $user->id)->where('status', 'fulfilled')->count(),
            'totalUnitsRequested' => BloodRequest::where('user_id', $user->id)->sum('units_required'),
        ];

        $recentRequests = BloodRequest::where('user_id', $user->id)
            ->with(['donations.donor'])
            ->latest()
            ->take(10)
            ->get();

        $bloodInventory = BloodStock::where('hospital_id', $user->id)
            ->get()
            ->map(function ($stock) {
                return [
                    'blood_type' => $stock->blood_type,
                    'available' => $stock->getAvailableUnits(),
                    'reserved' => $stock->units_reserved,
                    'status' => $stock->isCriticalStock() ? 'critical' : ($stock->isLowStock() ? 'low' : 'adequate'),
                ];
            });

        return Inertia::render('Client/MainDashboard', [
            'stats' => $stats,
            'hospitalStats' => $hospitalStats,
            'recentRequests' => $recentRequests,
            'bloodInventory' => $bloodInventory,
        ]);
    }

    public function createRequest()
    {
        return Inertia::render('Client/RequestBlood');
    }

    public function storeRequest(BloodRequestCreateRequest $request)
    {
        try {
            $bloodRequest = $this->bloodRequestService->createRequest($request->validated());
            
            try {
                broadcast(new BloodRequestCreated($bloodRequest))->toOthers();
            } catch (\Exception $e) {
                Log::warning('Broadcast failed but request was created', ['error' => $e->getMessage()]);
            }

            return back()->with('success', 'Blood request created successfully!');
        } catch (\Exception $e) {
            Log::error('Blood request creation failed', ['error' => $e->getMessage()]);
            return back()->with('error', 'Failed to create blood request: ' . $e->getMessage());
        }
    }

    public function availableRequests()
    {
        $user = Auth::user();
        
        $query = BloodRequest::where('status', 'pending')
            ->where('expires_at', '>', now())
            ->with(['user', 'donations.donor'])
            ->latest();

        if ($user->isDonor()) {
            $query->where('blood_type', $user->blood_type);
        } else {
            $query->where('user_id', $user->id);
        }

        return Inertia::render('Client/AvailableRequests', [
            'requests' => $query->get(),
        ]);
    }

    public function registerDonation(DonationCreateRequest $request)
    {
        try {
            $this->donationService->registerDonation(
                $request->blood_request_id,
                Auth::id(),
                $request->units_donated ?? 1,
                $request->donation_date,
                $request->donation_session
            );
            return back()->with('success', 'Donation registered successfully!');
        } catch (\Exception $e) {
            Log::error('Donation registration failed', ['error' => $e->getMessage()]);
            return back()->with('error', $e->getMessage());
        }
    }

    public function acceptRejectDonation(Request $request)
    {
        $validated = $request->validate([
            'blood_request_id' => 'required|exists:blood_requests,id',
            'donor_id' => 'required|exists:users,id',
            'action' => 'required|in:accept,reject',
        ]);

        try {
            $donation = Donation::where('blood_request_id', $validated['blood_request_id'])
                ->where('donor_id', $validated['donor_id'])
                ->firstOrFail();

            if ($validated['action'] === 'accept') {
                $donation->update(['status' => 'scheduled']);
                return back()->with('success', 'Donation accepted and scheduled.');
            } else {
                $donation->update(['status' => 'cancelled']);
                return back()->with('success', 'Donation request rejected.');
            }
        } catch (\Exception $e) {
            return back()->with('error', 'Operation failed.');
        }
    }

    public function inventory()
    {
        $user = Auth::user();
        $stocks = BloodStock::where('hospital_id', $user->id)->get();
        $capacity = $user->inventory_capacity ?? 1000;

        $bloodStocks = $stocks->map(function ($stock) use ($capacity) {
            $available = $stock->getAvailableUnits();
            $utilization = $capacity > 0 ? round(($available / $capacity) * 100) : 0;

            return [
                'id' => $stock->id,
                'blood_type' => $stock->blood_type,
                'available_units' => $available,
                'status' => $stock->isCriticalStock() ? 'critical' : ($stock->isLowStock() ? 'low' : 'adequate'),
                'utilization' => $utilization,
            ];
        });

        return Inertia::render('Client/Inventory', [
            'bloodStocks' => $bloodStocks,
            'hospitalCapacity' => $capacity,
        ]);
    }

    public function calendar()
    {
        $user = Auth::user();
        $donations = Donation::where('hospital_id', $user->id)
            ->with(['donor', 'bloodRequest'])
            ->get();

        // Generate calendar grid for current month
        $today = now();
        $firstDayOfMonth = $today->copy()->firstOfMonth();
        $lastDayOfMonth = $today->copy()->lastOfMonth();
        $daysInMonth = $today->daysInMonth;
        $startDayOfWeek = $firstDayOfMonth->dayOfWeek;

        $calendar = [];

        // Empty cells for days before the 1st of month
        for ($i = 0; $i < $startDayOfWeek; $i++) {
            $calendar[] = [
                'date' => $firstDayOfMonth->copy()->subDays($startDayOfWeek - $i)->format('Y-m-d'),
                'day' => '',
                'isToday' => false,
                'isPast' => true,
                'isWeekend' => false,
                'hasDonations' => false,
                'donations' => []
            ];
        }

        // Days of the month
        for ($day = 1; $day <= $daysInMonth; $day++) {
            $date = $firstDayOfMonth->copy()->addDays($day - 1);
            $dateStr = $date->format('Y-m-d');
            $isToday = $date->isToday();
            $isPast = $date->isPast();
            $isWeekend = $date->isWeekend();

            // Get donations for this day
            $dayDonations = $donations->filter(function ($donation) use ($dateStr) {
                return $donation->donation_date && $donation->donation_date->format('Y-m-d') === $dateStr;
            })->map(function ($donation) {
                return [
                    'id' => $donation->id,
                    'status' => $donation->status,
                    'time' => $donation->donation_session,
                    'donor' => [
                        'name' => $donation->donor->name,
                        'blood_type' => $donation->donor->blood_type,
                    ]
                ];
            })->values();

            $calendar[] = [
                'date' => $dateStr,
                'day' => $day,
                'isToday' => $isToday,
                'isPast' => $isPast,
                'isWeekend' => $isWeekend,
                'hasDonations' => $dayDonations->count() > 0,
                'donations' => $dayDonations->toArray()
            ];
        }

        // Fill remaining cells to complete the grid (42 cells = 6 rows)
        $remainingCells = 42 - count($calendar);
        for ($i = 1; $i <= $remainingCells; $i++) {
            $calendar[] = [
                'date' => $lastDayOfMonth->copy()->addDays($i)->format('Y-m-d'),
                'day' => '',
                'isToday' => false,
                'isPast' => false,
                'isWeekend' => false,
                'hasDonations' => false,
                'donations' => []
            ];
        }

        $stats = [
            'totalDonations' => $donations->count(),
            'completedDonations' => $donations->where('status', 'completed')->count(),
            'scheduledDonations' => $donations->where('status', 'scheduled')->count(),
            'pendingDonations' => $donations->whereIn('status', ['pending', 'accepted', 'in_progress'])->count(),
        ];

        return Inertia::render('Client/Calendar', [
            'donations' => $donations,
            'calendar' => $calendar,
            'currentMonth' => $today->format('F Y'),
            'stats' => $stats,
        ]);
    }

    public function updateDonationStatus(Request $request)
    {
        $validated = $request->validate([
            'donation_id' => 'required|exists:donations,id',
            'status' => 'required|in:scheduled,in_progress,completed,cancelled',
        ]);

        try {
            $donation = Donation::findOrFail($validated['donation_id']);
            if ($validated['status'] === 'completed') {
                $this->donationService->completeDonation($donation);
            } else {
                $donation->update(['status' => $validated['status']]);
            }
            return back()->with('success', 'Donation status updated.');
        } catch (\Exception $e) {
            return back()->with('error', 'Update failed.');
        }
    }
}
