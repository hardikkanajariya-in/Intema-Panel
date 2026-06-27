<?php

namespace Database\Factories;

use App\Enums\ApplicationType;
use App\Enums\ResourceStatus;
use App\Models\Application;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Application>
 */
class ApplicationFactory extends Factory
{
    protected $model = Application::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'project_id' => Project::factory(),
            'name' => fake()->words(2, true),
            'type' => ApplicationType::Laravel,
            'status' => ResourceStatus::Active,
            'repository_branch' => 'main',
        ];
    }
}
