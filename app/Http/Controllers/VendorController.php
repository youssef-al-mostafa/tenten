<?php

namespace App\Http\Controllers;

use App\Enums\RolesEnum;
use App\Enums\VendorStatusEnum;
use App\Http\Resources\ProductListResource;
use App\Http\Resources\VendorResource;
use App\Models\Product;
use App\Models\Vendor;
use App\Services\VendorService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class VendorController extends Controller
{
    public function allVendors(Request $request, VendorService $vendorService)
    {
        $vendors = $vendorService->getVendors(paginate: true, perPage: 15, productsLimit: 6);

        return Inertia::render('Vendor/AllVendors', [
            'vendors' => VendorResource::collection($vendors)
        ]);
    }

    public function profile(Request $request, Vendor $vendor)
    {
        $keyword = $request->query(key: 'keyword');
        $products = Product::query()
            ->published()
            ->where('created_by', $vendor->user_id)
            ->when($keyword, function ($query, $keyword) {
                $query->where(function ($query) use ($keyword) {
                    $query->where('title', 'LIKE', "%{$keyword}%")
                        ->orWhere('description', 'LIKE', "%{$keyword}%");
                });
            })
            ->paginate();

        $vendor->load('user:id,name');

        return Inertia::render('Vendor/Profile', [
            'vendor' => $vendor,
            'products' => ProductListResource::collection($products),
        ]);
    }

    public function store(Request $request, VendorService $vendorService)
    {
        $user = $request->user();

        $validated = $request->validate([
            'store_name' => [
                'required',
                'regex:/^[a-z0-9-]+$/',
                Rule::unique('vendors', 'store_name')->ignore($user->id, 'user_id')
            ],
            'store_address' => 'nullable',
        ], [
            'store_name.regex' => 'Store name must only contain lowercase alphanumeric characters and hyphens.',
            'store_name.unique' => 'Store name already exists.',
        ]);

        $vendorService->createOrUpdateVendor($user, $validated);

        return back();
    }
}
