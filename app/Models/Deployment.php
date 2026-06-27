<?php

namespace App\Models;

use App\Enums\DeploymentStatus;
use App\Models\Concerns\HasAuditFields;
use App\Models\Concerns\HasUuid;
use Database\Factories\DeploymentFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $uuid
 * @property int $application_id
 * @property DeploymentStatus $status
 * @property string $branch
 * @property string|null $commit_hash
 * @property Carbon|null $deployed_at
 * @property string|null $deploy_path
 * @property string|null $build_output
 * @property string|null $error_output
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 */
#[Fillable([
    'uuid',
    'application_id',
    'status',
    'branch',
    'commit_hash',
    'deployed_at',
    'deploy_path',
    'build_output',
    'error_output',
    'created_by',
    'updated_by',
])]
class Deployment extends Model
{
    /** @use HasFactory<DeploymentFactory> */
    use HasAuditFields, HasFactory, HasUuid, SoftDeletes;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => DeploymentStatus::class,
            'deployed_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Application, $this>
     */
    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }

    /**
     * @return MorphMany<ActivityLog, $this>
     */
    public function activityLogs(): MorphMany
    {
        return $this->morphMany(ActivityLog::class, 'subject');
    }
}
