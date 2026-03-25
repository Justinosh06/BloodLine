<?php

namespace App\Http\Controllers;

use App\Events\BloodRequestCreated;
use App\Models\BloodRequest;
use App\Models\BloodStock;
use App\Models\Donation;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ClientController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Get system-wide stats for main dashboard
        $stats = [
            'activeRequests' => BloodRequest::where('status', 'pending')->count(),
            'totalDonors' => User::where('role', 'donor')->count(),
            'livesSaved' => Donation::where('status', 'completed')->count(),
        ];

        if ($user->isDonor()) {
            return $this->donorDashboard();
        } else {
            return $this->hospitalDashboard();
        }
    }

    private function donorDashboard()
    {
        $user = Auth::user();
        
        // Get system-wide stats for main dashboard
        $stats = [
            'activeRequests' => BloodRequest::where('status', 'pending')->count(),
            'totalDonors' => User::where('role', 'donor')->count(),
            'livesSaved' => Donation::where('status', 'completed')->count(),
        ];
        
        $donorStats = [
            'totalDonations' => $user->total_donations,
            'lastDonation' => $user->last_donation_date,
            'eligibilityDays' => $user->canDonate() ? 0 : max(0, 56 - $user->last_donation_date->diffInDays(now())),
            'bloodType' => $user->blood_type,
            'isAvailable' => $user->canDonate(),
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
        ]);
    }

    private function hospitalDashboard()
    {
        $user = Auth::user();
        
        // Get system-wide stats for main dashboard
        $stats = [
            'activeRequests' => BloodRequest::where('status', 'pending')->count(),
            'totalDonors' => User::where('role', 'donor')->count(),
            'livesSaved' => Donation::where('status', 'completed')->count(),
        ];
        
        $hospitalStats = [
            'totalRequests' => BloodRequest::where('user_id', $user->id)->count(),
            'pendingRequests' => BloodRequest::where('user_id', $user->id)->where('status', 'pending')->count(),
            'fulfilledRequests' => BloodRequest::where('user_id', $user->id)->where('status', 'fulfilled')->count(),
            'totalUnitsRequested' => BloodRequest::where('user_id', $user->id)->sum('units_required'),
        ];

        // Get donor registrations for hospital's requests
        $recentRequests = BloodRequest::where('user_id', $user->id)
            ->with(['donations' => function($query) {
                $query->with('donor')->latest();
            }])
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($request) {
                $donation = $request->donations->first();
                return [
                    'id' => $request->id,
                    'blood_type' => $request->blood_type,
                    'units_required' => $request->units_required,
                    'urgency_level' => $request->urgency_level,
                    'status' => $request->status,
                    'created_at' => $request->created_at,
                    'donor_registration' => $donation ? [
                        'donor_name' => $donation->donor->name,
                        'donor_blood_type' => $donation->donor->blood_type,
                        'donation_session' => $donation->donation_session,
                        'donation_status' => $donation->status,
                        'registration_date' => $donation->created_at,
                    ] : null,
                ];
            });

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

    public function storeRequest(Request $request)
    {
        $validated = $request->validate([
            'blood_type' => 'required|string',
            'units_required' => 'required|integer|min:1|max:10',
            'urgency_level' => 'required|in:low,medium,high,critical',
            'reason' => 'required|string',
        ]);

        $user = Auth::user();
        
        $bloodRequest = BloodRequest::create([
            'user_id' => $user->id,
            'blood_type' => $validated['blood_type'],
            'units_required' => $validated['units_required'],
            'urgency_level' => $validated['urgency_level'],
            'patient_name' => 'Emergency Patient',
            'hospital_name' => $user->hospital_name ?? 'General Hospital',
            'hospital_address' => $user->address ?? 'Hospital Address',
            'contact_person' => $user->name,
            'contact_phone' => $user->phone ?? '000-000-0000',
            'reason' => $validated['reason'],
            'notes' => 'Emergency blood request',
            'expires_at' => now()->addDays(7),
        ]);

        // Broadcast the new blood request
        broadcast(new BloodRequestCreated($bloodRequest))->toOthers();

        return back()->with('success', 'Blood request created successfully!');
    }

    public function availableRequests()
    {
        $user = Auth::user();
        
        if ($user->isDonor()) {
            // Donor view - show ALL public requests (from all hospitals) that match their blood type
            $requests = BloodRequest::where('status', 'pending')
                ->where('expires_at', '>', now())
                ->where('blood_type', $user->blood_type) // Only show matching blood types
                ->with(['donations' => function($query) {
                    $query->with('donor')->latest();
                }])
                ->with('user')
                ->latest()
                ->get()
                ->map(function ($request) use ($user) {
                    $donations = $request->donations->map(function ($donation) {
                        return [
                            'id' => $donation->id,
                            'donor_id' => $donation->donor_id,
                            'donor' => [
                                'id' => $donation->donor->id,
                                'name' => $donation->donor->name,
                                'blood_type' => $donation->donor->blood_type,
                                'last_donation' => $donation->donor->last_donation_date ? $donation->donor->last_donation_date->diffForHumans() : 'Never',
                                'phone' => $donation->donor->phone,
                            ],
                            'status' => $donation->status,
                            'donation_date' => $donation->donation_date,
                            'units_donated' => $donation->units_donated,
                            'donation_session' => $donation->donation_session,
                            'created_at' => $donation->created_at,
                        ];
                    });
                    
                    return [
                        'id' => $request->id,
                        'hospital' => $request->user->name,
                        'blood_type' => $request->blood_type,
                        'units' => $request->units_required,
                        'units_fulfilled' => $request->units_fulfilled,
                        'posted' => $request->created_at->diffForHumans(),
                        'urgency' => ucfirst($request->urgency_level),
                        'donations' => $donations,
                        'donor' => $donations->first() ? $donations->first()['donor'] : null,
                    ];
                });
        } else {
            // Hospital view - show ONLY your requests with donor registrations
            $requests = BloodRequest::where('user_id', $user->id)
                ->with(['donations' => function($query) {
                    $query->with('donor')->latest();
                }])
                ->latest()
                ->get()
                ->map(function ($request) {
                    $donations = $request->donations->map(function ($donation) {
                        return [
                            'id' => $donation->id,
                            'donor_id' => $donation->donor_id,
                            'donor' => [
                                'id' => $donation->donor->id,
                                'name' => $donation->donor->name,
                                'blood_type' => $donation->donor->blood_type,
                                'last_donation' => $donation->donor->last_donation_date ? $donation->donor->last_donation_date->diffForHumans() : 'Never',
                                'phone' => $donation->donor->phone,
                            ],
                            'status' => $donation->status,
                            'donation_date' => $donation->donation_date,
                            'units_donated' => $donation->units_donated,
                            'donation_session' => $donation->donation_session,
                            'created_at' => $donation->created_at,
                        ];
                    });
                    
                    return [
                        'id' => $request->id,
                        'hospital' => $request->user->name,
                        'blood_type' => $request->blood_type,
                        'units' => $request->units_required,
                        'units_fulfilled' => $request->units_fulfilled,
                        'posted' => $request->created_at->diffForHumans(),
                        'urgency' => ucfirst($request->urgency_level),
                        'donations' => $donations,
                        'donor' => $donations->first() ? $donations->first()['donor'] : null,
                    ];
                });
        }

        return Inertia::render('Client/AvailableRequests', [
            'requests' => $requests,
        ]);
    }

    public function calendar()
    {
        $user = Auth::user();
        
        // Get donations for the current month
        $donations = Donation::where('hospital_id', $user->id)
            ->with(['donor', 'bloodRequest'])
            ->whereMonth('donation_date', now()->month)
            ->whereYear('donation_date', now()->year)
            ->orderBy('donation_date')
            ->get()
            ->map(function ($donation) {
                return [
                    'id' => $donation->id,
                    'title' => $donation->donor->name . ' - ' . $donation->blood_type,
                    'date' => $donation->donation_date->format('Y-m-d'),
                    'time' => $donation->donation_session ?? 'morning',
                    'status' => $donation->status,
                    'donor' => [
                        'name' => $donation->donor->name,
                        'blood_type' => $donation->donor->blood_type,
                        'phone' => $donation->donor->phone,
                    ],
                    'blood_request' => [
                        'blood_type' => $donation->bloodRequest->blood_type,
                        'units_required' => $donation->bloodRequest->units_required,
                    ],
                ];
            });

        // Get calendar days for current month
        $calendar = [];
        $currentDate = now();
        $daysInMonth = $currentDate->daysInMonth;
        
        for ($day = 1; $day <= $daysInMonth; $day++) {
            $date = $currentDate->copy()->day($day);
            $dayDonations = $donations->where('date', $date->format('Y-m-d'));
            
            $calendar[] = [
                'date' => $date->format('Y-m-d'),
                'day' => $day,
                'dayName' => $date->format('D'),
                'donations' => $dayDonations->values(),
                'hasDonations' => $dayDonations->count() > 0,
                'isToday' => $date->isToday(),
                'isPast' => $date->isPast(),
                'isWeekend' => $date->isWeekend(),
            ];
        }

        return Inertia::render('Client/Calendar', [
            'calendar' => $calendar,
            'currentMonth' => $currentDate->format('F Y'),
            'stats' => [
                'totalDonations' => $donations->count(),
                'completedDonations' => $donations->where('status', 'completed')->count(),
                'scheduledDonations' => $donations->where('status', 'scheduled')->count(),
                'pendingDonations' => $donations->whereIn('status', ['scheduled', 'accepted'])->count(),
            ]
        ]);
    }

    public function registerDonation(Request $request)
    {
        $validated = $request->validate([
            'blood_request_id' => 'required|exists:blood_requests,id',
            'donation_session' => 'required|in:morning,afternoon,evening',
        ]);

        $user = Auth::user();
        $bloodRequest = BloodRequest::findOrFail($validated['blood_request_id']);

        // Check if user already has any active donation (one donation at a time rule)
        $activeDonation = Donation::where('donor_id', $user->id)
            ->whereIn('status', ['scheduled', 'accepted', 'in_progress'])
            ->first();

        if ($activeDonation) {
            return redirect()->back()->with('error', 'You already have an active donation. Please complete it before registering for another.');
        }

        // Check if user already registered for this specific request
        $existingDonation = Donation::where('donor_id', $user->id)
            ->where('blood_request_id', $bloodRequest->id)
            ->first();

        if ($existingDonation) {
            return redirect()->back()->with('error', 'You have already registered for this donation.');
        }

        // Create donation registration record (1 unit per donation)
        Donation::create([
            'donor_id' => $user->id,
            'blood_request_id' => $bloodRequest->id,
            'hospital_id' => $bloodRequest->user_id,
            'donation_date' => now()->addDays(1), // Schedule for tomorrow
            'blood_type' => $user->blood_type,
            'units_donated' => 1, // Fixed to 1 unit per donation
            'status' => 'scheduled',
            'donation_session' => $validated['donation_session'],
            'donation_center' => $bloodRequest->user->name . ' Blood Bank',
            'health_screening_passed' => true,
            'hemoglobin_level' => 14.5,
            'blood_pressure_systolic' => 120,
            'blood_pressure_diastolic' => 80,
            'temperature' => 98.6,
        ]);

        // Update blood request to reduce required units
        $bloodRequest->units_required = max(0, $bloodRequest->units_required - 1);
        $bloodRequest->save();

        // If all required units are now fulfilled, mark request as fulfilled
        if ($bloodRequest->units_required <= 0) {
            $bloodRequest->status = 'fulfilled';
            $bloodRequest->fulfilled_at = now();
            $bloodRequest->units_fulfilled = ($bloodRequest->units_fulfilled ?? 0) + 1;
            $bloodRequest->save();
        }

        return redirect()->back()->with('success', 'Successfully registered for donation!');
    }

    public function acceptRejectDonation(Request $request)
    {
        $validated = $request->validate([
            'blood_request_id' => 'required|exists:blood_requests,id',
            'donor_id' => 'required|exists:users,id',
            'action' => 'required|in:accept,reject',
        ]);

        $bloodRequest = BloodRequest::findOrFail($validated['blood_request_id']);
        $donation = Donation::where('blood_request_id', $bloodRequest->id)
            ->where('donor_id', $validated['donor_id'])
            ->first();

        if (!$donation) {
            return back()->with('error', 'Donation registration not found.');
        }

        if ($validated['action'] === 'accept') {
            $donation->status = 'accepted';
            $message = 'Donation accepted successfully!';
        } else {
            $donation->status = 'rejected';
            $message = 'Donation rejected.';
        }

        $donation->save();

        return back()->with('success', $message);
    }

    public function updateDonationStatus(Request $request)
    {
        $validated = $request->validate([
            'blood_request_id' => 'required|exists:blood_requests,id',
            'donor_id' => 'required|exists:users,id',
            'status' => 'required|in:scheduled,in_progress,completed,cancelled',
        ]);

        $bloodRequest = BloodRequest::findOrFail($validated['blood_request_id']);
        $donation = Donation::where('blood_request_id', $bloodRequest->id)
            ->where('donor_id', $validated['donor_id'])
            ->first();

        if (!$donation) {
            return back()->with('error', 'No active donation found for this request.');
        }

        $donation->status = $validated['status'];
        $donation->save();

        // If completed, update user's donation count and blood request
        if ($validated['status'] === 'completed') {
            $donor = $donation->donor;
            $donor->increment('total_donations');
            $donor->update(['last_donation_date' => now()]);
            
            // Update blood request to mark units as fulfilled
            $bloodRequest->units_fulfilled = ($bloodRequest->units_fulfilled ?? 0) + $donation->units_donated;
            $bloodRequest->save();
            
            // If all required units are now fulfilled, mark request as fulfilled
            if ($bloodRequest->units_fulfilled >= $bloodRequest->units_required) {
                $bloodRequest->status = 'fulfilled';
                $bloodRequest->fulfilled_at = now();
                $bloodRequest->save();
            }
        }

        return back()->with('success', 'Donation status updated successfully!');
    }

    public function storeDonation(Request $request)
    {
        $validated = $request->validate([
            'blood_request_id' => 'required|exists:blood_requests,id',
            'units_to_donate' => 'required|integer|min:1|max:5',
        ]);

        $user = Auth::user();
        $bloodRequest = BloodRequest::findOrFail($validated['blood_request_id']);

        // Create donation record
        $donation = Donation::create([
            'donor_id' => $user->id,
            'blood_request_id' => $bloodRequest->id,
            'hospital_id' => $bloodRequest->user_id,
            'donation_date' => now(),
            'blood_type' => $user->blood_type,
            'units_donated' => $validated['units_to_donate'],
            'status' => 'scheduled',
            'donation_center' => 'Main Blood Bank',
            'health_screening_passed' => true,
            'hemoglobin_level' => 14.5,
            'blood_pressure_systolic' => 120,
            'blood_pressure_diastolic' => 80,
            'temperature' => 98.6,
        ]);

        // Update user's donation count
        $user->increment('total_donations');
        $user->update(['last_donation_date' => now()]);

        return redirect()->route('dashboard')->with('success', 'Donation scheduled successfully!');
    }

    public function inventory()
    {
        $user = Auth::user();
        
        // Only hospitals can access inventory
        if (!$user->isHospital()) {
            return redirect()->route('dashboard')->with('error', 'Access denied. Inventory is only available to hospitals.');
        }
        
        $bloodStocks = BloodStock::where('hospital_id', $user->id)
            ->get()
            ->map(function ($stock) {
                $availableUnits = $stock->getAvailableUnits();
                $totalCapacity = $user->inventory_capacity ?? 1000; // Use hospital's capacity
                return [
                    'id' => $stock->id,
                    'blood_type' => $stock->blood_type,
                    'units_available' => $stock->units_available,
                    'units_reserved' => $stock->units_reserved,
                    'available_units' => $availableUnits,
                    'expiry_date' => $stock->expiry_date,
                    'storage_location' => $stock->storage_location,
                    'total_capacity' => $totalCapacity,
                    'status' => $stock->isCriticalStock() ? 'critical' : ($stock->isLowStock() ? 'low' : 'adequate'),
                    'last_updated' => $stock->last_updated,
                    'utilization' => $totalCapacity > 0 ? round(($availableUnits / $totalCapacity) * 100, 1) : 0,
                ];
            });

        return Inertia::render('Client/Inventory', [
            'bloodStocks' => $bloodStocks,
            'hospitalCapacity' => $user->inventory_capacity ?? 1000,
        ]);
    }
}