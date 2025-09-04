<?php

namespace App\Http\Controllers;

use App\Http\Resources\DepartmentResource;
use App\Http\Resources\ProductResource;
use App\Http\Resources\ProductListResource;
use App\Models\Department;
use App\Models\Pages;
use App\Models\Product;
use App\Models\Vendor;
use App\Enums\VendorStatusEnum;
use App\Services\TemplateService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    protected TemplateService $templateService;

    public function __construct(TemplateService $templateService)
    {
        $this->templateService = $templateService;
    }
    public function index(Request $request)
    {
        $keyword = $request->query(key: 'keyword');
        $products = Product::query()
            ->published()
            ->when($keyword, function ($query, $keyword) {
                $query->where(function ($query) use ($keyword) {
                    $query->where('title', 'LIKE', "%{$keyword}%")
                        ->orWhere('description', 'LIKE', "%{$keyword}%");
                });
            })
            ->paginate(12);

        $topVendors = Vendor::with(['user', 'user.products' => function($query) {
                $query->published()->limit(3);
            }])
            ->where('status', VendorStatusEnum::Approved->value)
            ->whereHas('user.products', function($query) {
                $query->published();
            })
            ->withCount(['user as products_count' => function($query) {
                $query->join('products', 'products.created_by', '=', 'users.id')
                      ->where('products.status', 'published');
            }])
            ->orderBy('products_count', 'desc')
            ->limit(6)
            ->get();

        return Inertia::render('Home', [
            'products' => ProductListResource::collection($products),
            'topVendors' => $topVendors->map(function($vendor) {
                return [
                    'id' => $vendor->user_id,
                    'name' => $vendor->user->name,
                    'storeName' => $vendor->store_name,
                    'avatar' => $vendor->cover_image ? asset('storage/' . $vendor->cover_image) : null,
                    'rating' => 4.5 + (rand(0, 8) / 10),
                    'reviewCount' => rand(100, 3000),
                    'location' => $vendor->store_address ?: 'Location not specified',
                    'description' => $vendor->store_description ?: 'No description available',
                    'topProducts' => $vendor->user->products->map(function($product) {
                        $media = $product->getFirstMediaUrl('images') ?: ($product->getFirstMediaUrl() ?: null);
                        return [
                            'id' => $product->id,
                            'image' => $media,
                            'title' => $product->title,
                            'price' => $product->price,
                        ];
                    })->toArray()
                ];
            })
        ]);
    }

    public function show(Product $product)
    {
        $similarProducts = Product::query()
            ->published()
            ->where('department_id', $product->department_id)
            ->where('id', '!=', $product->id)
            ->limit(8)
            ->get();

        $page = Pages::where('slug', 'product-details')->active()->first();
        
        if ($page) {
            $pageContent = array_merge(
                $this->templateService->loadTemplate('product-details'),
                $page->content ?: []
            );
        } else {
            $pageContent = $this->templateService->loadTemplate('product-details');
        }

        return Inertia::render('Product/Show', [
            'product' => new ProductResource($product),
            'variationOptions' => request('options', []),
            'similarProducts' => ProductListResource::collection($similarProducts),
            'pageContent' => $pageContent
        ]);
    }

    public function byDepartment(Request $request, Department $department)
    {
        abort_unless($department->active, 404);
        $keyword = $request->query(key: 'keyword');
        $products = Product::query()
            ->forWebsite()
            ->where('department_id', $department->id)
            ->when($keyword, function ($query, $keyword) {
                $query->where(function ($query) use ($keyword) {
                    $query->where('title', 'LIKE', "%{$keyword}%")
                        ->orWhere('description', 'LIKE', "%{$keyword}%");
                });
            })
            ->paginate();

            return Inertia::render ('Department/Index', [
                'department' => new DepartmentResource ($department),
                'products' => ProductListResource::collection($products),
            ]);
    }
}
