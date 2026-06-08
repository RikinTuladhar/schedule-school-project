<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('master_schedule_entries', function (Blueprint $table) {
            $table->dropUnique('schedule_teacher_slot_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('master_schedule_entries', function (Blueprint $table) {
            $table->unique(['master_schedule_run_id', 'day', 'time_slot', 'teacher'], 'schedule_teacher_slot_unique');
        });
    }
};
