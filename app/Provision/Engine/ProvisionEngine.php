<?php

namespace App\Provision\Engine;

use App\Provision\Contracts\TaskInterface;
use Throwable;

class ProvisionEngine
{
    /**
     * @param  list<TaskInterface>  $tasks
     */
    public function execute(ProvisionContext $context, array $tasks): ProvisionResult
    {
        $results = [];

        foreach ($tasks as $task) {
            try {
                $result = $task->execute($context);

                $results[] = [
                    'name' => $task->name(),
                    'success' => $result->success,
                    'message' => $result->message,
                ];

                if (! $result->success) {
                    return ProvisionResult::failure(
                        "Task \"{$task->name()}\" failed: {$result->message}",
                        $results,
                    );
                }

                foreach ($result->output as $key => $value) {
                    $context->set($key, $value);
                }
            } catch (Throwable $exception) {
                $results[] = [
                    'name' => $task->name(),
                    'success' => false,
                    'message' => $exception->getMessage(),
                ];

                return ProvisionResult::failure(
                    "Task \"{$task->name()}\" threw an exception: {$exception->getMessage()}",
                    $results,
                );
            }
        }

        return ProvisionResult::success('All tasks completed successfully.', $results);
    }

    public function executeTask(ProvisionContext $context, TaskInterface $task): TaskResult
    {
        return $task->execute($context);
    }
}
