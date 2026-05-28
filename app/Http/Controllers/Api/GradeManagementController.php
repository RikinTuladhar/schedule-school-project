<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\BaseController;
use App\Models\Grade;
use App\Models\GradeSection;
use App\Models\Section;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class GradeManagementController extends BaseController
{
    public function index(Request $request)
    {
        $schoolId = $this->schoolId($request);

        if (! $schoolId) {
            return $this->sendErrorResponse('Client school context not found.', [], 403);
        }

        return $this->sendResponse('Grade management data', [
            'grades' => Grade::query()
                ->where('school_id', $schoolId)
                ->orderBy('name')
                ->get(),
            'sections' => Section::query()
                ->where('school_id', $schoolId)
                ->orderBy('name')
                ->get(),
            'grade_sections' => GradeSection::query()
                ->with(['gradeModel', 'sectionModel'])
                ->where('school_id', $schoolId)
                ->latest()
                ->get(),
        ]);
    }

    public function storeGrade(Request $request)
    {
        $schoolId = $this->schoolIdOrFail($request);
        $data = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('grades', 'name')->where('school_id', $schoolId),
            ],
        ]);

        $grade = Grade::create([
            'school_id' => $schoolId,
            'name' => trim($data['name']),
        ]);

        return $this->sendResponse('Grade created', [
            'grade' => $grade,
        ], 201);
    }

    public function updateGrade(Request $request, Grade $grade)
    {
        if (! $this->canAccess($request, $grade)) {
            return $this->sendErrorResponse('Grade not found.', [], 404);
        }

        $data = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('grades', 'name')
                    ->where('school_id', $grade->school_id)
                    ->ignore($grade->id),
            ],
        ]);

        $grade->update([
            'name' => trim($data['name']),
        ]);

        return $this->sendResponse('Grade updated', [
            'grade' => $grade->fresh(),
        ]);
    }

    public function destroyGrade(Request $request, Grade $grade)
    {
        if (! $this->canAccess($request, $grade)) {
            return $this->sendErrorResponse('Grade not found.', [], 404);
        }

        $grade->delete();

        return $this->sendResponse('Grade deleted');
    }

    public function storeSection(Request $request)
    {
        $schoolId = $this->schoolIdOrFail($request);
        $data = $request->validate([
            'name' => [
                'required',
                'string',
                'max:10',
                Rule::unique('sections', 'name')->where('school_id', $schoolId),
            ],
        ]);

        $section = Section::create([
            'school_id' => $schoolId,
            'name' => strtoupper(trim($data['name'])),
        ]);

        return $this->sendResponse('Section created', [
            'section' => $section,
        ], 201);
    }

    public function updateSection(Request $request, Section $section)
    {
        if (! $this->canAccess($request, $section)) {
            return $this->sendErrorResponse('Section not found.', [], 404);
        }

        $data = $request->validate([
            'name' => [
                'required',
                'string',
                'max:10',
                Rule::unique('sections', 'name')
                    ->where('school_id', $section->school_id)
                    ->ignore($section->id),
            ],
        ]);

        $section->update([
            'name' => strtoupper(trim($data['name'])),
        ]);

        return $this->sendResponse('Section updated', [
            'section' => $section->fresh(),
        ]);
    }

    public function destroySection(Request $request, Section $section)
    {
        if (! $this->canAccess($request, $section)) {
            return $this->sendErrorResponse('Section not found.', [], 404);
        }

        $section->delete();

        return $this->sendResponse('Section deleted');
    }

    public function storeGradeSection(Request $request)
    {
        $schoolId = $this->schoolIdOrFail($request);
        $data = $this->validateGradeSection($request, $schoolId);

        $gradeSection = GradeSection::create([
            ...$data,
            'school_id' => $schoolId,
        ])->load(['gradeModel', 'sectionModel']);

        return $this->sendResponse('Class link created', [
            'grade_section' => $gradeSection,
        ], 201);
    }

    public function updateGradeSection(Request $request, GradeSection $gradeSection)
    {
        if (! $this->canAccess($request, $gradeSection)) {
            return $this->sendErrorResponse('Class link not found.', [], 404);
        }

        $data = $this->validateGradeSection($request, $gradeSection->school_id, $gradeSection->id);
        $gradeSection->update($data);

        return $this->sendResponse('Class link updated', [
            'grade_section' => $gradeSection->fresh()->load(['gradeModel', 'sectionModel']),
        ]);
    }

    public function destroyGradeSection(Request $request, GradeSection $gradeSection)
    {
        if (! $this->canAccess($request, $gradeSection)) {
            return $this->sendErrorResponse('Class link not found.', [], 404);
        }

        $gradeSection->delete();

        return $this->sendResponse('Class link deleted');
    }

    private function validateGradeSection(Request $request, int $schoolId, ?int $ignoreId = null): array
    {
        $uniqueSectionForGrade = Rule::unique('grade_sections', 'section_id')
            ->where('school_id', $schoolId)
            ->where('grade_id', $request->integer('grade_id'));

        if ($ignoreId) {
            $uniqueSectionForGrade->ignore($ignoreId);
        }

        return $request->validate([
            'grade_id' => [
                'required',
                'integer',
                Rule::exists('grades', 'id')->where('school_id', $schoolId),
            ],
            'section_id' => [
                'required',
                'integer',
                Rule::exists('sections', 'id')->where('school_id', $schoolId),
                $uniqueSectionForGrade,
            ],
            'schedule_template_id' => ['required', 'string', 'max:255'],
        ]);
    }

    private function schoolId(Request $request): ?int
    {
        return $request->user()?->school_id;
    }

    private function schoolIdOrFail(Request $request): int
    {
        $schoolId = $this->schoolId($request);

        abort_if(! $schoolId, 403, 'Client school context not found.');

        return $schoolId;
    }

    private function canAccess(Request $request, Grade|Section|GradeSection $model): bool
    {
        return (int) $model->school_id === (int) $this->schoolId($request);
    }
}
