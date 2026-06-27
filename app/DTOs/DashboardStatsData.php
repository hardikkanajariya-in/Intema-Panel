<?php

namespace App\DTOs;

readonly class DashboardStatsData
{
    public function __construct(
        public int $clients,
        public int $databases,
        public string $uptime,
        public string $cpuUsage,
        public string $ramUsage,
        public string $diskUsage,
        public string $postgresqlStatus,
        public string $phpVersion,
        public string $nginxStatus,
        public string $laravelVersion,
    ) {}

    /**
     * @return array<string, int|string>
     */
    public function toArray(): array
    {
        return [
            'clients' => $this->clients,
            'databases' => $this->databases,
            'uptime' => $this->uptime,
            'cpuUsage' => $this->cpuUsage,
            'ramUsage' => $this->ramUsage,
            'diskUsage' => $this->diskUsage,
            'postgresqlStatus' => $this->postgresqlStatus,
            'phpVersion' => $this->phpVersion,
            'nginxStatus' => $this->nginxStatus,
            'laravelVersion' => $this->laravelVersion,
        ];
    }
}
