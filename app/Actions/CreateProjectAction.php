<?php

namespace App\Actions;

use App\DTOs\ProjectData;
use App\Enums\ResourceStatus;
use App\Models\Project;
use App\Services\ActivityLogService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CreateProjectAction
{
    public function __construct(
        private readonly ActivityLogService $activityLogService,
    ) {}

    public function execute(ProjectData $data): Project
    {
        return DB::transaction(function () use ($data): Project {
            $project = Project::query()->create([
                'name' => $data->name,
                'slug' => $data->slug ?: Str::slug($data->name),
                'description' => $data->description,
                'status' => $data->status ?? ResourceStatus::Active,
                'notes' => $data->notes,
            ]);

            $this->activityLogService->log(
                action: 'project.created',
                description: "Project \"{$project->name}\" was created.",
                subject: $project,
            );

            return $project;
        });
    }
}
