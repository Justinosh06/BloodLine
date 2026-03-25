<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BloodRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',           // Hospital that made the request
        'blood_type',
        'units_required',
        'urgency_level',     // 'low', 'medium', 'high', 'critical'
        'patient_name',
        'hospital_name',
        'hospital_address',
        'contact_person',
        'contact_phone',
        'reason',
        'status',            // 'pending', 'fulfilled', 'cancelled', 'expired'
        'units_fulfilled',
        'fulfilled_at',
        'expires_at',
        'notes',
    ];

    protected $casts = [
        'fulfilled_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function donations()
    {
        return $this->hasMany(Donation::class);
    }

    public function isUrgent()
    {
        return in_array($this->urgency_level, ['high', 'critical']);
    }

    public function isExpired()
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    public function getProgressPercentage()
    {
        if ($this->units_required == 0) return 0;
        return min(100, ($this->units_fulfilled / $this->units_required) * 100);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeUrgent($query)
    {
        return $query->whereIn('urgency_level', ['high', 'critical']);
    }

    public function scopeByBloodType($query, $bloodType)
    {
        return $query->where('blood_type', $bloodType);
    }
}
