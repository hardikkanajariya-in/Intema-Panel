<?php

namespace Database\Factories;

use App\Enums\ResourceStatus;
use App\Models\ManagedDatabase;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<ManagedDatabase>
 */
class ManagedDatabaseFactory extends Factory
{
    protected $model = ManagedDatabase::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $suffix = Str::lower(Str::random(6));

        return [
            'project_id' => Project::factory(),
            'name' => fake()->words(2, true),
            'database_name' => 'test_db_'.$suffix,
            'database_user' => 'test_user_'.$suffix,
            'database_password_encrypted' => Str::password(24),
            'host' => '127.0.0.1',
            'port' => 5432,
            'status' => ResourceStatus::Active,
        ];
    }
}
