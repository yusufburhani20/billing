<?php

namespace Database\Seeders;

use App\Models\User;
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
        \App\Models\User::factory()->create([
            'name' => 'Admin Billing',
            'email' => 'admin@billing.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        // Sample Router
        \App\Models\Router::create([
            'name' => 'Router Utama',
            'ip_address' => '192.168.88.1',
            'username' => 'admin',
            'password' => 'password',
            'description' => 'Router pusat distribusi',
        ]);

        // Sample Packages
        \App\Models\Package::create([
            'name' => 'Hemat 10Mbps',
            'price' => 150000,
            'registration_fee' => 250000,
            'speed_profile_name' => '10M',
            'description' => 'Cocok untuk penggunaan rumahan ringan.',
        ]);

        \App\Models\Package::create([
            'name' => 'Super 20Mbps',
            'price' => 250000,
            'registration_fee' => 250000,
            'speed_profile_name' => '20M',
            'description' => 'Cocok untuk streaming dan gaming.',
        ]);
    }
}
