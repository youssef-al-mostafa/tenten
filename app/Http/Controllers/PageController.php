<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Http\Resources\ProductListResource;
use App\Models\Pages;
use App\Models\Product;
use App\Models\Vendor;
use App\Enums\VendorStatusEnum;
use App\Services\TemplateService;
use App\Services\VendorService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PageController extends Controller
{
    protected TemplateService $templateService;

    public function __construct(TemplateService $templateService)
    {
        $this->templateService = $templateService;
    }

    public function home(Request $request)
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

        $topVendors = app(VendorService::class)->getTopVendors(6);

        $page = Pages::where('slug', 'home')->active()->first();

        if ($page) {
            $pageContent = array_merge(
                $this->templateService->loadTemplate('home'),
                $page->content ?: []
            );
        } else {
            $pageContent = $this->templateService->loadTemplate('home');
        }

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
                    'location' => $vendor->store_address ?: null,
                    'description' => $vendor->store_description ?: null,
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
            }),
            'pageContent' => $pageContent
        ]);
    }

    public function help()
    {
        $page = Pages::where('slug', 'help')->active()->first();

        if ($page) {
            $pageContent = array_merge(
                $this->templateService->loadTemplate('help'),
                $page->content ?: []
            );
        } else {
            $pageContent = $this->templateService->loadTemplate('help');
        }

        return Inertia::render('Help', [
            'pageContent' => $pageContent
        ]);
    }

    public function show(string $slug)
    {
        $page = Pages::where('slug', $slug)->active()->firstOrFail();

        $pageContent = array_merge(
            $this->templateService->loadTemplate($page->template_name),
            $page->content ?: []
        );

        return Inertia::render('Page', [
            'page' => $page,
            'pageContent' => $pageContent
        ]);
    }
}
