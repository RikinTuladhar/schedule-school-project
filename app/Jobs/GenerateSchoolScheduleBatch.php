<?php

namespace App\Jobs;

use App\Models\GradeSection;
use App\Models\MasterScheduleRun;
use Illuminate\Bus\Batch;
use Illuminate\Bus\Batchable;
use Illuminate\Bus\PendingBatch;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Log;
use Throwable;

class GenerateSchoolScheduleBatch implements ShouldQueue
{
    use Batchable, Queueable;

    public int $timeout = 300;

    public int $tries = 3;

    public function __construct(
        public int $schoolId,
        public ?int $runId = null
    ) {}

    public function handle(): void
    {
        $run = $this->resolveRun();

        // Abort any previous active runs for this school before starting this one
        MasterScheduleRun::query()
            ->where('school_id', $this->schoolId)
            ->where('id', '!=', $run->id)
            ->whereIn('status', ['pending', 'processing'])
            ->update([
                'status' => 'failed',
                'error_message' => 'Stale run aborted',
                'finished_at' => now(),
            ]);

        // Sort grade sections naturally by grade name and section name
        $gradeSections = GradeSection::query()
            ->with(['gradeModel', 'sectionModel', 'scheduleTemplate'])
            ->where('school_id', $this->schoolId)
            ->get()
            ->sort(function (GradeSection $a, GradeSection $b) {
                $gradeA = $a->gradeModel?->name ?? '';
                $gradeB = $b->gradeModel?->name ?? '';
                $cmp = strnatcasecmp($gradeA, $gradeB);
                if ($cmp !== 0) {
                    return $cmp;
                }
                $secA = $a->sectionModel?->name ?? '';
                $secB = $b->sectionModel?->name ?? '';
                return strnatcasecmp($secA, $secB);
            })
            ->values();

        $run->update([
            'status' => 'processing',
            'total_sections' => $gradeSections->count(),
            'processed_sections' => 0,
            'failed_sections' => 0,
            'error_message' => null,
            'started_at' => now(),
            'finished_at' => null,
        ]);

        // Copy fixed entries from the latest completed run to the new run
        $previousRun = MasterScheduleRun::query()
            ->where('school_id', $this->schoolId)
            ->where('id', '!=', $run->id)
            ->whereIn('status', ['completed', 'completed_with_errors'])
            ->latest()
            ->first();

        if ($previousRun) {
            $fixedEntries = $previousRun->entries()
                ->get()
                ->filter(function (\App\Models\MasterScheduleEntry $entry) {
                    return is_array($entry->metadata) && ($entry->metadata['is_fixed'] ?? false) === true;
                });

            foreach ($fixedEntries as $entry) {
                \App\Models\MasterScheduleEntry::create([
                    'master_schedule_run_id' => $run->id,
                    'school_id' => $this->schoolId,
                    'grade_section_id' => $entry->grade_section_id,
                    'grade_section' => $entry->grade_section,
                    'day' => $entry->day,
                    'time_slot' => $entry->time_slot,
                    'teacher' => $entry->teacher,
                    'subject' => $entry->subject,
                    'metadata' => $entry->metadata,
                ]);
            }
        }

        if ($gradeSections->isEmpty()) {
            $run->update([
                'status' => 'completed',
                'finished_at' => now(),
            ]);

            return;
        }

        $ids = $gradeSections->pluck('id')->all();
        $firstId = array_shift($ids);

        ProcessGradeScheduleJob::dispatch(
            $this->schoolId,
            $firstId,
            $run->id,
            $ids
        );
    }

    private function resolveRun(): MasterScheduleRun
    {
        if ($this->runId) {
            return MasterScheduleRun::query()->where('school_id', $this->schoolId)->findOrFail($this->runId);
        }

        return MasterScheduleRun::create([
            'school_id' => $this->schoolId,
            'status' => 'pending',
        ]);
    }

    public function failed(Throwable $exception): void
    {
        Log::error('Master schedule dispatch job failed.', [
            'school_id' => $this->schoolId,
            'run_id' => $this->runId,
            'exception' => $exception->getMessage(),
        ]);

        if ($this->runId) {
            MasterScheduleRun::query()
                ->where('school_id', $this->schoolId)
                ->whereKey($this->runId)
                ->update([
                    'status' => 'failed',
                    'error_message' => $exception->getMessage(),
                    'finished_at' => now(),
                ]);
        }
    }
}
