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
        Schema::create('attribute_group_descriptions', function (Blueprint $table) {
            $table->integer('attribute_group_id');
            $table->integer('language_id');
            $table->string('name', 64);

            $table->primary(['attribute_group_id', 'language_id']);
            $table->foreign('attribute_group_id')->references('attribute_group_id')->on('attribute_groups')->onDelete('cascade');
            $table->foreign('language_id')->references('language_id')->on('languages')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attribute_group_descriptions');
    }
};
