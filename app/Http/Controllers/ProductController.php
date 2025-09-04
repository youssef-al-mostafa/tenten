<?php

namespace App\Http\Controllers;

use App\Http\Resources\DepartmentResource;
use App\Http\Resources\ProductResource;
use App\Http\Resources\ProductListResource;
use App\Models\Department;
use App\Models\Pages;
use App\Models\Product;
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

        return Inertia::render('Home', [
            'products' => ProductListResource::collection($products),
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
