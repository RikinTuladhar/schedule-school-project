<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\BaseController;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SubjectController extends BaseController
{
    public function index(Request $request)
    {
        $schoolId = $this->schoolId($request);

        if (! $schoolId) {
            return $this->sendErrorResponse('Client school context not found.', [], 403);
        }

        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', Rule::in(['active', 'archived'])],
        ]);

        $subjects = Subject::query()
            ->where('school_id', $schoolId)
            ->when($filters['search'] ?? null, function ($query, string $search): void {
                $query->where('name', 'like', "%{$search}%");
            })
            ->when($filters['status'] ?? null, function ($query, string $status): void {
                $query->where('status', $status);
            })
            ->latest()
            ->get();

        return $this->sendResponse('Subjects', [
            'subjects' => $subjects,
        ]);
    }

    public function store(Request $request)
    {
        $schoolId = $this->schoolId($request);

        if (! $schoolId) {
            return $this->sendErrorResponse('Client school context not found.', [], 403);
        }

        $data = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('subjects', 'name')->where('school_id', $schoolId),
            ],
            'status' => ['nullable', Rule::in(['active', 'archived'])],
        ]);

        $subject = Subject::create([
            'school_id' => $schoolId,
            'name' => trim($data['name']),
            'status' => $data['status'] ?? 'active',
        ]);

        return $this->sendResponse('Subject created', [
            'subject' => $subject,
        ], 201);
    }

    public function show(Request $request, Subject $subject)
    {
        if (! $this->canAccess($request, $subject)) {
            return $this->sendErrorResponse('Subject not found.', [], 404);
        }

        return $this->sendResponse('Subject', [
            'subject' => $subject,
        ]);
    }

    public function update(Request $request, Subject $subject)
    {
        if (! $this->canAccess($request, $subject)) {
            return $this->sendErrorResponse('Subject not found.', [], 404);
        }

        $data = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('subjects', 'name')
                    ->where('school_id', $subject->school_id)
                    ->ignore($subject->id),
            ],
            'status' => ['required', Rule::in(['active', 'archived'])],
        ]);

        $subject->update([
            'name' => trim($data['name']),
            'status' => $data['status'],
        ]);

        return $this->sendResponse('Subject updated', [
            'subject' => $subject->fresh(),
        ]);
    }

    public function destroy(Request $request, Subject $subject)
    {
        if (! $this->canAccess($request, $subject)) {
            return $this->sendErrorResponse('Subject not found.', [], 404);
        }

        $subject->delete();

        return $this->sendResponse('Subject deleted');
    }

    private function schoolId(Request $request): ?int
    {
        return $request->user()?->school_id;
    }

    private function canAccess(Request $request, Subject $subject): bool
    {
        return (int) $subject->school_id === (int) $this->schoolId($request);
    }
}
