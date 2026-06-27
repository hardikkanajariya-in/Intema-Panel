<?php

namespace App\Support;

use App\Models\SslCertificate;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin SslCertificate
 */
class SslCertificateResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        return [
            'uuid' => $this->uuid,
            'domain_name' => $this->domain_name,
            'issuer' => $this->issuer,
            'expires_at' => $this->expires_at?->toIso8601String(),
            'auto_renew' => $this->auto_renew,
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'project_id' => $this->project_id,
            'domain_id' => $this->domain_id,
            'certificate_path' => $this->certificate_path,
            'notes' => $this->notes,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
