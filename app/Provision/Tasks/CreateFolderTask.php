<?php

namespace App\Provision\Tasks;

use App\Provision\Contracts\TaskInterface;
use App\Provision\Engine\ProvisionContext;
use App\Provision\Engine\TaskResult;
use Illuminate\Support\Facades\File;

class CreateFolderTask implements TaskInterface
{
    public function name(): string
    {
        return 'create_folder';
    }

    public function execute(ProvisionContext $context): TaskResult
    {
        $path = (string) $context->get('folder_path');

        if ($path === '') {
            return TaskResult::failure('Folder path is required.');
        }

        if (File::isDirectory($path)) {
            return TaskResult::success("Folder already exists: {$path}");
        }

        if (! File::makeDirectory($path, 0755, true)) {
            return TaskResult::failure("Failed to create folder: {$path}");
        }

        return TaskResult::success("Created folder: {$path}");
    }
}
