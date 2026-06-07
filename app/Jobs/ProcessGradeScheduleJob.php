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

    /**
     * @param array<int> $remainingGradeSectionIds
     */
    public function __construct(
        public int $schoolId,
        public int $gradeSectionId,
        public int $masterScheduleRunId,
        public array $remainingGradeSectionIds = []
    ) {}

    public function handle(ScheduleDataService $scheduleDataService): void
    {
        $run = MasterScheduleRun::query()->find($this->masterScheduleRunId);
        if (!$run || in_array($run->status, ['completed', 'failed', 'completed_with_errors'])) {
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

        $rows = $this->extractScheduleRows($response->toArray(), $context);

        try {
            $this->persistValidatedSchedule($gradeSection, $context, $rows);
            $cacheKey = "schedule_run_{$this->masterScheduleRunId}_section_{$this->gradeSectionId}_last_error";
            cache()->forget($cacheKey);
        } catch (\RuntimeException $exception) {
            $cacheKey = "schedule_run_{$this->masterScheduleRunId}_section_{$this->gradeSectionId}_last_error";
            cache()->put($cacheKey, $exception->getMessage(), now()->addMinutes(10));

            if ($this->isRetryableConflict($exception)) {
                $this->releaseForConflict($exception);

                return;
            }

            throw $exception;
        }

        $this->dispatchNextJob();
    }

    /**
     * @param  array<string, mixed>  $context
     */
    private function buildPrompt(array $context): string
    {
        $bookings = data_get($context, 'schedule_context.global_teacher_bookings', []);
        $formattedBookings = $this->formatGlobalBookingsForPrompt($bookings);

        $cacheKey = "schedule_run_{$this->masterScheduleRunId}_section_{$this->gradeSectionId}_last_error";
        $lastError = cache()->get($cacheKey);

        $feedbackPrompt = '';
        if ($lastError) {
            $feedbackPrompt = "\nCRITICAL ERROR FEEDBACK FROM PREVIOUS ATTEMPT:\nYour previous generated schedule failed validation with this error: \"{$lastError}\".\nPlease ensure that your new schedule does not repeat this violation. Correct the placements to resolve this error.\n";
        }

        return <<<PROMPT
Generate a schedule for the single grade section in this JSON context.

The context has already removed Break and Assembly periods from schedule_template.available_time_slots. You may only use those available slots.

Use teacher assignments as weekly quota targets. Each assignment includes the subject, sessions_per_week, and max_sessions_per_day.

{$feedbackPrompt}
CRITICAL HARD CONSTRAINTS:
- Do not schedule a teacher into any matching day + time_slot combination where they are already booked.
- The following list shows teachers already booked in other sections for this run. DO NOT schedule them at these times:
{$formattedBookings}

Return the best valid schedule for this grade section only.

Context JSON:
PROMPT
            . PHP_EOL
            . json_encode($context, JSON_THROW_ON_ERROR | JSON_PRETTY_PRINT);
    }

    /**
     * @param  array<int, array<string, string>>  $bookings
     */
    private function formatGlobalBookingsForPrompt(array $bookings): string
    {
        if (empty($bookings)) {
            return "- None (all teachers are available at all times).";
        }

        $lines = [];
        foreach ($bookings as $booking) {
            $lines[] = sprintf(
                "- Teacher [%s] is already booked on [%s] at [%s] (teaching %s in %s).",
                $booking['teacher'],
                $booking['day'],
                $booking['time_slot'],
                $booking['subject'],
                $booking['grade_section']
            );
        }

        return implode("\n", $lines);
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
    private function extractScheduleRows(array $structured, array $context): array
    {
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

        $slotMap = collect(data_get($context, 'schedule_template.available_time_slots', []))
            ->flatMap(fn (array $slot, int $index): array => [
                'period ' . ($index + 1) => $slot['time_slot'],
                'period_' . ($index + 1) => $slot['time_slot'],
                ($index + 1) . ' period' => $slot['time_slot'],
                ($index + 1) . 'period' => $slot['time_slot'],
                'first period' => $index === 0 ? $slot['time_slot'] : null,
                'second period' => $index === 1 ? $slot['time_slot'] : null,
                'third period' => $index === 2 ? $slot['time_slot'] : null,
                'fourth period' => $index === 3 ? $slot['time_slot'] : null,
                'fifth period' => $index === 4 ? $slot['time_slot'] : null,
                'sixth period' => $index === 5 ? $slot['time_slot'] : null,
                'seventh period' => $index === 6 ? $slot['time_slot'] : null,
                'eighth period' => $index === 7 ? $slot['time_slot'] : null,
                'ninth period' => $index === 8 ? $slot['time_slot'] : null,
                'tenth period' => $index === 9 ? $slot['time_slot'] : null,
            ])
            ->filter();

        return collect($structured['schedule'] ?? [])
            ->filter(fn (mixed $row): bool => is_array($row))
            ->map(fn (array $row): array => [
                'grade_section' => (string) data_get($context, 'grade_section.name'),
                'day' => $this->normalizeDay((string) ($row['day'] ?? ''), $allowedDays),
                'time_slot' => $this->findBestTimeSlot((string) ($row['time_slot'] ?? ''), $allowedSlots, $slotMap),
                'teacher' => $this->normalizeTeacher((string) ($row['teacher'] ?? ''), $teacherNames),
                'subject' => $this->normalizeSubject((string) ($row['subject'] ?? ''), $subjectNames),
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
                    $rows = $this->validateRows($context, $rows);
                    $rows = $this->validateGlobalTeacherState($rows);

                    MasterScheduleEntry::query()
                        ->where('master_schedule_run_id', $this->masterScheduleRunId)
                        ->where('grade_section_id', $gradeSection->id)
                        ->delete();

                    $entries = collect($rows)
                        ->map(fn (array $row): array => [
                            'master_schedule_run_id' => $this->masterScheduleRunId,
                            'school_id' => $this->schoolId,
                            'grade_section_id' => $gradeSection->id,
                            'grade_section' => $gradeSection->name,
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
     * @return array<int, array<string, string>>
     */
    private function validateRows(array $context, array $rows): array
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
        $validRows = [];

        foreach ($rows as $row) {
            $error = null;

            if ($row['grade_section'] !== $gradeSectionName) {
                $error = "Invalid grade_section [{$row['grade_section']}] returned by AI.";
            } elseif (! $allowedDays->contains($row['day'])) {
                $error = "Invalid day [{$row['day']}] returned by AI.";
            } elseif (! $allowedSlots->contains($row['time_slot'])) {
                $error = "Invalid or blocked time slot [{$row['time_slot']}] returned by AI.";
            } elseif (! $teacherNames->contains($row['teacher'])) {
                $error = "Unknown teacher [{$row['teacher']}] returned by AI.";
            } elseif (! $subjectNames->contains($row['subject'])) {
                $error = "Unknown subject [{$row['subject']}] returned by AI.";
            } elseif (! $teacherSubjectPairs->has($this->teacherSubjectKey($row['teacher'], $row['subject']))) {
                $error = "Teacher [{$row['teacher']}] is not assigned to subject [{$row['subject']}] for this grade section.";
            } else {
                $subjectKey = implode('|', [$row['grade_section'], $row['day'], mb_strtolower($row['subject'])]);
                if (isset($subjectPerDay[$subjectKey])) {
                    $error = "Subject [{$row['subject']}] appears more than once on [{$row['day']}] for [{$row['grade_section']}].";
                } else {
                    $subjectPerDay[$subjectKey] = true;
                }

                $teacherSlotKey = implode('|', [$row['day'], $row['time_slot'], mb_strtolower($row['teacher'])]);
                if (isset($teacherPerSlot[$teacherSlotKey])) {
                    $error = "Teacher [{$row['teacher']}] is double-booked inside the generated section payload.";
                } else {
                    $teacherPerSlot[$teacherSlotKey] = true;
                }
            }

            if ($error !== null) {
                if ($this->attempts() < $this->tries) {
                    throw new \RuntimeException($error);
                } else {
                    Log::warning("Filtering out invalid schedule row on final attempt: {$error}");
                    continue;
                }
            }

            $validRows[] = $row;
        }

        return $validRows;
    }

    private function teacherSubjectKey(string $teacher, string $subject): string
    {
        return mb_strtolower(trim($teacher)).'|'.mb_strtolower(trim($subject));
    }

    private function normalizeTimeSlot(string $slot): string
    {
        return preg_replace('/\s*-\s*/', '-', trim($slot)) ?? trim($slot);
    }

    private function normalizeDay(string $day, \Illuminate\Support\Collection $allowedDays): string
    {
        $day = trim($day);

        if ($allowedDays->contains($day)) {
            return $day;
        }

        $map = [
            'monday' => 'M', 'mon' => 'M', 'm' => 'M',
            'tuesday' => 'T', 'tue' => 'T', 't' => 'T',
            'wednesday' => 'W', 'wed' => 'W', 'w' => 'W',
            'thursday' => 'Th', 'thu' => 'Th', 'th' => 'Th',
            'friday' => 'F', 'fri' => 'F', 'f' => 'F',
            'saturday' => 'Sa', 'sat' => 'Sa', 'sa' => 'Sa',
            'sunday' => 'Su', 'sun' => 'Su', 'su' => 'Su',
        ];

        $lower = strtolower($day);
        if (isset($map[$lower]) && $allowedDays->contains($map[$lower])) {
            return $map[$lower];
        }

        foreach ($allowedDays as $allowedDay) {
            if (strtolower($allowedDay) === $lower) {
                return $allowedDay;
            }
        }

        return $day;
    }

    private function normalizeTeacher(string $teacher, \Illuminate\Support\Collection $teacherNames): string
    {
        $teacher = trim($teacher);
        $lowerTeacher = strtolower($teacher);

        foreach ($teacherNames as $allowedTeacher) {
            if (strtolower($allowedTeacher) === $lowerTeacher) {
                return $allowedTeacher;
            }
        }

        foreach ($teacherNames as $allowedTeacher) {
            $allowedLower = strtolower($allowedTeacher);
            if (str_contains($allowedLower, $lowerTeacher) || str_contains($lowerTeacher, $allowedLower)) {
                return $allowedTeacher;
            }
        }

        return $teacher;
    }

    private function normalizeSubject(string $subject, \Illuminate\Support\Collection $subjectNames): string
    {
        $subject = trim($subject);
        $lowerSubject = strtolower($subject);

        foreach ($subjectNames as $allowedSubject) {
            if (strtolower($allowedSubject) === $lowerSubject) {
                return $allowedSubject;
            }
        }

        foreach ($subjectNames as $allowedSubject) {
            $allowedLower = strtolower($allowedSubject);
            if (str_contains($allowedLower, $lowerSubject) || str_contains($lowerSubject, $allowedLower)) {
                return $allowedSubject;
            }
        }

        return $subject;
    }

    private function parseToMinutes(string $time): ?int
    {
        $ts = strtotime(trim($time));
        if ($ts === false) {
            return null;
        }
        return (int) date('H', $ts) * 60 + (int) date('i', $ts);
    }

    private function findBestTimeSlot(string $slot, \Illuminate\Support\Collection $allowedSlots, \Illuminate\Support\Collection $slotMap): string
    {
        $slot = preg_replace('/\s*-\s*/', '-', trim($slot)) ?? trim($slot);
        $lowerSlot = strtolower($slot);

        if ($slotMap->has($lowerSlot)) {
            return $slotMap->get($lowerSlot);
        }

        if ($allowedSlots->contains($slot)) {
            return $slot;
        }

        $clean = function (string $s): string {
            $s = strtolower($s);
            $s = str_replace(['am', 'pm', ' '], '', $s);
            $s = preg_replace_callback('/\b\d:\d\d\b/', fn($m) => '0' . $m[0], $s);
            return $s;
        };

        $cleanedSlot = $clean($slot);

        foreach ($allowedSlots as $allowedSlot) {
            if ($clean($allowedSlot) === $cleanedSlot) {
                return $allowedSlot;
            }
        }

        // Try exact labels lookup
        foreach ($slotMap as $label => $timeSlot) {
            if (str_contains($label, $lowerSlot) || str_contains($lowerSlot, $label)) {
                return $timeSlot;
            }
        }

        // Fallback: Overlap calculation
        $slotParts = explode('-', $slot);
        $startStr = $slotParts[0] ?? '';
        $endStr = $slotParts[1] ?? '';

        $startMin = $this->parseToMinutes($startStr);
        if ($startMin !== null) {
            $endMin = $this->parseToMinutes($endStr) ?? ($startMin + 45); // default 45 mins if no end time

            $bestSlot = null;
            $maxOverlap = 0;

            foreach ($allowedSlots as $allowedSlot) {
                $allowedParts = explode('-', $allowedSlot);
                $allowedStartStr = $allowedParts[0] ?? '';
                $allowedEndStr = $allowedParts[1] ?? '';

                $allowedStartMin = $this->parseToMinutes($allowedStartStr);
                $allowedEndMin = $this->parseToMinutes($allowedEndStr);

                if ($allowedStartMin !== null && $allowedEndMin !== null) {
                    $overlap = min($endMin, $allowedEndMin) - max($startMin, $allowedStartMin);
                    if ($overlap > $maxOverlap) {
                        $maxOverlap = $overlap;
                        $bestSlot = $allowedSlot;
                    }
                }
            }

            if ($bestSlot !== null && $maxOverlap > 0) {
                return $bestSlot;
            }
        }

        // Fallback: matching start time of the LLM slot
        if (count($slotParts) > 0) {
            $startOfSlot = $clean($slotParts[0]);
            foreach ($allowedSlots as $allowedSlot) {
                $allowedParts = explode('-', $allowedSlot);
                if (count($allowedParts) > 0) {
                    if ($clean($allowedParts[0]) === $startOfSlot) {
                        return $allowedSlot;
                    }
                }
            }
        }

        foreach ($allowedSlots as $allowedSlot) {
            $parts = explode('-', $allowedSlot);
            if (count($parts) > 0) {
                if ($clean($parts[0]) === $cleanedSlot) {
                    return $allowedSlot;
                }
            }
        }

        foreach ($allowedSlots as $allowedSlot) {
            if (str_contains($clean($allowedSlot), $cleanedSlot) || str_contains($cleanedSlot, $clean($allowedSlot))) {
                return $allowedSlot;
            }
        }

        return $slot;
    }

    /**
     * Mockable backtracking/global-state validation boundary.
     *
     * @param  array<int, array<string, string>>  $rows
     * @return array<int, array<string, string>>
     */
    private function validateGlobalTeacherState(array $rows): array
    {
        $validRows = [];

        foreach ($rows as $row) {
            $alreadyBooked = MasterScheduleEntry::query()
                ->where('master_schedule_run_id', $this->masterScheduleRunId)
                ->where('grade_section_id', '!=', $this->gradeSectionId)
                ->where('day', $row['day'])
                ->where('time_slot', $row['time_slot'])
                ->where('teacher', $row['teacher'])
                ->exists();

            if ($alreadyBooked) {
                $error = "Global conflict: teacher [{$row['teacher']}] is already booked on [{$row['day']}] at [{$row['time_slot']}].";
                if ($this->attempts() < $this->tries) {
                    throw new \RuntimeException($error);
                } else {
                    Log::warning("Filtering out conflicting schedule row on final attempt: {$error}");
                    continue;
                }
            }

            $validRows[] = $row;
        }

        return $validRows;
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

    private function isRetryableConflict(\RuntimeException $exception): bool
    {
        return $this->attempts() < $this->tries;
    }

    private function releaseForConflict(\RuntimeException $exception): void
    {
        Log::warning('AI generated a schedule with a conflict; retrying with updated prompt feedback/bookings.', [
            'school_id' => $this->schoolId,
            'grade_section_id' => $this->gradeSectionId,
            'run_id' => $this->masterScheduleRunId,
            'attempt' => $this->attempts(),
            'exception' => $exception->getMessage(),
        ]);

        $this->release(1);
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

        $this->dispatchNextJob();
    }

    private function dispatchNextJob(): void
    {
        if (!empty($this->remainingGradeSectionIds)) {
            $nextIds = $this->remainingGradeSectionIds;
            $nextId = array_shift($nextIds);

            self::dispatch(
                $this->schoolId,
                $nextId,
                $this->masterScheduleRunId,
                $nextIds
            );
        }
    }
}
