<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        $this->normalizeExistingTemplateIds();

        Schema::table('grade_sections', function (Blueprint $table) {
            $table->dropIndex('grade_sections_school_id_schedule_template_id_index');
        });

        if (in_array(DB::getDriverName(), ['mysql', 'mariadb'], true)) {
            DB::statement('ALTER TABLE grade_sections MODIFY schedule_template_id BIGINT UNSIGNED NOT NULL');
        } else {
            Schema::table('grade_sections', function (Blueprint $table) {
                $table->unsignedBigInteger('schedule_template_id')->change();
            });
        }

        Schema::table('grade_sections', function (Blueprint $table) {
            $table->index('schedule_template_id');
            $table->index(['school_id', 'schedule_template_id']);
            $table->foreign('schedule_template_id')->references('id')->on('schedule_templates')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('grade_sections', function (Blueprint $table) {
            $table->dropForeign(['schedule_template_id']);
            $table->dropIndex('grade_sections_schedule_template_id_index');
            $table->dropIndex('grade_sections_school_id_schedule_template_id_index');
        });

        if (in_array(DB::getDriverName(), ['mysql', 'mariadb'], true)) {
            DB::statement('ALTER TABLE grade_sections MODIFY schedule_template_id VARCHAR(255) NOT NULL');
        } else {
            Schema::table('grade_sections', function (Blueprint $table) {
                $table->string('schedule_template_id')->change();
            });
        }

        Schema::table('grade_sections', function (Blueprint $table) {
            $table->index(['school_id', 'schedule_template_id']);
        });
    }

    private function normalizeExistingTemplateIds(): void
    {
        $templatesBySchool = DB::table('schedule_templates')
            ->orderBy('id')
            ->get()
            ->groupBy('school_id');

        DB::table('grade_sections')
            ->orderBy('id')
            ->get()
            ->each(function (object $gradeSection) use ($templatesBySchool): void {
                $templates = $templatesBySchool->get($gradeSection->school_id, collect());

                if ($templates->isEmpty()) {
                    return;
                }

                $template = $this->resolveTemplateForGradeSection($gradeSection, $templates);

                if (! $template) {
                    return;
                }

                DB::table('grade_sections')
                    ->where('id', $gradeSection->id)
                    ->update([
                        'schedule_template_id' => (string) $template->id,
                    ]);
            });
    }

    private function resolveTemplateForGradeSection(object $gradeSection, mixed $templates): ?object
    {
        $current = trim((string) $gradeSection->schedule_template_id);

        if (ctype_digit($current)) {
            $template = $templates->firstWhere('id', (int) $current);

            if ($template) {
                return $template;
            }
        }

        $legacyKey = Str::slug($current);

        $matchedByLegacyKey = $templates->first(function (object $template) use ($legacyKey): bool {
            $level = Str::slug((string) $template->level);
            $levelAliases = [
                'elementary' => ['elementary', 'elem'],
                'secondary' => ['secondary', 'sec'],
                'high' => ['high'],
            ];

            return $legacyKey === Str::slug((string) $template->name)
                || collect($levelAliases[$level] ?? [$level])
                    ->contains(fn (string $alias): bool => $legacyKey === "tpl-{$alias}-standard");
        });

        if ($matchedByLegacyKey) {
            return $matchedByLegacyKey;
        }

        $matchedByGrade = $templates->first(function (object $template) use ($gradeSection): bool {
            $gradeIds = json_decode((string) $template->grade_ids, true);

            if (! is_array($gradeIds)) {
                return false;
            }

            return in_array((int) $gradeSection->grade_id, array_map('intval', $gradeIds), true);
        });

        return $matchedByGrade ?: $templates->first();
    }
};
