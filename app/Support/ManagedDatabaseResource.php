<?php

namespace App\Support;

use App\Models\ManagedDatabase;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin ManagedDatabase
 */
class ManagedDatabaseResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        return [
            'uuid' => $this->uuid,
            'name' => $this->name,
            'database_name' => $this->database_name,
            'database_user' => $this->database_user,
            'database_password' => $this->database_password_encrypted,
            'host' => $this->host,
            'port' => $this->port,
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'project_id' => $this->project_id,
            'application_id' => $this->application_id,
            'project' => $this->whenLoaded('project', fn () => ProjectResource::make($this->project)),
            'application' => $this->whenLoaded('application', fn () => ApplicationResource::make($this->application)),
            'notes' => $this->notes,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
