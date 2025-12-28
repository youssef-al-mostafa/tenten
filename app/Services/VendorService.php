<?php

namespace App\Services;

use App\Enums\RolesEnum;
use App\Enums\VendorStatusEnum;
use App\Models\User;
use App\Models\Vendor;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class VendorService
{
    public function getVendors(
        ?int $limit = null,
        bool $paginate = false,
        int $perPage = 15,
        string $orderBy = 'created_at',
        string $orderDirection = 'desc'
    ): Collection|LengthAwarePaginator {
        $query = Vendor::approved()
            ->hasProducts()
            ->with([
                'user',
                'products' => function ($query) {
                    $query->published()
                        ->latest()
                        ->limit(3);
                }
            ])
            ->withCount(['user as products_count' => function($query) {
                $query->join('products', 'products.created_by', '=', 'users.id')
                      ->where('products.status', 'published');
            }])
            ->orderBy($orderBy, $orderDirection);

        if ($limit && !$paginate) {
            return $query->limit($limit)->get();
        }

        if ($paginate) {
            return $query->paginate($perPage);
        }

        return $query->get();
    }

    public function getTopVendors(int $limit = 6): Collection
    {
        return $this->getVendors(
            limit: $limit,
            orderBy: 'products_count',
            orderDirection: 'desc'
        );
    }

    public function createOrUpdateVendor(User $user, array $data): Vendor
    {
        $vendor = $user->vendor ?: new Vendor();
        $vendor->user_id = $user->id;
        $vendor->status = VendorStatusEnum::Approved->value;
        $vendor->store_name = $data['store_name'];
        $vendor->store_address = $data['store_address'] ?? null;
        $vendor->save();

        if (!$user->hasRole(RolesEnum::VENDOR)) {
            $user->assignRole(RolesEnum::VENDOR);
        }

        return $vendor;
    }
}
