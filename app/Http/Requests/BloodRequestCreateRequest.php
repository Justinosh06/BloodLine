<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class BloodRequestCreateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check() && (Auth::user()->isHospital() || Auth::user()->role === 'admin');
    }

    public function rules(): array
    {
        return [
            'blood_type' => 'required|string|in:A+,A-,B+,B-,O+,O-,AB+,AB-',
            'units_required' => 'required|integer|min:1|max:20',
            'urgency_level' => 'required|string|in:low,medium,high,critical',
            'patient_name' => 'nullable|string|max:255',
            'hospital_name' => 'nullable|string|max:255',
            'hospital_address' => 'nullable|string|max:500',
            'contact_person' => 'nullable|string|max:255',
            'contact_phone' => 'nullable|string|max:20',
            'reason' => 'required|string|max:1000',
        ];
    }

    public function attributes(): array
    {
        return [
            'blood_type' => 'blood type',
            'units_required' => 'units required',
            'urgency_level' => 'urgency level',
        ];
    }
}
