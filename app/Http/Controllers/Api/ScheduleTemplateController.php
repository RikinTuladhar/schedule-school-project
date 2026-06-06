<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\BaseController;
use App\Models\ScheduleTemplate;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ScheduleTemplateController extends BaseController
{
    public function index(Request $request)
    {
        $schoolId = $this->schoolId($request);

        if (! $schoolId) {
            return $this->sendErrorResponse('Client school context not found.', [], 403);
        }

        $filters = $request->validate([
            'level' => ['nullable', Rule::in(['elementary', 'secondary', 'high'])],
        ]);

        $templates = ScheduleTemplate::query()
            ->where('school_id', $schoolId)
            ->when($filters['level'] ?? null, function ($query, string $level): void {
                $query->where('level', $level);
            })
            ->latest()
            ->get();

        return $this->sendResponse('Schedule templates', [
            'schedule_templates' => $templates,
        ]);
    }

    public function store(Request $request)
    {
        $schoolId = $this->schoolId($request);

        if (! $schoolId) {
            return $this->sendErrorResponse('Client school context not found.', [], 403);
        }

        $template = ScheduleTemplate::create([
            ...$this->validatedPayload($request, $schoolId),
            'school_id' => $schoolId,
        ]);

        return $this->sendResponse('Schedule template created', [
            'schedule_template' => $template,
        ], 201);
    }

    public function show(Request $request, ScheduleTemplate $scheduleTemplate)
    {
        if (! $this->canAccess($request, $scheduleTemplate)) {
            return $this->sendErrorResponse('Schedule template not found.', [], 404);
        }

        return $this->sendResponse('Schedule template', [
            'schedule_template' => $scheduleTemplate,
        ]);
    }

    public function update(Request $request, ScheduleTemplate $scheduleTemplate)
    {
        if (! $this->canAccess($request, $scheduleTemplate)) {
            return $this->sendErrorResponse('Schedule template not found.', [], 404);
        }

        $scheduleTemplate->update($this->validatedPayload($request, (int) $scheduleTemplate->school_id, $scheduleTemplate->id));

        return $this->sendResponse('Schedule template updated', [
            'schedule_template' => $scheduleTemplate->fresh(),
        ]);
    }

    public function destroy(Request $request, ScheduleTemplate $scheduleTemplate)
    {
        if (! $this->canAccess($request, $scheduleTemplate)) {
            return $this->sendErrorResponse('Schedule template not found.', [], 404);
        }

        $scheduleTemplate->delete();

        return $this->sendResponse('Schedule template deleted');
    }

    private function validatedPayload(Request $request, int $schoolId, ?int $ignoreId = null): array
    {
        return $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('schedule_templates', 'name')
                    ->where('school_id', $schoolId)
                    ->ignore($ignoreId),
            ],
            'level' => ['required', Rule::in(['elementary', 'secondary', 'high'])],
            'start_time' => ['nullable', 'date_format:H:i'],
            'end_time' => ['nullable', 'date_format:H:i'],
            'grade_ids' => ['required', 'array', 'min:1'],
            'grade_ids.*' => [
                'required',
                'integer',
                Rule::exists('grades', 'id')->where('school_id', $schoolId),
            ],
            'days' => ['required', 'array', 'min:1'],
            'days.*' => ['required', Rule::in(['M', 'T', 'W', 'Th', 'F'])],
            'periods' => ['required', 'array', 'min:1'],
            'periods.*.start' => ['required', 'date_format:H:i'],
            'periods.*.end' => ['required', 'date_format:H:i'],
            'periods.*.type' => ['required', Rule::in(['academic', 'break'])],
        ]);
    }

    private function schoolId(Request $request): ?int
    {
        return $request->user()?->school_id;
    }

    private function canAccess(Request $request, ScheduleTemplate $scheduleTemplate): bool
    {
        return (int) $scheduleTemplate->school_id === (int) $this->schoolId($request);
    }
}
