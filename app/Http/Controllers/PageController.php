<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Http\Resources\VendorResource;
use App\Models\Pages;
use App\Models\Product;
use App\Models\Vendor;
use App\Enums\VendorStatusEnum;
use App\Services\ProductService;
use App\Services\TemplateService;
use App\Services\VendorService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PageController extends Controller
{
    protected TemplateService $templateService;
    protected ProductService $productService;
    protected VendorService $vendorService;

    public function __construct(
        TemplateService $templateService,
        ProductService $productService,
        VendorService $vendorService
    ) {
        $this->templateService = $templateService;
        $this->productService = $productService;
        $this->vendorService = $vendorService;
    }

    public function home(Request $request)
    {
        $keyword = $request->query(key: 'keyword');

        // Use ProductService for product queries
        $products = $this->productService->getPublishedProducts($keyword, 8);

        // Use VendorService for top vendors
        $topVendors = $this->vendorService->getTopVendors(6);

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
            'products' => ProductResource::collection($products),
            'topVendors' => VendorResource::collection($topVendors)->resolve(),
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
