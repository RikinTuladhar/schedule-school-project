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

        $gradeSections = GradeSection::query()
            ->with(['gradeModel', 'sectionModel', 'scheduleTemplate'])
            ->where('school_id', $this->schoolId)
            ->orderBy('grade_id')
            ->orderBy('section_id')
            ->get();

        $run->update([
            'status' => 'processing',
            'total_sections' => $gradeSections->count(),
            'processed_sections' => 0,
            'failed_sections' => 0,
            'error_message' => null,
            'started_at' => now(),
            'finished_at' => null,
        ]);

        if ($gradeSections->isEmpty()) {
            $run->update([
                'status' => 'completed',
                'finished_at' => now(),
            ]);

            return;
        }

        /** @var array<int, ProcessGradeScheduleJob> $jobs */
        $jobs = $gradeSections
            ->map(fn (GradeSection $gradeSection): ProcessGradeScheduleJob => new ProcessGradeScheduleJob(
                schoolId: $this->schoolId,
                gradeSectionId: $gradeSection->id,
                masterScheduleRunId: $run->id,
            ))
            ->all();

        /** @var PendingBatch $batch */
        $batch = Bus::batch($jobs)
            ->name("Master schedule generation run {$run->id}")
            ->allowFailures()
            ->then(function (Batch $batch) use ($run): void {
                $run->refresh();

                if ($run->processed_sections + $run->failed_sections >= $run->total_sections) {
                    $run->update([
                        'status' => $run->failed_sections > 0 ? 'completed_with_errors' : 'completed',
                        'finished_at' => now(),
                    ]);
                }
            })
            ->catch(function (Batch $batch, Throwable $exception) use ($run): void {
                Log::error('Master schedule batch failed.', [
                    'run_id' => $run->id,
                    'batch_id' => $batch->id,
                    'exception' => $exception->getMessage(),
                ]);

                $run->update([
                    'status' => 'failed',
                    'error_message' => $exception->getMessage(),
                    'finished_at' => now(),
                ]);
            });

        $batch->dispatch();
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
