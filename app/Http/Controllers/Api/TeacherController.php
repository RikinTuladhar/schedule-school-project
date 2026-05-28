<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\BaseController;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TeacherController extends BaseController
{
    public function index(Request $request)
    {
        $schoolId = $this->schoolId($request);

        if (! $schoolId) {
            return $this->sendErrorResponse('Client school context not found.', [], 403);
        }

        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'employment_type' => ['nullable', Rule::in(['full-time', 'part-time'])],
        ]);

        $teachers = Teacher::query()
            ->where('school_id', $schoolId)
            ->when($filters['search'] ?? null, function ($query, string $search): void {
                $query->where('full_name', 'like', "%{$search}%");
            })
            ->when($filters['employment_type'] ?? null, function ($query, string $employmentType): void {
                $query->where('employment_type', $employmentType);
            })
            ->latest()
            ->get();

        return $this->sendResponse('Teachers', [
            'teachers' => $teachers,
        ]);
    }

    public function store(Request $request)
    {
        $schoolId = $this->schoolId($request);

        if (! $schoolId) {
            return $this->sendErrorResponse('Client school context not found.', [], 403);
        }

        $teacher = Teacher::create([
            ...$this->validatedPayload($request),
            'school_id' => $schoolId,
        ]);

        return $this->sendResponse('Teacher created', [
            'teacher' => $teacher,
        ], 201);
    }

    public function show(Request $request, Teacher $teacher)
    {
        if (! $this->canAccess($request, $teacher)) {
            return $this->sendErrorResponse('Teacher not found.', [], 404);
        }

        return $this->sendResponse('Teacher', [
            'teacher' => $teacher,
        ]);
    }

    public function update(Request $request, Teacher $teacher)
    {
        if (! $this->canAccess($request, $teacher)) {
            return $this->sendErrorResponse('Teacher not found.', [], 404);
        }

        $teacher->update($this->validatedPayload($request));

        return $this->sendResponse('Teacher updated', [
            'teacher' => $teacher->fresh(),
        ]);
    }

    public function destroy(Request $request, Teacher $teacher)
    {
        if (! $this->canAccess($request, $teacher)) {
            return $this->sendErrorResponse('Teacher not found.', [], 404);
        }

        $teacher->delete();

        return $this->sendResponse('Teacher deleted');
    }

    private function validatedPayload(Request $request): array
    {
        return $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'employment_type' => ['required', Rule::in(['full-time', 'part-time'])],
            'max_daily_classes' => ['required', 'integer', 'min:1', 'max:12'],
            'ai_context_notes' => ['nullable', 'string'],
            'availability' => ['nullable', 'array'],
            'availability.*.active' => ['nullable', 'boolean'],
            'availability.*.start_time' => ['nullable', 'date_format:H:i'],
            'availability.*.end_time' => ['nullable', 'date_format:H:i'],
            'assignments' => ['nullable', 'array'],
            'assignments.*.subject_id' => ['required', 'string', 'max:255'],
            'assignments.*.grade_section_id' => ['required', 'string', 'max:255'],
            'assignments.*.sessions_per_week' => ['required', 'integer', 'min:1', 'max:40'],
            'assignments.*.max_sessions_per_day' => ['required', 'integer', 'min:1', 'max:12'],
        ]);
    }

    private function schoolId(Request $request): ?int
    {
        return $request->user()?->school_id;
    }

    private function canAccess(Request $request, Teacher $teacher): bool
    {
        return (int) $teacher->school_id === (int) $this->schoolId($request);
    }
}
