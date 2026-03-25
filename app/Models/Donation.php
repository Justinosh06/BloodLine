<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Donation extends Model
{
    use HasFactory;

    protected $fillable = [
        'donor_id',
        'blood_request_id',
        'hospital_id',
        'donation_date',
        'blood_type',
        'units_donated',
        'status',            // 'scheduled', 'completed', 'cancelled', 'no_show'
        'donation_center',
        'notes',
        'health_screening_passed',
        'hemoglobin_level',
        'blood_pressure_systolic',
        'blood_pressure_diastolic',
        'temperature',
    ];

    protected $casts = [
        'donation_date' => 'datetime',
        'health_screening_passed' => 'boolean',
    ];

    public function donor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'donor_id');
    }

    public function bloodRequest(): BelongsTo
    {
        return $this->belongsTo(BloodRequest::class);
    }

    public function hospital(): BelongsTo
    {
        return $this->belongsTo(User::class, 'hospital_id');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeByDonor($query, $donorId)
    {
        return $query->where('donor_id', $donorId);
    }

    public function scopeByHospital($query, $hospitalId)
    {
        return $query->where('hospital_id', $hospitalId);
    }
}
