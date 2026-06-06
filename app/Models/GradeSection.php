<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GradeSection extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_id',
        'grade_id',
        'section_id',
        'schedule_template_id',
    ];

    protected $appends = [
        'name',
        'grade',
        'section',
    ];

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function gradeModel(): BelongsTo
    {
        return $this->belongsTo(Grade::class, 'grade_id');
    }

    public function sectionModel(): BelongsTo
    {
        return $this->belongsTo(Section::class, 'section_id');
    }

    public function scheduleTemplate(): BelongsTo
    {
        return $this->belongsTo(ScheduleTemplate::class, 'schedule_template_id');
    }

    public function getNameAttribute(): string
    {
        return trim(($this->gradeModel?->name ?? '').($this->sectionModel?->name ?? ''));
    }

    public function getGradeAttribute(): ?string
    {
        return $this->gradeModel?->name;
    }

    public function getSectionAttribute(): ?string
    {
        return $this->sectionModel?->name;
    }
}
