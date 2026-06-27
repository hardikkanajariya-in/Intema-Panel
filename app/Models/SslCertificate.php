<?php

namespace App\Models;

use App\Enums\ResourceStatus;
use App\Models\Concerns\HasAuditFields;
use App\Models\Concerns\HasUuid;
use Database\Factories\SslCertificateFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $uuid
 * @property int|null $project_id
 * @property int|null $domain_id
 * @property string $domain_name
 * @property string|null $issuer
 * @property Carbon|null $expires_at
 * @property bool $auto_renew
 * @property ResourceStatus $status
 * @property string|null $certificate_path
 * @property string|null $notes
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 */
#[Fillable([
    'uuid',
    'project_id',
    'domain_id',
    'domain_name',
    'issuer',
    'expires_at',
    'auto_renew',
    'status',
    'certificate_path',
    'notes',
    'created_by',
    'updated_by',
])]
class SslCertificate extends Model
{
    /** @use HasFactory<SslCertificateFactory> */
    use HasAuditFields, HasFactory, HasUuid, SoftDeletes;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => ResourceStatus::class,
            'expires_at' => 'datetime',
            'auto_renew' => 'boolean',
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
     * @return BelongsTo<Domain, $this>
     */
    public function domain(): BelongsTo
    {
        return $this->belongsTo(Domain::class);
    }

    /**
     * @return HasOne<Domain, $this>
     */
    public function linkedDomain(): HasOne
    {
        return $this->hasOne(Domain::class, 'ssl_certificate_id');
    }

    /**
     * @return MorphMany<ActivityLog, $this>
     */
    public function activityLogs(): MorphMany
    {
        return $this->morphMany(ActivityLog::class, 'subject');
    }
}
