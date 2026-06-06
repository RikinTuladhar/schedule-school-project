<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MasterScheduleEntry extends Model
{
    use HasFactory;

    protected $fillable = [
        'master_schedule_run_id',
        'school_id',
        'grade_section_id',
        'grade_section',
        'day',
        'time_slot',
        'teacher',
        'subject',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'metadata' => 'array',
        ];
    }

    public function run(): BelongsTo
    {
        return $this->belongsTo(MasterScheduleRun::class, 'master_schedule_run_id');
    }

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function gradeSection(): BelongsTo
    {
        return $this->belongsTo(GradeSection::class);
    }
}
