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
            $table->dropForeign(['router_id']);
            $table->dropColumn(['speed_profile_name', 'local_address', 'pool_range', 'rate_limit', 'router_id']);
            $table->foreignId('mikrotik_profile_id')->nullable()->after('registration_fee')->constrained('mikrotik_profiles')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('packages', function (Blueprint $table) {
            $table->dropForeign(['mikrotik_profile_id']);
            $table->dropColumn('mikrotik_profile_id');
            $table->string('speed_profile_name')->nullable();
            $table->string('local_address')->nullable();
            $table->string('pool_range')->nullable();
            $table->string('rate_limit')->nullable();
            $table->foreignId('router_id')->nullable()->constrained()->nullOnDelete();
        });
    }
};
