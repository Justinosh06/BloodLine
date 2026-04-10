<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'blood_type',
        'phone',
        'address',
        'is_available',
        'last_donation_date',
        'total_donations',
        'inventory_capacity',
        'hospital_name',
        'hospital_license',
        'date_of_birth',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_donation_date' => 'date',
        'date_of_birth' => 'date',
        'is_available' => 'boolean',
    ];

    public function bloodRequests()
    {
        return $this->hasMany(BloodRequest::class);
    }

    public function donations()
    {
        return $this->hasMany(Donation::class);
    }

    public function bloodStocks()
    {
        return $this->hasMany(BloodStock::class);
    }

    public function isDonor()
    {
        return $this->role === 'donor';
    }

    public function isHospital()
    {
        return $this->role === 'hospital';
    }

    public function canDonate()
    {
        if (!$this->isDonor() || !$this->is_available) {
            return false;
        }

        if ($this->last_donation_date) {
            $daysSinceLastDonation = $this->last_donation_date->diffInDays(now());
            return $daysSinceLastDonation >= 56;
        }

        return true;
    }
}