<?php

namespace App\Support;

use App\Models\Deployment;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Deployment
 */
class DeploymentResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        return [
            'uuid' => $this->uuid,
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'branch' => $this->branch,
            'commit_hash' => $this->commit_hash,
            'deployed_at' => $this->deployed_at?->toIso8601String(),
            'deploy_path' => $this->deploy_path,
            'application' => $this->whenLoaded('application', fn () => ApplicationResource::make($this->application)),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
