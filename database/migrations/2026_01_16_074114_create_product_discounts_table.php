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
        Schema::create('product_discounts', function (Blueprint $table) {
            $table->integer('product_discount_id')->autoIncrement();
            $table->integer('product_id');
            $table->integer('customer_group_id');
            $table->integer('quantity')->default(0);
            $table->integer('priority')->default(1);
            $table->decimal('price', 15, 4)->default(0);
            $table->date('date_start')->nullable();
            $table->date('date_end')->nullable();

            $table->primary('product_discount_id');
            $table->foreign('product_id')->references('product_id')->on('products')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_discounts');
    }
};
