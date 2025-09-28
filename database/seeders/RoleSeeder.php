<?php

namespace Database\Seeders;

use App\Enums\RolesEnum;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (RolesEnum::values() as $role) {
            Role::firstOrCreate(['name' => $role]);
        }

        $this->command->info('Roles created successfully: ' . implode(', ', RolesEnum::values()));
    }
}
