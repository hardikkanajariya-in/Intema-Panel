<?php

namespace App\Services;

use App\DTOs\DashboardStatsData;
use App\Models\Client;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ClientService
{
    /**
     * @return LengthAwarePaginator<int, Client>
     */
    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return Client::query()
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    public function find(int $id): Client
    {
        return Client::query()->findOrFail($id);
    }
}
