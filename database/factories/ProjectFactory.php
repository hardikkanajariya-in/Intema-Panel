<?php

namespace Database\Factories;

use App\Enums\ResourceStatus;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Project>
 */
class ProjectFactory extends Factory
{
    protected $model = Project::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->company();

        return [
            'name' => $name,
            'slug' => Str::slug($name).'_'.fake()->unique()->numerify('###'),
            'description' => fake()->optional()->sentence(),
            'status' => ResourceStatus::Active,
            'notes' => null,
        ];
    }
}
