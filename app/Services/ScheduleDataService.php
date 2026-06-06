<?php

namespace App\Services;

use App\Models\GradeSection;
use App\Models\ScheduleTemplate;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Collection;
use RuntimeException;

class ScheduleDataService
{
    /**
     * Build a compact CSP context matrix for one grade section.
     *
     * @return array<string, mixed>
     */
    public function forGradeSection(int $schoolId, GradeSection $gradeSection): array
    {
        $gradeSection->loadMissing(['gradeModel', 'sectionModel', 'scheduleTemplate']);

        if ((int) $gradeSection->school_id !== $schoolId) {
            throw new RuntimeException('Grade section does not belong to the requested school.');
        }

        $template = $gradeSection->scheduleTemplate;

        if (! $template instanceof ScheduleTemplate) {
            throw new RuntimeException("Grade section [{$gradeSection->id}] does not have a valid schedule template.");
        }

        $days = $template->days ?: ['M', 'T', 'W', 'Th', 'F'];
        $availableTimeSlots = $this->availableTimeSlots($template);
        $teachers = $this->teachersForGradeSection($schoolId, $gradeSection);

        if ($availableTimeSlots === []) {
            throw new RuntimeException("Schedule template [{$template->id}] does not have any academic time slots.");
        }

        return [
            'school_id' => $schoolId,
            'grade_section' => [
                'id' => $gradeSection->id,
                'name' => $gradeSection->name,
                'grade' => $gradeSection->grade,
                'section' => $gradeSection->section,
            ],
            'schedule_template' => [
                'id' => $template->id,
                'name' => $template->name,
                'level' => $template->level,
                'days' => $days,
                'periods' => $this->templatePeriods($template),
                'available_time_slots' => $availableTimeSlots,
                'removed_time_slots' => $this->removedTimeSlots($template),
            ],
            'hard_constraints' => [
                'max_one_subject_session_per_day_per_class' => true,
                'never_schedule_during_break' => true,
                'teacher_double_booking_forbidden' => true,
                'back_to_back_same_teacher_grade_allowed' => true,
            ],
            'teachers' => $teachers,
        ];
    }

    /**
     * Build context matrices for multiple sections.
     *
     * @param  EloquentCollection<int, GradeSection>|Collection<int, GradeSection>|array<int, GradeSection>  $gradeSections
     * @return array<int, array<string, mixed>>
     */
    public function forGradeSections(int $schoolId, EloquentCollection|Collection|array $gradeSections): array
    {
        return collect($gradeSections)
            ->map(fn (GradeSection $gradeSection): array => $this->forGradeSection($schoolId, $gradeSection))
            ->values()
            ->all();
    }

    /**
     * AC-3 style pre-filtering: only hand non-break slots to the LLM.
     *
     * @return array<int, array<string, string>>
     */
    private function availableTimeSlots(ScheduleTemplate $template): array
    {
        return collect($this->templatePeriods($template))
            ->filter(fn (array $period): bool => ! $this->isBlockedPeriod($period))
            ->map(fn (array $period): array => [
                'time_slot' => $this->formatTimeSlot($period),
                'type' => (string) ($period['type'] ?? 'academic'),
            ])
            ->values()
            ->all();
    }

    /**
     * Keep removed slots explicit for auditability; they are not candidate slots.
     *
     * @return array<int, array<string, string>>
     */
    private function removedTimeSlots(ScheduleTemplate $template): array
    {
        return collect($this->templatePeriods($template))
            ->filter(fn (array $period): bool => $this->isBlockedPeriod($period))
            ->map(fn (array $period): array => [
                'time_slot' => $this->formatTimeSlot($period),
                'type' => (string) ($period['type'] ?? 'break'),
            ])
            ->values()
            ->all();
    }

    private function isBlockedPeriod(array $period): bool
    {
        return in_array(strtolower((string) ($period['type'] ?? 'academic')), ['break', 'assembly'], true);
    }

    private function formatTimeSlot(array $period): string
    {
        return sprintf('%s-%s', $this->normalizeTime($period['start'] ?? ''), $this->normalizeTime($period['end'] ?? ''));
    }

    /**
     * @return array<int, array<string, string>>
     */
    private function templatePeriods(ScheduleTemplate $template): array
    {
        return collect($template->periods ?? [])
            ->map(fn (array $period): array => [
                'start' => $this->normalizeTime($period['start'] ?? ''),
                'end' => $this->normalizeTime($period['end'] ?? ''),
                'type' => strtolower((string) ($period['type'] ?? 'academic')),
            ])
            ->filter(fn (array $period): bool => $period['start'] !== '' && $period['end'] !== '')
            ->values()
            ->all();
    }

    private function normalizeTime(mixed $value): string
    {
        $time = trim((string) $value);

        if (preg_match('/^\d{2}:\d{2}:\d{2}$/', $time)) {
            return substr($time, 0, 5);
        }

        return $time;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function teachersForGradeSection(int $schoolId, GradeSection $gradeSection): array
    {
        $teachers = Teacher::query()
            ->where('school_id', $schoolId)
            ->orderBy('full_name')
            ->get();

        $subjectIds = $teachers
            ->flatMap(fn (Teacher $teacher): array => $teacher->assignments ?? [])
            ->pluck('subject_id')
            ->filter()
            ->map(fn (mixed $id): int => (int) $id)
            ->unique()
            ->values();

        $subjectNames = Subject::query()
            ->where('school_id', $schoolId)
            ->whereIn('id', $subjectIds)
            ->pluck('name', 'id');

        return $teachers
            ->map(function (Teacher $teacher) use ($gradeSection, $subjectNames): ?array {
                $assignments = collect($teacher->assignments ?? [])
                    ->filter(fn (array $assignment): bool => (int) ($assignment['grade_section_id'] ?? 0) === (int) $gradeSection->id)
                    ->map(fn (array $assignment): array => [
                        'subject_id' => (int) ($assignment['subject_id'] ?? 0),
                        'subject' => $subjectNames->get((int) ($assignment['subject_id'] ?? 0), 'Unknown Subject'),
                        'sessions_per_week' => (int) ($assignment['sessions_per_week'] ?? 1),
                        'max_sessions_per_day' => (int) ($assignment['max_sessions_per_day'] ?? 1),
                    ])
                    ->values()
                    ->all();

                if ($assignments === []) {
                    return null;
                }

                return [
                    'id' => $teacher->id,
                    'full_name' => $teacher->full_name,
                    'employment_type' => $teacher->employment_type,
                    'max_daily_classes' => $teacher->max_daily_classes,
                    'availability' => $teacher->availability ?? [],
                    'ai_context_notes' => $teacher->ai_context_notes,
                    'assignments' => $assignments,
                ];
            })
            ->filter()
            ->values()
            ->all();
    }
}
