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
        Schema::table('farmer_profiles', function (Blueprint $table) {
            if (!Schema::hasColumn('farmer_profiles', 'stall_number')) {
                $table->string('stall_number')->nullable()->after('stall_name');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('farmer_profiles', function (Blueprint $table) {
            if (Schema::hasColumn('farmer_profiles', 'stall_number')) {
                $table->dropColumn('stall_number');
            }
        });
    }
};
