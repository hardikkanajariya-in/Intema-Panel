<?php

namespace App\Actions;

use App\Models\User;
use App\Services\ActivityLogService;
use App\Services\SettingService;
use App\Services\SetupService;
use Illuminate\Support\Facades\DB;

class CompleteSetupAction
{
    public function __construct(
        private readonly SettingService $settingService,
        private readonly SetupService $setupService,
        private readonly ActivityLogService $activityLogService,
    ) {}

    /**
     * @param  array<string, string>  $data
     */
    public function execute(array $data): void
    {
        DB::transaction(function () use ($data): void {
            User::query()->updateOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['admin_name'],
                    'password' => $data['password'],
                ],
            );

            $this->settingService->setMany([
                'panel_name' => $data['panel_name'],
                'company_name' => $data['company_name'],
                'website' => $data['website'],
                'support_email' => $data['support_email'],
                'github_url' => $data['github_url'],
                'timezone' => $data['timezone'],
            ]);

            $this->setupService->markComplete();

            $this->activityLogService->log(
                action: 'setup.completed',
                description: 'Initial panel setup was completed.',
                properties: ['email' => $data['email']],
            );
        });
    }
}
