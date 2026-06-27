<?php

namespace App\Provision\Tasks;

use App\Enums\ResourceStatus;
use App\Provision\Contracts\TaskInterface;
use App\Provision\Engine\ProvisionContext;
use App\Provision\Engine\TaskResult;

class SaveMetadataTask implements TaskInterface
{
    public function name(): string
    {
        return 'save_metadata';
    }

    public function execute(ProvisionContext $context): TaskResult
    {
        $resource = $context->resource;

        $updates = array_filter([
            'status' => ResourceStatus::Active,
            'root_path' => $context->get('root_path'),
            'deploy_path' => $context->get('deploy_path'),
            'linux_user' => $context->get('linux_user'),
            'metadata' => $context->get('metadata'),
        ], fn ($value) => $value !== null);

        if ($updates !== []) {
            $resource->update($updates);
        }

        return TaskResult::success('Metadata saved.');
    }
}
