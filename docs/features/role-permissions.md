# Role-Based Access Control

## Role Hierarchy

The application implements a hierarchical role-based access control system using Spatie Permissions:

1. **CLIENT**
   - Regular end-users who can browse products and make purchases
   - No access to admin areas

2. **VENDOR**
   - Can access restricted admin area
   - Limited to managing their own products
   - Cannot modify departments or categories
   - Can only view their own orders and products

3. **ADMIN**
   - Full access to all products across all vendors
   - Can manage departments and categories
   - Can edit, delete, or draft any product
   - Access to all orders and reporting features

4. **MASTER_ADMIN**
   - Highest level of access
   - Can manage system configuration
   - All permissions of ADMIN plus additional system management capabilities

## Permission Matrix

| Feature | CLIENT | VENDOR | ADMIN | MASTER_ADMIN |
|---------|--------|--------|-------|--------------|
| Browse products | ✅ | ✅ | ✅ | ✅ |
| Place orders | ✅ | ✅ | ✅ | ✅ |
| Access admin area | ❌ | ✅ | ✅ | ✅ |
| Manage own products | ❌ | ✅ | ✅ | ✅ |
| View own orders | ❌ | ✅ | ✅ | ✅ |
| View all orders | ❌ | ❌ | ✅ | ✅ |
| Manage all products | ❌ | ❌ | ✅ | ✅ |
| Manage departments | ❌ | ❌ | ✅ | ✅ |
| Manage categories | ❌ | ❌ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ✅ | ✅ |
| System configuration | ❌ | ❌ | ❌ | ✅ |

## Implementation Details

### Role Assignment

```php
use App\Enums\RolesEnum;

// When creating a new user
$user->assignUserRole(RolesEnum::CLIENT);
```

### Access Control in Controllers

```php
// Example controller method with role-based access control
public function update(Product $product)
{
    if (auth()->user()->hasRole([RolesEnum::ADMIN, RolesEnum::MASTER_ADMIN]) ||
        (auth()->user()->hasRole(RolesEnum::VENDOR) && $product->vendor_id === auth()->id())) {
        // Allow update
    } else {
        abort(403);
    }
}
```

### Middleware Configuration

```php
// Route group with role restrictions
Route::middleware(['auth', 'role:vendor,admin,master_admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        // Admin routes
    });
```

### Using Laravel Policies

```php
// ProductPolicy.php
public function update(User $user, Product $product)
{
    return $user->hasRole([RolesEnum::ADMIN, RolesEnum::MASTER_ADMIN]) || 
        ($user->hasRole(RolesEnum::VENDOR) && $product->vendor_id === $user->id);
}
```
