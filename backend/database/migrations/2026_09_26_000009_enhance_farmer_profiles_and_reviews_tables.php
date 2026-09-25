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
            $table->text('bio')->nullable()->after('address');
            $table->json('market_ids')->nullable()->after('operating_days');
            $table->string('cutoff_time', 100)->nullable()->after('pickup_time_end');
            $table->json('pickup_slots')->nullable()->after('cutoff_time');
        });

        Schema::table('reviews', function (Blueprint $table) {
            $table->text('farmer_reply')->nullable()->after('comment');
            $table->timestamp('reply_date')->nullable()->after('farmer_reply');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('farmer_profiles', function (Blueprint $table) {
            $table->dropColumn(['bio', 'market_ids', 'cutoff_time', 'pickup_slots']);
        });

        Schema::table('reviews', function (Blueprint $table) {
            $table->dropColumn(['farmer_reply', 'reply_date']);
        });
    }
};
