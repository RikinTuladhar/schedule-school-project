<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('grade_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained('schools')->cascadeOnDelete();
            $table->foreignId('grade_id')->constrained('grades')->cascadeOnDelete();
            $table->foreignId('section_id')->constrained('sections')->cascadeOnDelete();
            $table->string('schedule_template_id');
            $table->timestamps();

            $table->unique(['school_id', 'grade_id', 'section_id']);
            $table->index(['school_id', 'schedule_template_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('grade_sections');
    }
};
