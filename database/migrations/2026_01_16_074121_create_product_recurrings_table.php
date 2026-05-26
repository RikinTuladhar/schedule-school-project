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
        Schema::create('product_recurrings', function (Blueprint $table) {
            $table->integer('product_id');
            $table->integer('recurring_id');
            $table->integer('customer_group_id');

            $table->primary(['product_id', 'recurring_id', 'customer_group_id']);
            $table->foreign('product_id')->references('product_id')->on('products')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_recurrings');
    }
};
