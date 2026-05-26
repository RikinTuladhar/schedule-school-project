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
        Schema::create('attributes', function (Blueprint $table) {
            $table->integer('attribute_id')->autoIncrement();
            $table->integer('attribute_group_id');
            $table->integer('sort_order')->default(0);

            $table->primary('attribute_id');
            $table->foreign('attribute_group_id')->references('attribute_group_id')->on('attribute_groups')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attributes');
    }
};
