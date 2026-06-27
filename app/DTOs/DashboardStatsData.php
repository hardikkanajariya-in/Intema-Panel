<?php

namespace App\DTOs;

readonly class DashboardStatsData
{
    public function __construct(
        public int $clients,
        public int $databases,
        public int $domains,
        public string $cpuUsage,
        public string $ramUsage,
        public string $diskUsage,
    ) {}

    /**
     * @return array<string, int|string>
     */
    public function toArray(): array
    {
        return [
            'clients' => $this->clients,
            'databases' => $this->databases,
            'domains' => $this->domains,
            'cpuUsage' => $this->cpuUsage,
            'ramUsage' => $this->ramUsage,
            'diskUsage' => $this->diskUsage,
        ];
    }
}
