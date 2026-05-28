<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teachers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained('schools')->cascadeOnDelete();
            $table->string('full_name');
            $table->string('employment_type')->default('full-time');
            $table->unsignedTinyInteger('max_daily_classes')->default(6);
            $table->text('ai_context_notes')->nullable();
            $table->json('availability')->nullable();
            $table->json('assignments')->nullable();
            $table->timestamps();

            $table->index(['school_id', 'employment_type']);
            $table->index(['school_id', 'full_name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('teachers');
    }
};
