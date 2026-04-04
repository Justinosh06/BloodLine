<?php

namespace App\Services;

use App\Models\User;
use App\Models\BloodRequest;
use App\Models\BloodStock;
use App\Models\Donation;
use Illuminate\Support\Facades\DB;

class AnalyticsService
{
    public function getSystemStats(): array
    {
        return [
            'totalDonors' => User::where('role', 'donor')->count(),
            'totalHospitals' => User::where('role', 'hospital')->count(),
            'pendingRequests' => BloodRequest::where('status', 'pending')->count(),
            'completedDonations' => Donation::where('status', 'completed')->count(),
            'totalUnitsCollected' => (int)Donation::where('status', 'completed')->sum('units_donated'),
            'urgentRequests' => BloodRequest::whereIn('urgency_level', ['high', 'critical'])
                ->where('status', 'pending')->count(),
        ];
    }

    public function getBloodInventory(): array
    {
        return BloodStock::selectRaw('blood_type, SUM(units_available - units_reserved) as total_available')
            ->groupBy('blood_type')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->blood_type => (int)$item->total_available];
            })
            ->toArray();
    }

    public function getMonthlyTrends(int $months = 6): array
    {
        $monthlyTrends = [];
        for ($i = $months - 1; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $monthlyTrends[] = [
                'name' => $month->format('M'),
                'requests' => BloodRequest::whereMonth('created_at', $month->month)
                    ->whereYear('created_at', $month->year)
                    ->count(),
                'fulfilled' => BloodRequest::where('status', 'fulfilled')
                    ->whereMonth('created_at', $month->month)
                    ->whereYear('created_at', $month->year)
                    ->count(),
            ];
        }
        return $monthlyTrends;
    }

    public function getDonationStatusDistribution(): array
    {
        return [
            ['name' => 'Scheduled', 'value' => Donation::where('status', 'scheduled')->count()],
            ['name' => 'Completed', 'value' => Donation::where('status', 'completed')->count()],
            ['name' => 'In Progress', 'value' => Donation::where('status', 'in_progress')->count()],
            ['name' => 'Cancelled', 'value' => Donation::where('status', 'cancelled')->count()],
            ['name' => 'No Show', 'value' => Donation::where('status', 'no_show')->count()],
        ];
    }

    public function getUrgencyDistribution(): array
    {
        return [
            ['name' => 'Critical', 'value' => BloodRequest::where('urgency_level', 'critical')->count(), 'color' => '#ef4444'],
            ['name' => 'High', 'value' => BloodRequest::where('urgency_level', 'high')->count(), 'color' => '#f59e0b'],
            ['name' => 'Medium', 'value' => BloodRequest::where('urgency_level', 'medium')->count(), 'color' => '#3b82f6'],
            ['name' => 'Low', 'value' => BloodRequest::where('urgency_level', 'low')->count(), 'color' => '#10b981'],
        ];
    }

    public function getHospitalPerformance(int $limit = 5): array
    {
        return User::where('role', 'hospital')
            ->withCount(['bloodRequests', 'bloodRequests as fulfilled_count' => function ($q) {
                $q->where('status', 'fulfilled');
            }])
            ->orderBy('blood_requests_count', 'desc')
            ->take($limit)
            ->get()
            ->map(function ($hospital) {
                return [
                    'name' => $hospital->name,
                    'requests' => $hospital->blood_requests_count,
                    'fulfilled' => $hospital->fulfilled_count,
                ];
            })
            ->toArray();
    }
}
