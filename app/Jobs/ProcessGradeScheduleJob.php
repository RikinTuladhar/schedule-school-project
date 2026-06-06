<?php

namespace App\Jobs;

use App\Ai\Agents\MasterScheduleAgent;
use App\Models\GradeSection;
use App\Models\MasterScheduleEntry;
use App\Models\MasterScheduleRun;
use App\Services\ScheduleDataService;
use Illuminate\Bus\Batchable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Laravel\Ai\Exceptions\ProviderOverloadedException;
use Laravel\Ai\Exceptions\RateLimitedException;
use Throwable;

class ProcessGradeScheduleJob implements ShouldQueue
{
    use Batchable, Queueable;

    public int $timeout = 300;

    public int $tries = 5;

    /**
     * @var array<int, int>
     */
    public array $backoff = [30, 120, 300, 600];

    public function __construct(
        public int $schoolId,
        public int $gradeSectionId,
        public int $masterScheduleRunId
    ) {}

    public function handle(ScheduleDataService $scheduleDataService): void
    {
        if ($this->batch()?->cancelled()) {
            return;
        }

        $gradeSection = GradeSection::query()
            ->with(['gradeModel', 'sectionModel', 'scheduleTemplate'])
            ->where('school_id', $this->schoolId)
            ->findOrFail($this->gradeSectionId);

        $context = $this->withGlobalTeacherBookings(
            $scheduleDataService->forGradeSection($this->schoolId, $gradeSection)
        );

        try {
            $response = MasterScheduleAgent::make()->prompt(
                prompt: $this->buildPrompt($context),
                timeout: 300,
            );
        } catch (RateLimitedException|ProviderOverloadedException $exception) {
            $this->releaseForProviderPressure($exception);

            return;
        }

        $rows = $this->extractScheduleRows($response->toArray());

        try {
            $this->persistValidatedSchedule($gradeSection, $context, $rows);
        } catch (\RuntimeException $exception) {
            if ($this->isRetryableGlobalConflict($exception)) {
                $this->releaseForGlobalConflict($exception);

                return;
            }

            throw $exception;
        }
    }

    /**
     * @param  array<string, mixed>  $context
     */
    private function buildPrompt(array $context): string
    {
        return <<<'PROMPT'
Generate a schedule for the single grade section in this JSON context.

The context has already removed Break and Assembly periods from schedule_template.available_time_slots. You may only use those available slots.

Use teacher assignments as weekly quota targets. Each assignment includes the subject, sessions_per_week, and max_sessions_per_day.

Hard global constraint: schedule_context.global_teacher_bookings lists teachers already placed in other grade sections for this run. Do not schedule a teacher into any matching day + time_slot combination from that list.

Return the best valid schedule for this grade section only.

Context JSON:
PROMPT.PHP_EOL.json_encode($context, JSON_THROW_ON_ERROR | JSON_PRETTY_PRINT);
    }

    /**
     * @param  array<string, mixed>  $context
     * @return array<string, mixed>
     */
    private function withGlobalTeacherBookings(array $context): array
    {
        $context['schedule_context'] = [
            'global_teacher_bookings' => MasterScheduleEntry::query()
                ->where('master_schedule_run_id', $this->masterScheduleRunId)
                ->where('grade_section_id', '!=', $this->gradeSectionId)
                ->orderBy('day')
                ->orderBy('time_slot')
                ->orderBy('teacher')
                ->get(['grade_section', 'day', 'time_slot', 'teacher', 'subject'])
                ->map(fn (MasterScheduleEntry $entry): array => [
                    'grade_section' => $entry->grade_section,
                    'day' => $entry->day,
                    'time_slot' => $entry->time_slot,
                    'teacher' => $entry->teacher,
                    'subject' => $entry->subject,
                ])
                ->values()
                ->all(),
        ];

        return $context;
    }

    /**
     * @param  array<string, mixed>  $structured
     * @return array<int, array<string, string>>
     */
    private function extractScheduleRows(array $structured): array
    {
        return collect($structured['schedule'] ?? [])
            ->filter(fn (mixed $row): bool => is_array($row))
            ->map(fn (array $row): array => [
                'grade_section' => trim((string) ($row['grade_section'] ?? '')),
                'day' => trim((string) ($row['day'] ?? '')),
                'time_slot' => $this->normalizeTimeSlot((string) ($row['time_slot'] ?? '')),
                'teacher' => trim((string) ($row['teacher'] ?? '')),
                'subject' => trim((string) ($row['subject'] ?? '')),
            ])
            ->values()
            ->all();
    }

