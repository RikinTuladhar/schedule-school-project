<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MasterScheduleRun extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_id',
        'status',
        'total_sections',
        'processed_sections',
        'failed_sections',
        'error_message',
        'started_at',
        'finished_at',
    ];

    protected function casts(): array
    {
        return [
            'started_at' => 'datetime',
            'finished_at' => 'datetime',
        ];
    }

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function entries(): HasMany
    {
        return $this->hasMany(MasterScheduleEntry::class);
    }
}
