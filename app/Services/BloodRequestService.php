<?php

namespace App\Services;

use App\Models\BloodRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class BloodRequestService
{
    public function createRequest(array $data): BloodRequest
    {
        $user = Auth::user();
        
        return BloodRequest::create([
            'user_id' => $user->id,
            'blood_type' => $data['blood_type'],
            'units_required' => (int) $data['units_required'],
            'urgency_level' => $data['urgency_level'],
            'patient_name' => $data['patient_name'] ?? 'Emergency Case',
            'hospital_name' => $user->hospital_name ?? $data['hospital_name'] ?? 'General Hospital',
            'hospital_address' => $user->address ?? $data['hospital_address'] ?? 'Hospital Address',
            'contact_person' => $data['contact_person'] ?? $user->name,
            'contact_phone' => $data['contact_phone'] ?? $user->phone ?? '000-000-0000',
            'reason' => $data['reason'],
            'expires_at' => now()->addDays(7),
            'status' => 'pending',
            'units_fulfilled' => 0,
        ]);
    }

    public function updateStatus(BloodRequest $request, string $status): bool
    {
        return $request->update(['status' => $status]);
    }

    public function getStats(): array
    {
        return [
            'total' => BloodRequest::count(),
            'pending' => BloodRequest::where('status', 'pending')->count(),
            'fulfilled' => BloodRequest::where('status', 'fulfilled')->count(),
            'urgent' => BloodRequest::whereIn('urgency_level', ['high', 'critical'])
                ->where('status', 'pending')->count(),
        ];
    }
}
