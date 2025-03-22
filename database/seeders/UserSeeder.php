<?php

namespace Database\Seeders;

use App\Enums\RolesEnum;
use App\Enums\VendorStatusEnum;
use App\Models\User;
use App\Models\Vendor;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $client = User::create([
            'name' => 'Taha Sankari',
            'email' => 'sankari@client.com',
            'password' => Hash::make('youssef'),
        ]);
        $client->assignRole(RolesEnum::CLIENT->value);

        $vendor = User::create([
            'name' => 'Kevin Osten',
            'email' => 'kevin@vendor.com',
            'password' => Hash::make('youssef'),
        ]);
        $vendor->assignRole(RolesEnum::VENDOR->value);

        Vendor::factory()->create([
            'user_id' => $vendor->id,
            'status' => VendorStatusEnum::Approved,
            'store_name' => 'Vendor Store',
            'store_address' => '456 Elm St, Anytown, USA',
        ]);

        $admin = User::create([
            'name' => 'Taylor Swift',
            'email' => 'taylor@admin.com',
            'password' => Hash::make('youssef'),
        ]);
        $admin->assignRole(RolesEnum::ADMIN->value);

        $masterAdmin = User::create([
            'name' => 'Adel Karam',
            'email' => 'karam@master.com',
            'password' => Hash::make('youssef'),
        ]);
        $masterAdmin->assignRole(RolesEnum::MASTER_ADMIN->value);

        $this->command->info('Users created successfully with password: youssef');
    }
}
