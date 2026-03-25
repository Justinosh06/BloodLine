<?php

namespace Database\Seeders;

use App\Models\BloodRequest;
use App\Models\User;
use Illuminate\Database\Seeder;

class BloodRequestSeeder extends Seeder
{
    public function run(): void
    {
        $hospitals = User::where('role', 'hospital')->get();
        $bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        $urgencyLevels = ['low', 'medium', 'high', 'critical'];
        $statuses = ['pending', 'fulfilled', 'cancelled'];
        $reasons = [
            'Emergency surgery',
            'Accident trauma',
            'Cancer treatment',
            'Organ transplant',
            'Childbirth complications',
            'Anemia treatment',
            'Heart surgery',
            'Burn treatment',
        ];

        foreach ($hospitals as $hospital) {
            // Create 5-15 requests per hospital
            $numRequests = rand(5, 15);
            
            for ($i = 0; $i < $numRequests; $i++) {
                $status = $statuses[array_rand($statuses)];
                $urgencyLevel = $urgencyLevels[array_rand($urgencyLevels)];
                
                $request = BloodRequest::create([
                    'user_id' => $hospital->id,
                    'blood_type' => $bloodTypes[array_rand($bloodTypes)],
                    'units_required' => rand(1, 10),
                    'urgency_level' => $urgencyLevel,
                    'patient_name' => 'Patient ' . chr(65 + $i) . ' ' . chr(65 + rand(0, 25)),
                    'hospital_name' => $hospital->hospital_name,
                    'hospital_address' => $hospital->address,
                    'contact_person' => 'Dr. ' . ['Smith', 'Johnson', 'Williams', 'Brown'][array_rand([0,1,2,3])],
                    'contact_phone' => '+1' . rand(2000000000, 9999999999),
                    'reason' => $reasons[array_rand($reasons)],
                    'status' => $status,
                    'notes' => $status === 'pending' ? 'Urgent need for blood transfusion' : null,
                    'expires_at' => now()->addDays(rand(1, 14)),
                ]);

                // If fulfilled, set fulfillment details
                if ($status === 'fulfilled') {
                    $request->update([
                        'units_fulfilled' => rand(1, $request->units_required),
                        'fulfilled_at' => now()->subDays(rand(1, 30)),
                    ]);
                }
            }
        }
    }
}
