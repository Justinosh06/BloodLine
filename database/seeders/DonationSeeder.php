<?php

namespace Database\Seeders;

use App\Models\Donation;
use App\Models\BloodRequest;
use App\Models\User;
use Illuminate\Database\Seeder;

class DonationSeeder extends Seeder
{
    public function run(): void
    {
        $donors = User::where('role', 'donor')->get();
        $hospitals = User::where('role', 'hospital')->get();
        $bloodRequests = BloodRequest::where('status', 'fulfilled')->get();
        $statuses = ['completed', 'cancelled', 'no_show'];
        $donationCenters = [
            'City Blood Bank',
            'Regional Donation Center',
            'Mobile Donation Unit A',
            'Hospital Blood Center',
            'Community Blood Drive',
        ];

        foreach ($donors as $donor) {
            // Create 1-8 donations per donor
            $numDonations = rand(1, 8);
            
            for ($i = 0; $i < $numDonations; $i++) {
                $statusWeights = [0, 0, 0, 1, 2]; // 60% completed, 20% cancelled, 20% no-show
                $status = $statuses[$statusWeights[array_rand($statusWeights)]];
                $donationDate = now()->subDays(rand(1, 365));
                
                $donation = Donation::create([
                    'donor_id' => $donor->id,
                    'blood_request_id' => $status === 'completed' && $bloodRequests->isNotEmpty() 
                        ? $bloodRequests->random()->id 
                        : null,
                    'hospital_id' => $hospitals->random()->id,
                    'donation_date' => $donationDate,
                    'blood_type' => $donor->blood_type,
                    'units_donated' => rand(1, 2),
                    'status' => $status,
                    'donation_center' => $donationCenters[array_rand($donationCenters)],
                    'notes' => $status === 'completed' ? 'Successful donation' : ($status === 'cancelled' ? 'Donor cancelled' : 'Donor did not show up'),
                    'health_screening_passed' => $status === 'completed',
                    'hemoglobin_level' => $status === 'completed' ? rand(12.5, 16.5) : null,
                    'blood_pressure_systolic' => $status === 'completed' ? rand(110, 140) : null,
                    'blood_pressure_diastolic' => $status === 'completed' ? rand(70, 90) : null,
                    'temperature' => $status === 'completed' ? rand(36.5, 37.5) : null,
                ]);

                // Update donor's last donation date if completed
                if ($status === 'completed' && $donationDate > $donor->last_donation_date) {
                    $donor->update(['last_donation_date' => $donationDate]);
                }
            }
        }

        // Update total donations count for all donors
        User::where('role', 'donor')->each(function ($donor) {
            $totalDonations = Donation::where('donor_id', $donor->id)
                ->where('status', 'completed')
                ->count();
            $donor->update(['total_donations' => $totalDonations]);
        });
    }
}
