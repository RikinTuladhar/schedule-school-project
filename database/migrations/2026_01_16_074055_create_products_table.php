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
        Schema::create('products', function (Blueprint $table) {
            $table->integer('product_id')->autoIncrement();
            $table->integer('master_id')->default(0);
            $table->string('model', 64)->nullable();
            $table->string('sku', 64)->nullable();
            $table->string('upc', 12)->nullable();
            $table->string('ean', 14)->nullable();
            $table->string('jan', 13)->nullable();
            $table->string('isbn', 17)->nullable();
            $table->string('mpn', 64)->nullable();
            $table->string('location', 128)->nullable();
            $table->text('variant')->nullable();
            $table->text('override')->nullable();
            $table->integer('quantity')->default(0);
            $table->integer('stock_status_id')->nullable();
            $table->string('image', 255)->nullable();
            $table->integer('manufacturer_id')->nullable();
            $table->boolean('shipping')->default(1);
            $table->decimal('price', 15, 4)->default(0);
            $table->integer('points')->default(0);
            $table->integer('tax_class_id')->nullable();
            $table->date('date_available')->nullable();
            $table->decimal('weight', 15, 8)->default(0);
            $table->integer('weight_class_id')->nullable();
            $table->decimal('length', 15, 8)->default(0);
            $table->decimal('width', 15, 8)->default(0);
            $table->decimal('height', 15, 8)->default(0);
            $table->integer('length_class_id')->nullable();
            $table->boolean('subtract')->default(1);
            $table->integer('minimum')->default(1);
            $table->integer('rating')->default(0);
            $table->integer('sort_order')->default(0);
            $table->boolean('status')->default(0);
            $table->dateTime('date_added')->nullable();
            $table->dateTime('date_modified')->nullable();
            $table->integer('lookbook_id')->nullable();

            $table->primary('product_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
