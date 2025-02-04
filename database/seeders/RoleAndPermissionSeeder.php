<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Enums\RolesEnum;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (RolesEnum::cases() as $role) {
            Role::create(['name' => $role->value]);
        }

        $permissions = [
            'view_dashboard',
            'manage_profile',
            'view_users',
            'create_users',
            'edit_users',
            'delete_users',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        $masterAdmin = Role::findByName(RolesEnum::MASTER_ADMIN->value);
        $admin = Role::findByName(RolesEnum::ADMIN->value);
        $vendor = Role::findByName(RolesEnum::VENDOR->value);
        $client = Role::findByName(RolesEnum::CLIENT->value);

        $masterAdmin->givePermissionTo(Permission::all());

        $admin->givePermissionTo(array_filter($permissions, function($permission) {
            return $permission !== 'delete_users'; 
        }));

        $vendor->givePermissionTo([
            'view_dashboard',
            'manage_profile',
        ]);

        $client->givePermissionTo([
            'manage_profile',
        ]);
    }
}
