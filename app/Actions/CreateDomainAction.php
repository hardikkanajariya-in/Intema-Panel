<?php

namespace App\Actions;

use App\DTOs\DomainData;
use App\Enums\ResourceStatus;
use App\Models\Domain;
use App\Services\ActivityLogService;
use App\Services\NginxService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CreateDomainAction
{
    public function __construct(
        private readonly NginxService $nginxService,
        private readonly ActivityLogService $activityLogService,
    ) {}

    public function execute(DomainData $data, bool $provisionNginx = false): Domain
    {
        return DB::transaction(function () use ($data, $provisionNginx): Domain {
            $domain = Domain::query()->create([
                'project_id' => $data->projectId,
                'application_id' => $data->applicationId,
                'hostname' => $data->hostname,
                'document_root' => $data->documentRoot,
                'nginx_site' => Str::slug($data->hostname, '_'),
                'status' => ResourceStatus::Pending,
                'notes' => $data->notes,
            ]);

            if ($provisionNginx && $data->documentRoot) {
                $this->nginxService->createVirtualHost($data->hostname, $data->documentRoot);
                $this->nginxService->enableSite($domain->nginx_site);
                $this->nginxService->reload();
                $domain->update(['status' => ResourceStatus::Active]);
            } else {
                $domain->update(['status' => ResourceStatus::Active]);
            }

            $this->activityLogService->log(
                action: 'domain.created',
                description: "Domain \"{$domain->hostname}\" was created.",
                subject: $domain,
            );

            return $domain;
        });
    }
}
