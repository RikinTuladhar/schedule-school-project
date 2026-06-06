<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('master_schedule_runs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained('schools')->cascadeOnDelete();
            $table->string('status')->default('pending');
            $table->unsignedInteger('total_sections')->default(0);
            $table->unsignedInteger('processed_sections')->default(0);
            $table->unsignedInteger('failed_sections')->default(0);
            $table->text('error_message')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('finished_at')->nullable();
            $table->timestamps();

            $table->index(['school_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('master_schedule_runs');
    }
};
