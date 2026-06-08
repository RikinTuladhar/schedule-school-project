<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Teacher extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_id',
        'full_name',
        'employment_type',
        'max_daily_classes',
        'ai_context_notes',
        'availability',
        'assignments',
        'allow_multiple_sessions',
    ];

    protected $appends = [
        'assignments_count',
    ];

    protected function casts(): array
    {
        return [
            'availability' => 'array',
            'assignments' => 'array',
            'max_daily_classes' => 'integer',
            'allow_multiple_sessions' => 'boolean',
        ];
    }

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function getAssignmentsCountAttribute(): int
    {
        return count($this->assignments ?? []);
    }
}
