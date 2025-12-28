<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class ProductService
{
    /**
     * @param string|null $keyword Search keyword for title or description
     * @param int|null $limit Maximum number of products to return
     * @param bool $paginate Whether to paginate results
     * @param int $perPage Number of items per page when paginating
     * @param string $orderBy Column to order by
     * @param string $orderDirection Order direction (asc or desc)
     * @return Collection|LengthAwarePaginator
     */
    public function getProducts(
        ?string $keyword = null,
        ?int $limit = null,
        bool $paginate = false,
        int $perPage = 15,
        string $orderBy = 'created_at',
        string $orderDirection = 'desc'
    ): Collection|LengthAwarePaginator {
        $query = Product::query()
            ->published()
            ->with(['user.vendor', 'department'])
            ->when($keyword, function ($query, $keyword) {
                $query->where(function ($query) use ($keyword) {
                    $query->where('title', 'LIKE', "%{$keyword}%")
                        ->orWhere('description', 'LIKE', "%{$keyword}%");
                });
            })
            ->orderBy($orderBy, $orderDirection);

        if ($limit && !$paginate) {
            return $query->limit($limit)->get();
        }

        if ($paginate) {
            return $query->paginate($perPage);
        }

        return $query->get();
    }

    /**
     * @param string|null $keyword
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getPublishedProducts(?string $keyword = null, int $perPage = 8): LengthAwarePaginator
    {
        return $this->getProducts(
            keyword: $keyword,
            paginate: true,
            perPage: $perPage
        );
    }
}
