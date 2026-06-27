<?php

namespace App\Provision\Engine;

use App\Provision\Contracts\TaskInterface;
use App\Services\ActivityLogService;
use Throwable;

class ProvisionEngine
{
    public function __construct(
        private readonly ActivityLogService $activityLogService,
    ) {}

    /**
     * @param  list<TaskInterface>  $tasks
     */
    public function execute(ProvisionContext $context, array $tasks): ProvisionResult
    {
        $results = [];
        $executed = [];

        foreach ($tasks as $task) {
            try {
                $validation = $task->validate($context);

                $this->logTask($task->name(), 'validate', $validation, $context);

                if (! $validation->success) {
                    return $this->failWithRollback($context, $executed, $results, $task->name(), $validation->message);
                }

                $result = $task->execute($context);

                $this->logTask($task->name(), 'execute', $result, $context);

                $results[] = [
                    'name' => $task->name(),
                    'success' => $result->success,
                    'message' => $result->message,
                ];

                if (! $result->success) {
                    return $this->failWithRollback($context, $executed, $results, $task->name(), $result->message);
                }

                $executed[] = $task;

                foreach ($result->output as $key => $value) {
                    $context->set($key, $value);
                }
            } catch (Throwable $exception) {
                $results[] = [
                    'name' => $task->name(),
                    'success' => false,
                    'message' => $exception->getMessage(),
                ];

                $this->activityLogService->log(
                    action: 'provision.task.failed',
                    description: "Task \"{$task->name()}\" threw an exception.",
                    status: 'failed',
                    subject: $context->resource,
                    properties: ['task' => $task->name(), 'error' => $exception->getMessage()],
                );

                return $this->failWithRollback($context, $executed, $results, $task->name(), $exception->getMessage());
            }
        }

        return ProvisionResult::success('All tasks completed successfully.', $results);
    }

    public function executeTask(ProvisionContext $context, TaskInterface $task): TaskResult
    {
        $validation = $task->validate($context);
        $this->logTask($task->name(), 'validate', $validation, $context);

        if (! $validation->success) {
            return $validation;
        }

        $result = $task->execute($context);
        $this->logTask($task->name(), 'execute', $result, $context);

        return $result;
    }

    public function healthCheck(ProvisionContext $context, array $tasks): ProvisionResult
    {
        $results = [];

        foreach ($tasks as $task) {
            $result = $task->health($context);
            $results[] = ['name' => $task->name(), 'success' => $result->success, 'message' => $result->message];

            if (! $result->success) {
                return ProvisionResult::failure("Health check failed for \"{$task->name()}\": {$result->message}", $results);
            }
        }

        return ProvisionResult::success('All health checks passed.', $results);
    }

    /**
     * @param  list<TaskInterface>  $executed
     * @param  list<array{name: string, success: bool, message: string}>  $results
     */
    private function failWithRollback(
        ProvisionContext $context,
        array $executed,
        array $results,
        string $failedTask,
        string $message,
    ): ProvisionResult {
        $this->activityLogService->log(
            action: 'provision.failed',
            description: "Provisioning failed at task \"{$failedTask}\".",
            status: 'failed',
            subject: $context->resource,
            properties: ['task' => $failedTask, 'error' => $message],
        );

        foreach (array_reverse($executed) as $task) {
            try {
                $rollback = $task->rollback($context);
                $this->logTask($task->name(), 'rollback', $rollback, $context);
            } catch (Throwable $exception) {
                $this->activityLogService->log(
                    action: 'provision.rollback.failed',
                    description: "Rollback failed for task \"{$task->name()}\".",
                    status: 'failed',
                    subject: $context->resource,
                    properties: ['task' => $task->name(), 'error' => $exception->getMessage()],
                );
            }
        }

        return ProvisionResult::failure("Task \"{$failedTask}\" failed: {$message}", $results);
    }

    private function logTask(string $name, string $phase, TaskResult $result, ProvisionContext $context): void
    {
        $this->activityLogService->log(
            action: "provision.task.{$phase}",
            description: "Task \"{$name}\" {$phase}: ".($result->message ?: ($result->success ? 'ok' : 'failed')),
            status: $result->success ? 'success' : 'failed',
            subject: $context->resource,
            properties: ['task' => $name, 'phase' => $phase],
        );
    }
}
