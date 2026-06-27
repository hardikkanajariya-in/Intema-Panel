<?php

namespace App\Actions;

use App\Models\Project;
use App\Services\ActivityLogService;
use Illuminate\Support\Facades\DB;

class DeleteProjectAction
{
    public function __construct(
        private readonly ActivityLogService $activityLogService,
    ) {}

    public function execute(Project $project): void
    {
        DB::transaction(function () use ($project): void {
            $name = $project->name;

            $project->delete();

            $this->activityLogService->log(
                action: 'project.deleted',
                description: "Project \"{$name}\" was deleted.",
            );
        });
    }
}
