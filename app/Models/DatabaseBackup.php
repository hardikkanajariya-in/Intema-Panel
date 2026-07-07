<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DatabaseBackup extends Model
{
    use HasUuid;

    protected $fillable = [
        'uuid',
        'managed_database_id',
        'filename',
        'path',
        'size',
    ];

    /**
     * @return BelongsTo<ManagedDatabase, $this>
     */
    public function database(): BelongsTo
    {
        return $this->belongsTo(ManagedDatabase::class, 'managed_database_id');
    }
}
