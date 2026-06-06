<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\BaseController;
use App\Jobs\GenerateSchoolScheduleBatch;
use App\Models\MasterScheduleEntry;
use App\Models\MasterScheduleRun;
use Illuminate\Http\Request;

class MasterScheduleController extends BaseController
{
    public function generate(Request $request)
    {
        $schoolId = $this->schoolId($request);

        if (! $schoolId) {
            return $this->sendErrorResponse('Client school context not found.', [], 403);
        }

        if (! $this->aiProviderConfigured()) {
            return $this->sendErrorResponse('AI scheduler provider is not configured. Set OPENROUTER_API_KEY in .env.', [], 422);
        }

        $run = MasterScheduleRun::create([
            'school_id' => $schoolId,
            'status' => 'pending',
        ]);

        GenerateSchoolScheduleBatch::dispatch($schoolId, $run->id);

        return $this->sendResponse('Master schedule generation queued', [
            'run' => $this->serializeRun($run),
        ], 202);
    }

    public function latest(Request $request)
    {
        $schoolId = $this->schoolId($request);

        if (! $schoolId) {
            return $this->sendErrorResponse('Client school context not found.', [], 403);
        }

        $run = MasterScheduleRun::query()
            ->where('school_id', $schoolId)
            ->latest()
            ->first();

        if (! $run) {
            return $this->sendResponse('No master schedule run found', [
                'run' => null,
            ]);
        }

        return $this->sendResponse('Latest master schedule run', [
            'run' => $this->serializeRun($run, includeEntries: true),
        ]);
    }

    public function show(Request $request, MasterScheduleRun $masterScheduleRun)
    {
        if (! $this->canAccess($request, $masterScheduleRun)) {
            return $this->sendErrorResponse('Master schedule run not found.', [], 404);
        }

        return $this->sendResponse('Master schedule run', [
            'run' => $this->serializeRun($masterScheduleRun, includeEntries: true),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function serializeRun(MasterScheduleRun $run, bool $includeEntries = false): array
    {
        $payload = [
            'id' => $run->id,
            'school_id' => $run->school_id,
            'status' => $run->status,
            'total_sections' => $run->total_sections,
            'processed_sections' => $run->processed_sections,
            'failed_sections' => $run->failed_sections,
            'progress_percentage' => $run->total_sections > 0
                ? round((($run->processed_sections + $run->failed_sections) / $run->total_sections) * 100, 2)
                : 0,
            'error_message' => $run->error_message,
            'started_at' => $run->started_at?->toISOString(),
            'finished_at' => $run->finished_at?->toISOString(),
            'created_at' => $run->created_at?->toISOString(),
            'updated_at' => $run->updated_at?->toISOString(),
        ];

        if (! $includeEntries) {
            return $payload;
        }

        $payload['schedules'] = $this->serializeSchedules($run);

        return $payload;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function serializeSchedules(MasterScheduleRun $run): array
    {
        $dayOrder = ['M' => 1, 'T' => 2, 'W' => 3, 'Th' => 4, 'F' => 5];

        return $run->entries()
            ->get()
            ->sortBy([
                ['grade_section', 'asc'],
                fn (MasterScheduleEntry $a, MasterScheduleEntry $b): int => ($dayOrder[$a->day] ?? 99) <=> ($dayOrder[$b->day] ?? 99),
                ['time_slot', 'asc'],
            ])
            ->groupBy('grade_section')
            ->map(function ($entries, string $gradeSection): array {
                /** @var MasterScheduleEntry $first */
                $first = $entries->first();

                return [
                    'grade_section_id' => $first->grade_section_id,
                    'grade_section' => $gradeSection,
                    'entries' => $entries
                        ->map(fn (MasterScheduleEntry $entry): array => [
                            'id' => $entry->id,
                            'day' => $entry->day,
                            'time_slot' => $entry->time_slot,
                            'teacher' => $entry->teacher,
                            'subject' => $entry->subject,
                            'metadata' => $entry->metadata,
                        ])
                        ->values()
                        ->all(),
                ];
            })
            ->values()
            ->all();
    }

    private function schoolId(Request $request): ?int
    {
        return $request->user()?->school_id;
    }

    private function aiProviderConfigured(): bool
    {
        $provider = (string) config('ai.scheduler.provider', 'openrouter');

        return filled(config("ai.providers.{$provider}.key"));
    }

    private function canAccess(Request $request, MasterScheduleRun $run): bool
    {
        return (int) $run->school_id === (int) $this->schoolId($request);
    }
}
