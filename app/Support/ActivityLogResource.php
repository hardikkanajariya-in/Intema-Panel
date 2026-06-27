<?php

namespace App\Support;

use App\Models\ActivityLog;

class ActivityLogResource
{
    /**
     * @return array<string, mixed>
     */
    public static function make(ActivityLog $log): array
    {
        return [
            'id' => $log->id,
            'action' => $log->action,
            'status' => $log->status,
            'description' => $log->description,
            'actor' => $log->actor?->name,
            'properties' => $log->properties,
            'created_at' => $log->created_at?->toIso8601String(),
        ];
    }

    /**
     * @param  iterable<int, ActivityLog>  $logs
     * @return list<array<string, mixed>>
     */
    public static function collection(iterable $logs): array
    {
        $result = [];

        foreach ($logs as $log) {
            $result[] = self::make($log);
        }

        return $result;
    }
}
