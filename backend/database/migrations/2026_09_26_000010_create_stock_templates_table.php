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
        Schema::create('stock_templates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('farmer_id')->constrained('users')->cascadeOnDelete();
            $table->string('day_of_week', 20); // e.g. Saturday, Sunday, Wednesday
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->integer('default_quantity')->default(0);
            $table->boolean('is_included')->default(true);
            $table->timestamps();

            $table->unique(['farmer_id', 'day_of_week', 'product_id'], 'farmer_day_product_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_templates');
    }
};
