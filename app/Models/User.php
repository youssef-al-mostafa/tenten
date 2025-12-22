<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Enums\RolesEnum;
use App\Notifications\QueuedVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use SimonHamp\LaravelStripeConnect\Traits\Payable;
use Spatie\Permission\Models\Role;
/**
 * @mixin \Spatie\Permission\Traits\HasRoles
 * @method bool hasRole(string|int|array|\Spatie\Permission\Models\Role|\Illuminate\Support\Collection|\BackedEnum $roles, string|null $guard = null)
 * @method bool hasAnyRole(string|int|array|\Spatie\Permission\Models\Role|\Illuminate\Support\Collection|\BackedEnum $roles, string|null $guard = null)
 * @method bool hasAllRoles(string|int|array|\Spatie\Permission\Models\Role|\Illuminate\Support\Collection|\BackedEnum $roles, string|null $guard = null)
 * @method $this assignRole(string|int|array|\Spatie\Permission\Models\Role|\Illuminate\Support\Collection|\BackedEnum $roles)
 * @method $this removeRole(string|int|array|\Spatie\Permission\Models\Role|\Illuminate\Support\Collection|\BackedEnum $roles)
 * @method $this syncRoles(string|int|array|\Spatie\Permission\Models\Role|\Illuminate\Support\Collection|\BackedEnum $roles)
 * @method string|null getStripeAccountId()
 * @method void createStripeAccount(array $options)
 * @method string getStripeAccountLink()
 * @method bool isStripeAccountActive()
 */
class User extends Authenticatable implements FilamentUser, MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles, Payable;

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

    public function vendor(): HasOne{
        return $this->hasOne(Vendor::class, 'user_id');
    }

    public function products(): HasMany{
        return $this->hasMany(Product::class, 'created_by');
    }

    public function getStripeAccountId()
    {
        return $this->stripe_account_id;
    }

    /**
     * Send the email verification notification (queued).
     */
    public function sendEmailVerificationNotification()
    {
        $this->notify(new QueuedVerifyEmail);
    }
}
