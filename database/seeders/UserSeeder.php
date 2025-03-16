<?php

namespace Database\Seeders;

use App\Enums\RolesEnum;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::create([
            'name' => 'Taylor Swift',
            'email' => 'taylor@admin.com',
            'password' => Hash::make('youssef'),
        ]);
        $admin->assignRole(RolesEnum::ADMIN->value);

        $vendor = User::create([
            'name' => 'Kevin Osten',
            'email' => 'kevin@vendor.com',
            'password' => Hash::make('youssef'),
        ]);
        $vendor->assignRole(RolesEnum::VENDOR->value);

        $client = User::create([
            'name' => 'Taha Sankari',
            'email' => 'sankari@client.com',
            'password' => Hash::make('youssef'),
        ]);
        $client->assignRole(RolesEnum::CLIENT->value);

        $masterAdmin = User::create([
            'name' => 'Adel Karam',
            'email' => 'karam@master.com',
            'password' => Hash::make('youssef'),
        ]);
        $masterAdmin->assignRole(RolesEnum::MASTER_ADMIN->value);

        $this->command->info('Users created successfully with password: youssef');
    }
}
