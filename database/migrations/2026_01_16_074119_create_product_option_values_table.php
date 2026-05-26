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
        Schema::create('product_option_values', function (Blueprint $table) {
            $table->integer('product_option_value_id')->autoIncrement();
            $table->integer('product_option_id');
            $table->integer('product_id');
            $table->integer('option_id');
            $table->integer('option_value_id');
            $table->integer('quantity')->default(0);
            $table->boolean('subtract')->default(0);
            $table->decimal('price', 15, 4)->default(0);
            $table->string('price_prefix', 1)->default('+');
            $table->integer('points')->default(0);
            $table->string('points_prefix', 1)->default('+');
            $table->decimal('weight', 15, 8)->default(0);
            $table->string('weight_prefix', 1)->default('+');

            $table->primary('product_option_value_id');
            $table->foreign('product_id')->references('product_id')->on('products')->onDelete('cascade');
            $table->foreign('product_option_id')->references('product_option_id')->on('product_options')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_option_values');
    }
};
