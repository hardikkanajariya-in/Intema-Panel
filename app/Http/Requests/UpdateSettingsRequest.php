<?php

namespace App\Http\Requests;

use App\Enums\ClientStatus;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'panel_name' => ['required', 'string', 'max:255'],
            'company_name' => ['required', 'string', 'max:255'],
            'website' => ['required', 'url', 'max:255'],
            'support_email' => ['required', 'email', 'max:255'],
            'timezone' => ['required', 'string', 'timezone:all'],
            'theme' => ['required', Rule::in(['light', 'dark', 'system'])],
            'github_url' => ['required', 'url', 'max:255'],
            'default_database_prefix' => ['required', 'string', 'max:32', 'regex:/^[a-z][a-z0-9_]*$/'],
            'default_client_status' => ['required', Rule::enum(ClientStatus::class)],
        ];
    }
}
