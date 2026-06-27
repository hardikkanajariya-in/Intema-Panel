<?php

namespace Database\Factories;

use App\Enums\ClientStatus;
use App\Models\Client;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Client>
 */
class ClientFactory extends Factory
{
    protected $model = Client::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $company = fake()->company();

        return [
            'company_name' => $company,
            'domain' => fake()->unique()->domainName(),
            'database_name' => str($company)->slug('_').'_db',
            'database_user' => str($company)->slug('_').'_user',
            'database_password_encrypted' => fake()->password(),
            'status' => fake()->randomElement(ClientStatus::cases()),
            'notes' => fake()->optional()->sentence(),
        ];
    }
}
