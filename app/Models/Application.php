<?php

namespace App\Models;

use App\Enums\ApplicationType;
use App\Enums\ResourceStatus;
use App\Models\Concerns\HasAuditFields;
use App\Models\Concerns\HasUuid;
use Database\Factories\ApplicationFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $uuid
 * @property int|null $project_id
 * @property string $name
 * @property ApplicationType $type
 * @property ResourceStatus $status
 * @property string|null $root_path
 * @property string|null $repository_url
 * @property string $repository_branch
 * @property string|null $deploy_path
 * @property string|null $runtime
 * @property string|null $build_command
 * @property string|null $start_command
 * @property array<string, string>|null $environment_variables
 * @property string|null $linux_user
 * @property array<string, mixed>|null $metadata
 * @property string|null $notes
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 */
#[Fillable([
    'uuid',
    'project_id',
    'name',
    'type',
    'status',
    'root_path',
    'repository_url',
    'repository_branch',
    'deploy_path',
    'runtime',
    'build_command',
    'start_command',
    'environment_variables',
    'linux_user',
    'metadata',
    'notes',
    'created_by',
    'updated_by',
])]
#[Hidden(['environment_variables'])]
class Application extends Model
{
    /** @use HasFactory<ApplicationFactory> */
    use HasAuditFields, HasFactory, HasUuid, SoftDeletes;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => ApplicationType::class,
            'status' => ResourceStatus::class,
            'environment_variables' => 'encrypted:array',
            'metadata' => 'array',
        ];
    }

    /**
     * @return BelongsTo<Project, $this>
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * @return HasMany<ManagedDatabase, $this>
     */
    public function databases(): HasMany
    {
        return $this->hasMany(ManagedDatabase::class);
    }

    /**
     * @return HasMany<Domain, $this>
     */
    public function domains(): HasMany
    {
        return $this->hasMany(Domain::class);
    }

    /**
     * @return HasMany<Deployment, $this>
     */
    public function deployments(): HasMany
    {
        return $this->hasMany(Deployment::class);
    }

    /**
     * @return MorphMany<ActivityLog, $this>
     */
    public function activityLogs(): MorphMany
    {
        return $this->morphMany(ActivityLog::class, 'subject');
    }
}
