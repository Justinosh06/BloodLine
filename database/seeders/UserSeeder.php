<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'System Administrator',
            'email' => 'admin@bloodline.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'phone' => '+1234567890',
        ]);

        // Create sample hospitals
        $hospitals = [
            [
                'name' => 'City General Hospital',
                'email' => 'city@hospital.com',
                'password' => Hash::make('password'),
                'role' => 'hospital',
                'phone' => '+1234567891',
                'hospital_name' => 'City General Hospital',
                'hospital_license' => 'HOSP-001',
                'address' => '123 Main St, City, State 12345',
            ],
            [
                'name' => 'St. Mary Medical Center',
                'email' => 'stmary@hospital.com',
                'password' => Hash::make('password'),
                'role' => 'hospital',
                'phone' => '+1234567892',
                'hospital_name' => 'St. Mary Medical Center',
                'hospital_license' => 'HOSP-002',
                'address' => '456 Oak Ave, City, State 12345',
            ],
            [
                'name' => 'Regional Health Center',
                'email' => 'regional@hospital.com',
                'password' => Hash::make('password'),
                'role' => 'hospital',
                'phone' => '+1234567893',
                'hospital_name' => 'Regional Health Center',
                'hospital_license' => 'HOSP-003',
                'address' => '789 Pine Rd, City, State 12345',
            ],
        ];

        foreach ($hospitals as $hospital) {
            User::create($hospital);
        }

        // Create sample donors
        $donors = [
            [
                'name' => 'John Smith',
                'email' => 'john.donor@bloodline.com',
                'password' => Hash::make('password'),
                'role' => 'donor',
                'blood_type' => 'O+',
                'phone' => '+1234567894',
                'address' => '111 First St, City, State 12345',
                'date_of_birth' => '1990-01-15',
                'total_donations' => 5,
                'last_donation_date' => now()->subMonths(3),
                'is_available' => true,
            ],
            [
                'name' => 'Sarah Johnson',
                'email' => 'sarah.donor@bloodline.com',
                'password' => Hash::make('password'),
                'role' => 'donor',
                'blood_type' => 'A-',
                'phone' => '+1234567895',
                'address' => '222 Second Ave, City, State 12345',
                'date_of_birth' => '1985-05-20',
                'total_donations' => 12,
                'last_donation_date' => now()->subMonths(2),
                'is_available' => true,
            ],
            [
                'name' => 'Michael Brown',
                'email' => 'michael.donor@bloodline.com',
                'password' => Hash::make('password'),
                'role' => 'donor',
                'blood_type' => 'B+',
                'phone' => '+1234567896',
                'address' => '333 Third Blvd, City, State 12345',
                'date_of_birth' => '1992-08-10',
                'total_donations' => 3,
                'last_donation_date' => now()->subMonths(1),
                'is_available' => true,
            ],
            [
                'name' => 'Emily Davis',
                'email' => 'emily.donor@bloodline.com',
                'password' => Hash::make('password'),
                'role' => 'donor',
                'blood_type' => 'AB+',
                'phone' => '+1234567897',
                'address' => '444 Fourth Ln, City, State 12345',
                'date_of_birth' => '1988-12-03',
                'total_donations' => 8,
                'last_donation_date' => now()->subWeeks(3),
                'is_available' => false, // Not eligible yet
            ],
            [
                'name' => 'Robert Wilson',
                'email' => 'robert.donor@bloodline.com',
                'password' => Hash::make('password'),
                'role' => 'donor',
                'blood_type' => 'O-',
                'phone' => '+1234567898',
                'address' => '555 Fifth Dr, City, State 12345',
                'date_of_birth' => '1995-03-25',
                'total_donations' => 15,
                'last_donation_date' => now()->subMonths(4),
                'is_available' => true,
            ],
        ];

        foreach ($donors as $donor) {
            User::create($donor);
        }
    }
}
