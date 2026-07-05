<?php

namespace App\Support;

use App\Models\Application;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Application
 */
class ApplicationResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        return [
            'uuid' => $this->uuid,
            'name' => $this->name,
            'type' => $this->type->value,
            'type_label' => $this->type->label(),
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'project_id' => $this->project_id,
            'project' => $this->whenLoaded('project', fn () => ProjectResource::make($this->project)),
            'root_path' => $this->root_path,
            'repository_url' => $this->repository_url,
            'repository_branch' => $this->repository_branch,
            'deploy_path' => $this->deploy_path,
            'runtime' => $this->runtime,
            'build_command' => $this->build_command,
            'start_command' => $this->start_command,
            'linux_user' => $this->linux_user,
            'metadata' => $this->metadata,
            'webhook_secret' => $this->webhook_secret,
            'webhook_url' => url('/api/webhooks/github'),
            'notes' => $this->notes,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
