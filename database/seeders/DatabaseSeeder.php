<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Router;
use App\Models\MikrotikPool;
use App\Models\MikrotikProfile;
use App\Models\Package;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin User
        User::factory()->create([
            'name' => 'Admin Billing',
            'email' => 'admin@billing.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        // Sample Router
        $router = Router::create([
            'name' => 'Router Utama',
            'ip_address' => '192.168.88.1',
            'username' => 'admin',
            'password' => 'password',
            'description' => 'Router pusat distribusi',
        ]);

        // Sample Pool
        $pool = MikrotikPool::create([
            'name' => 'dhcp_pool_local',
            'ranges' => '192.168.88.10-192.168.88.254',
            'router_id' => $router->id,
        ]);

        // Sample Mikrotik Profiles
        $profile10 = MikrotikProfile::create([
            'name' => '10M',
            'local_address' => '192.168.88.1',
            'mikrotik_pool_id' => $pool->id,
            'rate_limit' => '10M/10M',
            'router_id' => $router->id,
        ]);

        $profile20 = MikrotikProfile::create([
            'name' => '20M',
            'local_address' => '192.168.88.1',
            'mikrotik_pool_id' => $pool->id,
            'rate_limit' => '20M/20M',
            'router_id' => $router->id,
        ]);

        // Sample Packages
        Package::create([
            'name' => 'Hemat 10Mbps',
            'price' => 150000,
            'registration_fee' => 250000,
            'mikrotik_profile_id' => $profile10->id,
            'description' => 'Cocok untuk penggunaan rumahan ringan.',
        ]);

        Package::create([
            'name' => 'Super 20Mbps',
            'price' => 250000,
            'registration_fee' => 250000,
            'mikrotik_profile_id' => $profile20->id,
            'description' => 'Cocok untuk streaming dan gaming.',
        ]);
    }
}
