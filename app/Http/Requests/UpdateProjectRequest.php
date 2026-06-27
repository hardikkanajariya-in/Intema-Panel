<?php

namespace App\Http\Requests;

use App\Enums\ResourceStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('projects', 'slug')->ignore($this->route('project'))],
            'description' => ['nullable', 'string'],
            'status' => ['nullable', Rule::enum(ResourceStatus::class)],
            'notes' => ['nullable', 'string'],
        ];
    }
}
