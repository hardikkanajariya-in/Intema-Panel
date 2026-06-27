<?php

namespace App\Services;

class SetupService
{
    private const SETUP_KEY = 'setup_completed';

    public function isComplete(): bool
    {
        return filter_var(
            $this->settingService()->get(self::SETUP_KEY, 'false'),
            FILTER_VALIDATE_BOOLEAN,
        );
    }

    public function markComplete(): void
    {
        $this->settingService()->set(self::SETUP_KEY, 'true');
    }

    private function settingService(): SettingService
    {
        return app(SettingService::class);
    }
}
