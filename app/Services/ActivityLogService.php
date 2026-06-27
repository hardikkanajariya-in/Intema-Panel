<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class ActivityLogService
{
    public function log(
        string $action,
        string $description,
        string $status = 'success',
        ?Model $subject = null,
        ?User $actor = null,
        ?array $properties = null,
    ): ActivityLog {
        return ActivityLog::query()->create([
            'action' => $action,
            'actor_id' => ($actor ?? Auth::user())?->id,
            'status' => $status,
            'subject_type' => $subject?->getMorphClass(),
            'subject_id' => $subject?->getKey(),
            'description' => $description,
            'properties' => $properties,
        ]);
    }

    /**
     * @return LengthAwarePaginator<int, ActivityLog>
     */
    public function paginate(int $perPage = 20): LengthAwarePaginator
    {
        return ActivityLog::query()
            ->with('actor')
            ->latest('created_at')
            ->paginate($perPage)
            ->withQueryString();
    }
}
