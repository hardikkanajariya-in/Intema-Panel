<?php

namespace App\Models;

use App\Enums\ResourceStatus;
use App\Models\Concerns\HasAuditFields;
use App\Models\Concerns\HasUuid;
use Database\Factories\ManagedDatabaseFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $uuid
 * @property int|null $project_id
 * @property int|null $application_id
 * @property string $name
 * @property string $database_name
 * @property string $database_user
 * @property string $database_password_encrypted
 * @property string $host
 * @property int $port
 * @property ResourceStatus $status
 * @property string|null $notes
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 */
#[Fillable([
    'uuid',
    'project_id',
    'application_id',
    'name',
    'database_name',
    'database_user',
    'database_password_encrypted',
    'host',
    'port',
    'status',
    'notes',
    'created_by',
    'updated_by',
])]
#[Hidden(['database_password_encrypted'])]
class ManagedDatabase extends Model
{
    /** @use HasFactory<ManagedDatabaseFactory> */
    use HasAuditFields, HasFactory, HasUuid, SoftDeletes;

    protected $table = 'databases';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => ResourceStatus::class,
            'database_password_encrypted' => 'encrypted',
            'port' => 'integer',
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
