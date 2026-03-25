<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BloodStock extends Model
{
    use HasFactory;

    protected $fillable = [
        'hospital_id',
        'blood_type',
        'units_available',
        'units_reserved',
        'expiry_date',
        'storage_location',
        'last_updated',
    ];

    protected $casts = [
        'expiry_date' => 'datetime',
        'last_updated' => 'datetime',
    ];

    public function hospital(): BelongsTo
    {
        return $this->belongsTo(User::class, 'hospital_id');
    }

    public function getAvailableUnits()
    {
        return max(0, $this->units_available - $this->units_reserved);
    }

    public function isLowStock()
    {
        return $this->getAvailableUnits() <= 5;
    }

    public function isCriticalStock()
    {
        return $this->getAvailableUnits() <= 2;
    }

    public function scopeByHospital($query, $hospitalId)
    {
        return $query->where('hospital_id', $hospitalId);
    }

    public function scopeByBloodType($query, $bloodType)
    {
        return $query->where('blood_type', $bloodType);
    }

    public function scopeLowStock($query)
    {
        return $query->whereRaw('units_available - units_reserved <= 5');
    }

    public function scopeCriticalStock($query)
    {
        return $query->whereRaw('units_available - units_reserved <= 2');
    }
}
