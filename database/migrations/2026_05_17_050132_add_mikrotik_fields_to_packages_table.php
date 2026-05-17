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
        Schema::table('packages', function (Blueprint $table) {
            $table->string('local_address')->nullable()->after('speed_profile_name');
            $table->string('pool_range')->nullable()->after('local_address');
            $table->string('rate_limit')->nullable()->after('pool_range');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('packages', function (Blueprint $table) {
            $table->dropColumn(['local_address', 'pool_range', 'rate_limit']);
        });
    }
};
