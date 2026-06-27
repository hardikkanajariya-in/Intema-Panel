<?php

namespace App\Services;

use App\DTOs\DashboardStatsData;
use App\Models\ActivityLog;
use App\Models\Application;
use App\Models\Deployment;
use App\Models\Domain;
use App\Models\ManagedDatabase;
use App\Models\Project;
use App\Models\SslCertificate;
use App\Support\ActivityLogResource;
use App\Support\DeploymentResource;
use Carbon\Carbon;

class DashboardService
{
    public function __construct(
        private readonly SystemInfoService $systemInfoService,
        private readonly SslService $sslService,
        private readonly MonitoringService $monitoringService,
    ) {}

    public function getStats(): DashboardStatsData
    {
        $expiringCerts = collect($this->sslService->certificates())
            ->filter(function (array $cert): bool {
                if (empty($cert['expiry'])) {
                    return false;
                }

                try {
                    return Carbon::parse($cert['expiry'])->lte(now()->addDays(30));
                } catch (\Throwable) {
                    return false;
                }
            })
            ->count();

        return new DashboardStatsData(
            projects: Project::query()->count(),
            applications: Application::query()->count(),
            databases: ManagedDatabase::query()->count(),
            domains: Domain::query()->count(),
            sslCertificates: SslCertificate::query()->count(),
            expiringCertificates: $expiringCerts,
            deployments: Deployment::query()->count(),
            loadAverage: $this->monitoringService->loadAverage(),
            uptime: $this->systemInfoService->uptime(),
            cpuUsage: $this->systemInfoService->cpuUsage(),
            ramUsage: $this->systemInfoService->ramUsage(),
            diskUsage: $this->systemInfoService->diskUsage(),
            postgresqlStatus: $this->systemInfoService->postgresqlStatus(),
            phpVersion: $this->systemInfoService->phpVersion(),
            nginxStatus: $this->systemInfoService->nginxStatus(),
            laravelVersion: $this->systemInfoService->laravelVersion(),
            latestActivity: ActivityLogResource::collection(
                ActivityLog::query()->latest('created_at')->limit(10)->get(),
            ),
            recentDeployments: DeploymentResource::collection(
                Deployment::query()->with('application')->latest()->limit(5)->get(),
            )->resolve(),
        );
    }
}
