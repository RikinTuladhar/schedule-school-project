<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('master_schedule_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('master_schedule_run_id')->constrained('master_schedule_runs')->cascadeOnDelete();
            $table->foreignId('school_id')->constrained('schools')->cascadeOnDelete();
            $table->foreignId('grade_section_id')->constrained('grade_sections')->cascadeOnDelete();
            $table->string('grade_section');
            $table->string('day');
            $table->string('time_slot');
            $table->string('teacher');
            $table->string('subject');
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->unique(['master_schedule_run_id', 'grade_section_id', 'day', 'time_slot'], 'schedule_entry_slot_unique');
            $table->unique(['master_schedule_run_id', 'day', 'time_slot', 'teacher'], 'schedule_teacher_slot_unique');
            $table->index(['school_id', 'grade_section_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('master_schedule_entries');
    }
};
