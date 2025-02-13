<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Enums\RolesEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Spatie\Permission\Models\Role; 
/**
 * @mixin \Spatie\Permission\Traits\HasRoles
 */
class User extends Authenticatable implements FilamentUser
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles ,HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];
    // public function roles(): BelongsToMany
    // {
    //     return $this->belongsToMany(Role::class);
    // }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Assign a role to the user based on RolesEnum enum
     */
    public function assignUserRole(RolesEnum $role): void
    {
        $this->assignRole($role->value);
    }

    /**
     * Check if user has a specific role
     */
    public function hasUserRole(RolesEnum $role): bool
    {
        return $this->hasRole($role->value);
    }

    public function canAccessPanel(Panel $panel): bool
    {
        return $this->hasAnyRole([
            RolesEnum::VENDOR->value,
            RolesEnum::ADMIN->value,
            RolesEnum::MASTER_ADMIN->value
        ]);
    }
    
    /**
     * Get the user's highest role
     */
    public function getHighestRole(): ?RolesEnum
    {
        $roles = $this->roles->pluck('name')->toArray();

        if (in_array(RolesEnum::MASTER_ADMIN->value, $roles)) {
            return RolesEnum::MASTER_ADMIN;
        }
        if (in_array(RolesEnum::ADMIN->value, $roles)) {
            return RolesEnum::ADMIN;
        }
        if (in_array(RolesEnum::VENDOR->value, $roles)) {
            return RolesEnum::VENDOR;
        }
        if (in_array(RolesEnum::CLIENT->value, $roles)) {
            return RolesEnum::CLIENT;
        }

        return null;
    }
}
