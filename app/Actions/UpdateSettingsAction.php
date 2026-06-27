<?php

namespace App\Actions;

use App\Services\ActivityLogService;
use App\Services\SettingService;

class UpdateSettingsAction
{
    public function __construct(
        private readonly SettingService $settingService,
        private readonly ActivityLogService $activityLogService,
    ) {}

    /**
     * @param  array<string, string|null>  $settings
     */
    public function execute(array $settings): void
    {
        $this->settingService->setMany($settings);

        $this->activityLogService->log(
            action: 'settings.updated',
            description: 'Panel settings were updated.',
            properties: array_keys($settings),
        );
    }
}
