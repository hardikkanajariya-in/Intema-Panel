<?php

namespace App\Support;

use App\Models\Domain;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Domain
 */
class DomainResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        return [
            'uuid' => $this->uuid,
            'hostname' => $this->hostname,
            'nginx_site' => $this->nginx_site,
            'document_root' => $this->document_root,
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'project_id' => $this->project_id,
            'application_id' => $this->application_id,
            'ssl_active' => $this->ssl_active,
            'project' => $this->whenLoaded('project', fn () => ProjectResource::make($this->project)),
            'application' => $this->whenLoaded('application', fn () => ApplicationResource::make($this->application)),
            'notes' => $this->notes,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
