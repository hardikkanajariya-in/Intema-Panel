<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class CompleteSetupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'admin_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'password' => ['required', 'string', 'min:12', 'confirmed'],
            'timezone' => ['required', 'string', 'timezone:all'],
            'panel_name' => ['required', 'string', 'max:255'],
            'company_name' => ['required', 'string', 'max:255'],
            'website' => ['required', 'url', 'max:255'],
            'github_url' => ['required', 'url', 'max:255'],
            'support_email' => ['required', 'email', 'max:255'],
        ];
    }
}
