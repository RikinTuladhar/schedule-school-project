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
        Schema::create('languages', function (Blueprint $table) {
            $table->integer('language_id')->autoIncrement();
            $table->string('name', 32);
            $table->string('code', 5);
            $table->string('locale', 255);
            $table->string('image', 64)->nullable();
            $table->string('directory', 32)->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('status')->default(1);

            $table->primary('language_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('languages');
    }
};
