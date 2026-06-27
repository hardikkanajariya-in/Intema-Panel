<?php

namespace App\Provision\Tasks;

use App\Provision\Engine\ProvisionContext;
use App\Provision\Engine\TaskResult;
use App\Services\PostgresService;
use Illuminate\Support\Facades\File;

class CreateFolderTask extends AbstractTask
{
    public function name(): string
    {
        return 'create_folder';
    }

    public function validate(ProvisionContext $context): TaskResult
    {
        $path = (string) $context->get('folder_path');

        if ($path === '') {
            return TaskResult::failure('Folder path is required.');
        }

        return TaskResult::success();
    }

    public function execute(ProvisionContext $context): TaskResult
    {
        $path = (string) $context->get('folder_path');

        if (File::isDirectory($path)) {
            return TaskResult::success("Folder already exists: {$path}", ['folder_existed' => true]);
        }

        if (! File::makeDirectory($path, 0755, true)) {
            return TaskResult::failure("Failed to create folder: {$path}");
        }

        return TaskResult::success("Created folder: {$path}", ['folder_created' => true, 'folder_path' => $path]);
    }

    public function rollback(ProvisionContext $context): TaskResult
    {
        if (! $context->get('folder_created')) {
            return TaskResult::success('Folder was not created by this task.');
        }

        $path = (string) $context->get('folder_path');

        if ($path !== '' && is_dir($path)) {
            @rmdir($path);
        }

        return TaskResult::success("Rolled back folder: {$path}");
    }

    public function health(ProvisionContext $context): TaskResult
    {
        $path = (string) $context->get('folder_path');

        if ($path === '' || ! is_dir($path)) {
            return TaskResult::failure("Folder does not exist: {$path}");
        }

        return TaskResult::success('Folder exists.');
    }
}
