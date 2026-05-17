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
        Schema::table('mikrotik_profiles', function (Blueprint $table) {
            $table->dropColumn('pool_range');
            $table->foreignId('mikrotik_pool_id')->nullable()->after('local_address')->constrained('mikrotik_pools')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mikrotik_profiles', function (Blueprint $table) {
            $table->dropForeign(['mikrotik_pool_id']);
            $table->dropColumn('mikrotik_pool_id');
            $table->string('pool_range')->nullable();
        });
    }
};
