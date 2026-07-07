<?php

namespace App\Models;

use App\Enums\ResourceStatus;
use App\Models\Concerns\HasAuditFields;
use App\Models\Concerns\HasUuid;
use Database\Factories\DomainFactory;
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
 * @property int|null $project_id
 * @property int|null $application_id
 * @property string $hostname
 * @property string|null $nginx_site
 * @property string|null $document_root
 * @property int|null $ssl_certificate_id
 * @property ResourceStatus $status
 * @property string|null $notes
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string $source
 * @property Carbon|null $deleted_at
 */
#[Fillable([
    'uuid',
    'project_id',
    'application_id',
    'hostname',
    'nginx_site',
    'document_root',
    'ssl_active',
    'status',
    'source',
    'notes',
    'created_by',
    'updated_by',
])]
class Domain extends Model
{
    public const SOURCE_SYSTEM = 'system';
    public const SOURCE_CLOUDFLARE = 'cloudflare';

    /** @use HasFactory<DomainFactory> */
    use HasAuditFields, HasFactory, HasUuid, SoftDeletes;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => ResourceStatus::class,
            'ssl_active' => 'boolean',
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
