<?php

namespace App\DTOs;

readonly class DashboardStatsData
{
    /**
     * @param  list<array<string, mixed>>  $latestActivity
     * @param  list<array<string, mixed>>  $recentDeployments
     */
    public function __construct(
        public int $projects,
        public int $applications,
        public int $databases,
        public int $domains,
        public int $sslCertificates,
        public int $expiringCertificates,
        public string $uptime,
        public string $cpuUsage,
        public string $ramUsage,
        public string $diskUsage,
        public string $postgresqlStatus,
        public string $phpVersion,
        public string $nginxStatus,
        public string $laravelVersion,
        public array $latestActivity = [],
        public array $recentDeployments = [],
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'projects' => $this->projects,
            'applications' => $this->applications,
            'databases' => $this->databases,
            'domains' => $this->domains,
            'sslCertificates' => $this->sslCertificates,
            'expiringCertificates' => $this->expiringCertificates,
            'uptime' => $this->uptime,
            'cpuUsage' => $this->cpuUsage,
            'ramUsage' => $this->ramUsage,
            'diskUsage' => $this->diskUsage,
            'postgresqlStatus' => $this->postgresqlStatus,
            'phpVersion' => $this->phpVersion,
            'nginxStatus' => $this->nginxStatus,
            'laravelVersion' => $this->laravelVersion,
            'latestActivity' => $this->latestActivity,
            'recentDeployments' => $this->recentDeployments,
        ];
    }
}
