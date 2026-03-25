<?php

namespace Database\Seeders;

use App\Models\BloodStock;
use App\Models\User;
use Illuminate\Database\Seeder;

class BloodStockSeeder extends Seeder
{
    public function run(): void
    {
        $hospitals = User::where('role', 'hospital')->get();
        $bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

        foreach ($hospitals as $hospital) {
            foreach ($bloodTypes as $bloodType) {
                // Generate random stock levels
                $unitsAvailable = rand(0, 25);
                $unitsReserved = rand(0, min(5, $unitsAvailable));
                
                BloodStock::create([
                    'hospital_id' => $hospital->id,
                    'blood_type' => $bloodType,
                    'units_available' => $unitsAvailable,
                    'units_reserved' => $unitsReserved,
                    'expiry_date' => now()->addDays(rand(30, 42)),
                    'storage_location' => 'Storage ' . chr(65 + rand(0, 3)) . '-' . rand(1, 10),
                    'last_updated' => now()->subHours(rand(1, 24)),
                ]);
            }
        }
    }
}
