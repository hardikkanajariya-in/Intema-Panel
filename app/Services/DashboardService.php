<?php

namespace App\Services;

use App\DTOs\DashboardStatsData;
use App\Models\Client;

class DashboardService
{
    public function getStats(): DashboardStatsData
    {
        $clientCount = Client::query()->count();
        $databaseCount = Client::query()
            ->whereNotNull('database_name')
            ->count();
        $domainCount = Client::query()
            ->whereNotNull('domain')
            ->count();

        return new DashboardStatsData(
            clients: $clientCount,
            databases: $databaseCount,
            domains: $domainCount,
            cpuUsage: '—',
            ramUsage: '—',
            diskUsage: '—',
        );
    }
}
