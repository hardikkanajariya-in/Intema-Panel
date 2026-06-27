<?php

namespace App\Actions;

use App\DTOs\ProjectData;
use App\Models\Project;
use App\Services\ActivityLogService;
use Illuminate\Support\Facades\DB;

class UpdateProjectAction
{
    public function __construct(
        private readonly ActivityLogService $activityLogService,
    ) {}

    public function execute(Project $project, ProjectData $data): Project
    {
        return DB::transaction(function () use ($project, $data): Project {
            $project->update($data->toArray());

            $this->activityLogService->log(
                action: 'project.updated',
                description: "Project \"{$project->name}\" was updated.",
                subject: $project,
            );

            return $project->fresh();
        });
    }
}
