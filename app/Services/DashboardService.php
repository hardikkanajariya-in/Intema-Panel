<?php

namespace App\Services;

use App\DTOs\DashboardStatsData;
use App\Models\Client;

class DashboardService
{
    public function __construct(
        private readonly SystemInfoService $systemInfoService,
    ) {}

    public function getStats(): DashboardStatsData
    {
        $clientCount = Client::query()->count();
        $databaseCount = Client::query()
            ->whereNotNull('database_name')
            ->count();

        return new DashboardStatsData(
            clients: $clientCount,
            databases: $databaseCount,
            uptime: $this->systemInfoService->uptime(),
            cpuUsage: $this->systemInfoService->cpuUsage(),
            ramUsage: $this->systemInfoService->ramUsage(),
            diskUsage: $this->systemInfoService->diskUsage(),
            postgresqlStatus: $this->systemInfoService->postgresqlStatus(),
            phpVersion: $this->systemInfoService->phpVersion(),
            nginxStatus: $this->systemInfoService->nginxStatus(),
            laravelVersion: $this->systemInfoService->laravelVersion(),
        );
    }
}
