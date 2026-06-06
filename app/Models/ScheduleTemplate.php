<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ScheduleTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_id',
        'name',
        'level',
        'start_time',
        'end_time',
        'grade_ids',
        'days',
        'periods',
    ];

    protected function casts(): array
    {
        return [
            'grade_ids' => 'array',
            'days' => 'array',
            'periods' => 'array',
        ];
    }

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }
}