    /**
     * @param  array<string, mixed>  $context
     * @param  array<int, array<string, string>>  $rows
     */
    private function persistValidatedSchedule(GradeSection $gradeSection, array $context, array $rows): void
    {
        Cache::lock("master-schedule-run:{$this->masterScheduleRunId}:validation", 60)
            ->block(15, function () use ($gradeSection, $context, $rows): void {
                DB::transaction(function () use ($gradeSection, $context, $rows): void {
                    $this->validateRows($context, $rows);
                    $this->validateGlobalTeacherState($rows);

                    MasterScheduleEntry::query()
                        ->where('master_schedule_run_id', $this->masterScheduleRunId)
                        ->where('grade_section_id', $gradeSection->id)
                        ->delete();

                    $entries = collect($rows)
                        ->map(fn (array $row): array => [
                            'master_schedule_run_id' => $this->masterScheduleRunId,
                            'school_id' => $this->schoolId,
                            'grade_section_id' => $gradeSection->id,
                            'grade_section' => $row['grade_section'],
                            'day' => $row['day'],
                            'time_slot' => $row['time_slot'],
                            'teacher' => $row['teacher'],
                            'subject' => $row['subject'],
                            'metadata' => json_encode(['source' => 'laravel-ai-master-schedule-agent']),
                            'created_at' => now(),
                            'updated_at' => now(),
                        ])
                        ->all();

                    if ($entries !== []) {
                        MasterScheduleEntry::insert($entries);
                    }

                    $this->markSectionProcessed();
                });
            });
    }

    /**
     * @param  array<string, mixed>  $context
     * @param  array<int, array<string, string>>  $rows
     */
    private function validateRows(array $context, array $rows): void
    {
        $gradeSectionName = (string) data_get($context, 'grade_section.name');
        $allowedDays = collect(data_get($context, 'schedule_template.days', []))->map(fn (mixed $day): string => (string) $day);
        $allowedSlots = collect(data_get($context, 'schedule_template.available_time_slots', []))
            ->pluck('time_slot')
            ->map(fn (mixed $slot): string => (string) $slot);

        $teacherNames = collect(data_get($context, 'teachers', []))
            ->pluck('full_name')
            ->map(fn (mixed $teacher): string => (string) $teacher);

        $subjectNames = collect(data_get($context, 'teachers', []))
            ->flatMap(fn (array $teacher): array => $teacher['assignments'] ?? [])
            ->pluck('subject')
            ->map(fn (mixed $subject): string => (string) $subject)
            ->unique();

        $teacherSubjectPairs = collect(data_get($context, 'teachers', []))
            ->flatMap(fn (array $teacher): array => collect($teacher['assignments'] ?? [])
                ->map(fn (array $assignment): string => $this->teacherSubjectKey(
                    (string) ($teacher['full_name'] ?? ''),
                    (string) ($assignment['subject'] ?? '')
                ))
                ->all())
            ->flip();

        $subjectPerDay = [];
        $teacherPerSlot = [];

        foreach ($rows as $row) {
            if ($row['grade_section'] !== $gradeSectionName) {
                throw new \RuntimeException("Invalid grade_section [{$row['grade_section']}] returned by AI.");
            }

            if (! $allowedDays->contains($row['day'])) {
                throw new \RuntimeException("Invalid day [{$row['day']}] returned by AI.");
            }

            if (! $allowedSlots->contains($row['time_slot'])) {
                throw new \RuntimeException("Invalid or blocked time slot [{$row['time_slot']}] returned by AI.");
            }

            if (! $teacherNames->contains($row['teacher'])) {
                throw new \RuntimeException("Unknown teacher [{$row['teacher']}] returned by AI.");
            }

            if (! $subjectNames->contains($row['subject'])) {
                throw new \RuntimeException("Unknown subject [{$row['subject']}] returned by AI.");
            }

            if (! $teacherSubjectPairs->has($this->teacherSubjectKey($row['teacher'], $row['subject']))) {
                throw new \RuntimeException("Teacher [{$row['teacher']}] is not assigned to subject [{$row['subject']}] for this grade section.");
            }

            $subjectKey = implode('|', [$row['grade_section'], $row['day'], mb_strtolower($row['subject'])]);

            if (isset($subjectPerDay[$subjectKey])) {
                throw new \RuntimeException("Subject [{$row['subject']}] appears more than once on [{$row['day']}] for [{$row['grade_section']}].");
            }

            $subjectPerDay[$subjectKey] = true;

            $teacherSlotKey = implode('|', [$row['day'], $row['time_slot'], mb_strtolower($row['teacher'])]);

            if (isset($teacherPerSlot[$teacherSlotKey])) {
                throw new \RuntimeException("Teacher [{$row['teacher']}] is double-booked inside the generated section payload.");
            }

            $teacherPerSlot[$teacherSlotKey] = true;
        }
    }

