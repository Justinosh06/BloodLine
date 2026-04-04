<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class DonationCreateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check() && Auth::user()->isDonor();
    }

    public function rules(): array
    {
        return [
            'blood_request_id' => 'required|exists:blood_requests,id',
            'units_donated' => 'required|integer|min:1|max:2',
            'donation_date' => 'required|date|after_or_equal:today',
            'donation_session' => 'nullable|string|in:morning,afternoon,evening',
        ];
    }
}
