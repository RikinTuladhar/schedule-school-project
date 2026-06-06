<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('schedule_templates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained('schools')->cascadeOnDelete();
            $table->string('name');
            $table->string('level');
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->json('grade_ids')->nullable();
            $table->json('days')->nullable();
            $table->json('periods')->nullable();
            $table->timestamps();

            $table->unique(['school_id', 'name']);
            $table->index(['school_id', 'level']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('schedule_templates');
    }
};