    private function teacherSubjectKey(string $teacher, string $subject): string
    {
        return mb_strtolower(trim($teacher)).'|'.mb_strtolower(trim($subject));
    }

    private function normalizeTimeSlot(string $slot): string
    {
        return preg_replace('/\s*-\s*/', '-', trim($slot)) ?? trim($slot);
    }

    /**
     * Mockable backtracking/global-state validation boundary.
     *
     * @param  array<int, array<string, string>>  $rows
     */
    private function validateGlobalTeacherState(array $rows): void
    {
        foreach ($rows as $row) {
            $alreadyBooked = MasterScheduleEntry::query()
                ->where('master_schedule_run_id', $this->masterScheduleRunId)
                ->where('grade_section_id', '!=', $this->gradeSectionId)
                ->where('day', $row['day'])
                ->where('time_slot', $row['time_slot'])
                ->where('teacher', $row['teacher'])
                ->exists();

            if ($alreadyBooked) {
                throw new \RuntimeException("Global conflict: teacher [{$row['teacher']}] is already booked on [{$row['day']}] at [{$row['time_slot']}].");
            }
        }
    }

    private function markSectionProcessed(): void
    {
        $run = MasterScheduleRun::query()->findOrFail($this->masterScheduleRunId);
        $run->increment('processed_sections');
        $this->completeRunIfFinished($run->fresh());
    }

    private function markSectionFailed(string $message): void
    {
        $run = MasterScheduleRun::query()->find($this->masterScheduleRunId);

        if (! $run) {
            return;
        }

        $run->increment('failed_sections');
        $run->forceFill(['error_message' => $message])->save();
        $this->completeRunIfFinished($run->fresh());
    }

    private function completeRunIfFinished(MasterScheduleRun $run): void
    {
        if ($run->processed_sections + $run->failed_sections < $run->total_sections) {
            return;
        }

        $run->update([
            'status' => $run->failed_sections > 0 ? 'completed_with_errors' : 'completed',
            'finished_at' => now(),
        ]);
    }

    private function releaseForProviderPressure(RateLimitedException|ProviderOverloadedException $exception): void
    {
        Log::warning('AI provider temporarily unavailable while generating schedule.', [
            'school_id' => $this->schoolId,
            'grade_section_id' => $this->gradeSectionId,
            'run_id' => $this->masterScheduleRunId,
            'attempt' => $this->attempts(),
            'exception' => $exception->getMessage(),
        ]);

        if ($this->attempts() >= $this->tries) {
            throw $exception;
        }

        $this->release($this->backoff[min($this->attempts() - 1, count($this->backoff) - 1)]);
    }

    private function isRetryableGlobalConflict(\RuntimeException $exception): bool
    {
        return str_starts_with($exception->getMessage(), 'Global conflict:')
            && $this->attempts() < $this->tries;
    }

    private function releaseForGlobalConflict(\RuntimeException $exception): void
    {
        Log::warning('AI generated a schedule with a global teacher conflict; retrying with updated bookings.', [
            'school_id' => $this->schoolId,
            'grade_section_id' => $this->gradeSectionId,
            'run_id' => $this->masterScheduleRunId,
            'attempt' => $this->attempts(),
            'exception' => $exception->getMessage(),
        ]);

        $this->release($this->backoff[min($this->attempts() - 1, count($this->backoff) - 1)]);
    }

    public function failed(Throwable $exception): void
    {
        Log::error('Grade schedule generation failed.', [
            'school_id' => $this->schoolId,
            'grade_section_id' => $this->gradeSectionId,
            'run_id' => $this->masterScheduleRunId,
            'exception' => $exception->getMessage(),
        ]);

        $this->markSectionFailed($exception->getMessage());
    }
}
