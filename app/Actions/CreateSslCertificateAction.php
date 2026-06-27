<?php

namespace App\Actions;

use App\DTOs\SslCertificateData;
use App\Enums\ResourceStatus;
use App\Models\SslCertificate;
use App\Services\ActivityLogService;
use App\Services\SslService;
use Illuminate\Support\Facades\DB;

class CreateSslCertificateAction
{
    public function __construct(
        private readonly SslService $sslService,
        private readonly ActivityLogService $activityLogService,
    ) {}

    public function execute(SslCertificateData $data, bool $provision = true): SslCertificate
    {
        return DB::transaction(function () use ($data, $provision): SslCertificate {
            $certificate = SslCertificate::query()->create([
                'project_id' => $data->projectId,
                'domain_id' => $data->domainId,
                'domain_name' => $data->domainName,
                'auto_renew' => $data->autoRenew ?? true,
                'status' => ResourceStatus::Pending,
                'notes' => $data->notes,
            ]);

            if ($provision) {
                $email = (string) (config('panel.ssl.email') ?: setting('support_email', config('panel.support_email')));
                $this->sslService->obtain($data->domainName, $email);
                $certificate->update([
                    'status' => ResourceStatus::Active,
                    'issuer' => "Let's Encrypt",
                ]);
            } else {
                $certificate->update(['status' => ResourceStatus::Active]);
            }

            $this->activityLogService->log(
                action: 'ssl.created',
                description: "SSL certificate for \"{$certificate->domain_name}\" was created.",
                subject: $certificate,
            );

            return $certificate;
        });
    }
}
