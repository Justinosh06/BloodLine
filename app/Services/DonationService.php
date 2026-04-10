<?php

namespace App\Services;

use App\Models\Donation;
use App\Models\User;
use App\Models\BloodRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DonationService
{
    public function registerDonation(int $requestId, int $donorId, int $units, ?string $donationDate = null, ?string $donationSession = null): Donation
    {
        return DB::transaction(function () use ($requestId, $donorId, $units, $donationDate, $donationSession) {
            $donor = User::findOrFail($donorId);
            
            if (!$donor->canDonate()) {
                $daysRemaining = $donor->last_donation_date 
                    ? max(0, 56 - $donor->last_donation_date->diffInDays(now())) 
                    : 0;
                throw new \Exception("You are not eligible to donate at this time. Please wait {$daysRemaining} more day(s).");
            }
            
            $request = BloodRequest::findOrFail($requestId);
            
            $donation = Donation::create([
                'blood_request_id' => $requestId,
                'donor_id' => $donorId,
                'blood_type' => $donor->blood_type,
                'units_donated' => $units,
                'status' => 'scheduled',
                'hospital_id' => $request->user_id,
                'donation_date' => $donationDate ? new \DateTime($donationDate) : now()->addDays(1),
                'donation_session' => $donationSession,
            ]);

            User::where('id', $donorId)->update(['is_available' => false]);

            return $donation;
        });
    }

    public function completeDonation(Donation $donation): bool
    {
        return DB::transaction(function () use ($donation) {
            $donation->update(['status' => 'completed', 'completed_at' => now()]);

            $donor = $donation->donor;
            $donor->increment('total_donations');
            $donor->update(['last_donation_date' => now(), 'is_available' => false]);

            $request = $donation->bloodRequest;
            $request->increment('units_fulfilled', $donation->units_donated);

            if ($request->units_fulfilled >= $request->units_required) {
                $request->update(['status' => 'fulfilled', 'fulfilled_at' => now()]);
            }

            return true;
        });
    }

    public function getStats(): array
    {
        return [
            'total' => Donation::count(),
            'completed' => Donation::where('status', 'completed')->count(),
            'total_units' => (int)Donation::where('status', 'completed')->sum('units_donated'),
        ];
    }
}
