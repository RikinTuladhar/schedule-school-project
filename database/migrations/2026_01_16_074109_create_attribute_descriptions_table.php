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
        Schema::create('attribute_descriptions', function (Blueprint $table) {
            $table->integer('attribute_id');
            $table->integer('language_id');
            $table->string('name', 64);

            $table->primary(['attribute_id', 'language_id']);
            $table->foreign('attribute_id')->references('attribute_id')->on('attributes')->onDelete('cascade');
            $table->foreign('language_id')->references('language_id')->on('languages')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attribute_descriptions');
    }
};
