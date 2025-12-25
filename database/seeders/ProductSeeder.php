<?php

namespace Database\Seeders;

use App\Enums\ProductStatusEnum;
use App\Models\Product;
use App\Models\User;
use App\Models\Department;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class ProductSeeder extends Seeder
{
    /**
     * Cached department and category IDs (loaded dynamically)
     */
    private array $departments = [];
    private array $categories = [];

    /**
     * Image download settings
     */
    private bool $downloadImages = true; // Set to false to skip image downloads
    private int $imagesPerProduct = 1; // Number of images per product
    private bool $testMode = true; // Set to true to seed only one vendor for testing

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Load departments and categories by slug/name (works on any environment)
        $this->loadDepartmentsAndCategories();

        // Get all vendor users
        $vendors = User::whereHas('vendor')->with('vendor')->get();

        if ($vendors->isEmpty()) {
            $this->command->error('No vendors found! Please run VendorSeeder first.');
            return;
        }

        $productCount = 0;
        $vendorCount = 0;

        foreach ($vendors as $vendor) {
            $storeName = $vendor->vendor->store_name;

            $this->command->info("Processing vendor: {$storeName}");

            // Skip if not one of our seeded vendors
            $isSeededVendor = str_contains($storeName, 'Marcus') ||
                              str_contains($storeName, 'Bella') ||
                              str_contains($storeName, 'Kids Kingdom') ||
                              str_contains($storeName, 'Shoe Palace') ||
                              str_contains($storeName, 'Sports Pro') ||
                              str_contains($storeName, 'Accessory Hub') ||
                              str_contains($storeName, 'Athletic Men') ||
                              str_contains($storeName, 'Chic') ||
                              str_contains($storeName, 'Little Champs') ||
                              str_contains($storeName, 'Active Gear') ||
                              str_contains($storeName, 'Fashion Mart') ||
                              str_contains($storeName, 'Trend Haven');

            if (!$isSeededVendor) {
                $this->command->warn("Skipping non-seeded vendor: {$storeName}");
                continue;
            }

            // Test mode: only process first vendor
            if ($this->testMode && $vendorCount >= 1) {
                $this->command->info("Test mode enabled - stopping after first vendor");
                break;
            }
            $vendorCount++;

            // Determine vendor type and product count based on store name
            $products = match (true) {
                // SPECIALIZED VENDORS - 25 products each
                str_contains($storeName, "Marcus Men's Collection") => $this->getMensProducts(25),
                str_contains($storeName, 'Bella Rosa Boutique') => $this->getWomensProducts(25),
                str_contains($storeName, 'Kids Kingdom') => $this->getChildrensProducts(25),
                str_contains($storeName, 'Shoe Palace') => $this->getFootwearProducts(25),
                str_contains($storeName, 'Sports Pro Gear') => $this->getSportsWearProducts(25),
                str_contains($storeName, 'Accessory Hub') => $this->getAccessoriesProducts(25),

                // MULTI-DEPARTMENT VENDORS - 35 products each
                str_contains($storeName, 'Athletic Men') => array_merge(
                    $this->getMensProducts(18),
                    $this->getSportsWearProducts(17)
                ),
                str_contains($storeName, 'Chic & Style') => array_merge(
                    $this->getWomensProducts(20),
                    $this->getAccessoriesProducts(15)
                ),
                str_contains($storeName, 'Little Champs') => array_merge(
                    $this->getChildrensProducts(20),
                    $this->getFootwearProducts(15, 'children')
                ),
                str_contains($storeName, 'Active Gear Store') => array_merge(
                    $this->getSportsWearProducts(18),
                    $this->getFootwearProducts(17, 'sports')
                ),

                // LARGE DEPARTMENT STORE VENDORS - 80 products each
                str_contains($storeName, 'Fashion Mart') || str_contains($storeName, 'Trend Haven') => array_merge(
                    $this->getMensProducts(15),
                    $this->getWomensProducts(20),
                    $this->getChildrensProducts(15),
                    $this->getAccessoriesProducts(10),
                    $this->getSportsWearProducts(10),
                    $this->getFootwearProducts(10, 'mixed')
                ),

                default => [],
            };

            // Create products for this vendor
            foreach ($products as $productData) {
                $product = Product::create([
                    'title' => $productData['title'],
                    'slug' => Str::slug($productData['title']) . '-' . Str::random(6),
                    'description' => $productData['description'],
                    'department_id' => $productData['department_id'],
                    'category_id' => $productData['category_id'] ?? null,
                    'price' => $productData['price'],
                    'quantity' => rand(10, 100),
                    'status' => ProductStatusEnum::Published->value,
                    'created_by' => $vendor->id,
                    'updated_by' => $vendor->id,
                ]);

                // Attach images if enabled
                if ($this->downloadImages) {
                    $this->attachProductImages($product, $productData['title']);
                }

                $productCount++;
            }

            $this->command->info("Created " . count($products) . " products for {$storeName}");
        }

        $this->command->info("✓ Total {$productCount} products created successfully!");
    }

    /**
     * Load departments and categories from database by slug/name
     */
    private function loadDepartmentsAndCategories(): void
    {
        // Load departments by slug
        $depts = Department::whereIn('slug', ['men', 'women', 'accessories', 'children', 'sports-wear', 'footwear'])->get();

        $this->departments = [
            'men' => $depts->firstWhere('slug', 'men')?->id,
            'women' => $depts->firstWhere('slug', 'women')?->id,
            'accessories' => $depts->firstWhere('slug', 'accessories')?->id,
            'children' => $depts->firstWhere('slug', 'children')?->id,
            'sports_wear' => $depts->firstWhere('slug', 'sports-wear')?->id,
            'footwear' => $depts->firstWhere('slug', 'footwear')?->id,
        ];

        // Load categories by name and department
        $menDept = $this->departments['men'];
        $womenDept = $this->departments['women'];

        if ($menDept) {
            $menCategories = Category::where('department_id', $menDept)->get();
            $this->categories['men_tops'] = $menCategories->firstWhere('name', 'Tops')?->id;
            $this->categories['men_shirts'] = $menCategories->firstWhere('name', 'Shirts')?->id;
            $this->categories['men_bottoms'] = $menCategories->firstWhere('name', 'Bottoms')?->id;
            $this->categories['men_pants'] = $menCategories->firstWhere('name', 'Pants')?->id;
            $this->categories['men_shorts'] = $menCategories->firstWhere('name', 'Shorts')?->id;
            $this->categories['men_suits'] = $menCategories->firstWhere('name', 'Suits')?->id;
            $this->categories['men_underwear'] = $menCategories->firstWhere('name', 'UnderWear')?->id;
        }

        if ($womenDept) {
            $womenCategories = Category::where('department_id', $womenDept)->get();
            $this->categories['women_dresses'] = $womenCategories->firstWhere('name', 'Dresses')?->id;
            $this->categories['women_tops'] = $womenCategories->firstWhere('name', 'Tops & Blouses')?->id;
            $this->categories['women_bottoms'] = $womenCategories->firstWhere('name', 'Bottoms')?->id;
            $this->categories['women_pants'] = $womenCategories->firstWhere('name', 'Pants')?->id;
            $this->categories['women_skirts'] = $womenCategories->firstWhere('name', 'Skirts')?->id;
            $this->categories['women_outerwear'] = $womenCategories->firstWhere('name', 'Outerwear')?->id;
            $this->categories['women_lingerie'] = $womenCategories->firstWhere('name', 'Lingerie & Sleepwear')?->id;
        }

        $this->command->info('✓ Loaded departments and categories dynamically');
    }

    /**
     * Generate Men's products
     */
    private function getMensProducts(int $count): array
    {
        $products = [
            // Shirts & Tops
            ['title' => 'Classic White Dress Shirt', 'description' => 'Timeless white dress shirt perfect for formal occasions and business meetings.', 'department_id' => $this->departments['men'], 'category_id' => $this->categories['men_shirts'] ?? null, 'price' => 59.99],
            ['title' => 'Slim Fit Oxford Shirt', 'description' => 'Contemporary slim fit Oxford shirt in premium cotton fabric.', 'department_id' => $this->departments['men'], 'category_id' => $this->categories['men_shirts'] ?? null, 'price' => 49.99],
            ['title' => 'Casual Linen Shirt', 'description' => 'Breathable linen shirt ideal for casual summer days.', 'department_id' => $this->departments['men'], 'category_id' => $this->categories['men_shirts'] ?? null, 'price' => 45.00],
            ['title' => 'Polo Shirt - Navy Blue', 'description' => 'Classic navy polo shirt with modern fit and premium feel.', 'department_id' => $this->departments['men'], 'category_id' => $this->categories['men_tops'] ?? null, 'price' => 39.99],
            ['title' => 'Graphic T-Shirt Collection', 'description' => 'Trendy graphic tees with unique designs for casual wear.', 'department_id' => $this->departments['men'], 'category_id' => $this->categories['men_tops'] ?? null, 'price' => 24.99],

            // Pants & Bottoms
            ['title' => 'Classic Fit Chino Pants', 'description' => 'Versatile chino pants suitable for both casual and semi-formal settings.', 'department_id' => $this->departments['men'], 'category_id' => $this->categories['men_pants'] ?? null, 'price' => 69.99],
            ['title' => 'Slim Fit Dress Trousers', 'description' => 'Elegant dress trousers with a modern slim fit cut.', 'department_id' => $this->departments['men'], 'category_id' => $this->categories['men_pants'] ?? null, 'price' => 79.99],
            ['title' => 'Denim Jeans - Dark Wash', 'description' => 'Premium denim jeans with classic dark wash finish.', 'department_id' => $this->departments['men'], 'category_id' => $this->categories['men_pants'] ?? null, 'price' => 89.99],
            ['title' => 'Cargo Shorts - Khaki', 'description' => 'Functional cargo shorts perfect for outdoor activities.', 'department_id' => $this->departments['men'], 'category_id' => $this->categories['men_shorts'] ?? null, 'price' => 44.99],
            ['title' => 'Athletic Shorts Set', 'description' => 'Lightweight athletic shorts for sports and training.', 'department_id' => $this->departments['men'], 'category_id' => $this->categories['men_shorts'] ?? null, 'price' => 34.99],

            // Suits & Formal
            ['title' => 'Two-Piece Business Suit', 'description' => 'Professional two-piece suit crafted from premium wool blend.', 'department_id' => $this->departments['men'], 'category_id' => $this->categories['men_suits'] ?? null, 'price' => 399.99],
            ['title' => 'Slim Fit Blazer', 'description' => 'Modern slim fit blazer for sophisticated style.', 'department_id' => $this->departments['men'], 'category_id' => $this->categories['men_suits'] ?? null, 'price' => 189.99],
            ['title' => 'Tuxedo Complete Set', 'description' => 'Complete tuxedo set for special occasions and formal events.', 'department_id' => $this->departments['men'], 'category_id' => $this->categories['men_suits'] ?? null, 'price' => 499.99],

            // Underwear
            ['title' => 'Premium Cotton Boxer Briefs Pack', 'description' => 'Comfortable cotton boxer briefs in multi-pack.', 'department_id' => $this->departments['men'], 'category_id' => $this->categories['men_underwear'] ?? null, 'price' => 29.99],
            ['title' => 'Athletic Performance Underwear', 'description' => 'Moisture-wicking performance underwear for active lifestyles.', 'department_id' => $this->departments['men'], 'category_id' => $this->categories['men_underwear'] ?? null, 'price' => 34.99],

            // Additional variety
            ['title' => 'Flannel Button-Down Shirt', 'description' => 'Cozy flannel shirt perfect for layering in cooler weather.', 'department_id' => $this->departments['men'], 'category_id' => $this->categories['men_shirts'] ?? null, 'price' => 54.99],
            ['title' => 'V-Neck Sweater', 'description' => 'Classic v-neck sweater in soft merino wool.', 'department_id' => $this->departments['men'], 'category_id' => $this->categories['men_tops'] ?? null, 'price' => 74.99],
            ['title' => 'Henley Long Sleeve Shirt', 'description' => 'Casual henley with classic button placket.', 'department_id' => $this->departments['men'], 'category_id' => $this->categories['men_tops'] ?? null, 'price' => 42.99],
            ['title' => 'Jogger Pants', 'description' => 'Comfortable jogger pants with tapered fit.', 'department_id' => $this->departments['men'], 'category_id' => $this->categories['men_pants'] ?? null, 'price' => 59.99],
            ['title' => 'Swim Shorts', 'description' => 'Quick-dry swim shorts with modern patterns.', 'department_id' => $this->departments['men'], 'category_id' => $this->categories['men_shorts'] ?? null, 'price' => 39.99],
            ['title' => 'Dress Shirt - Light Blue', 'description' => 'Elegant light blue dress shirt for professional settings.', 'department_id' => $this->departments['men'], 'category_id' => $this->categories['men_shirts'] ?? null, 'price' => 64.99],
            ['title' => 'Crewneck Sweatshirt', 'description' => 'Comfortable crewneck sweatshirt in fleece material.', 'department_id' => $this->departments['men'], 'category_id' => $this->categories['men_tops'] ?? null, 'price' => 49.99],
            ['title' => 'Pleated Dress Pants', 'description' => 'Classic pleated dress pants for formal occasions.', 'department_id' => $this->departments['men'], 'category_id' => $this->categories['men_pants'] ?? null, 'price' => 84.99],
            ['title' => 'Linen Shorts', 'description' => 'Breathable linen shorts for summer comfort.', 'department_id' => $this->departments['men'], 'category_id' => $this->categories['men_shorts'] ?? null, 'price' => 47.99],
            ['title' => 'Three-Piece Suit', 'description' => 'Sophisticated three-piece suit with vest included.', 'department_id' => $this->departments['men'], 'category_id' => $this->categories['men_suits'] ?? null, 'price' => 549.99],
        ];

        return array_slice($products, 0, $count);
    }

    /**
     * Generate Women's products
     */
    private function getWomensProducts(int $count): array
    {
        $products = [
            // Dresses
            ['title' => 'Elegant Evening Gown', 'description' => 'Stunning evening gown perfect for formal events and galas.', 'department_id' => $this->departments['women'], 'category_id' => $this->categories['women_dresses'] ?? null, 'price' => 199.99],
            ['title' => 'Floral Summer Dress', 'description' => 'Light and breezy floral print dress for warm weather.', 'department_id' => $this->departments['women'], 'category_id' => $this->categories['women_dresses'] ?? null, 'price' => 79.99],
            ['title' => 'Little Black Dress', 'description' => 'Classic LBD - a wardrobe essential for any occasion.', 'department_id' => $this->departments['women'], 'category_id' => $this->categories['women_dresses'] ?? null, 'price' => 89.99],
            ['title' => 'Maxi Dress - Bohemian Style', 'description' => 'Flowing bohemian maxi dress with intricate patterns.', 'department_id' => $this->departments['women'], 'category_id' => $this->categories['women_dresses'] ?? null, 'price' => 94.99],
            ['title' => 'Cocktail Dress', 'description' => 'Chic cocktail dress for parties and celebrations.', 'department_id' => $this->departments['women'], 'category_id' => $this->categories['women_dresses'] ?? null, 'price' => 119.99],

            // Tops & Blouses
            ['title' => 'Silk Blouse - White', 'description' => 'Luxurious silk blouse for professional elegance.', 'department_id' => $this->departments['women'], 'category_id' => $this->categories['women_tops'] ?? null, 'price' => 89.99],
            ['title' => 'Casual Cotton T-Shirt', 'description' => 'Soft cotton tee perfect for everyday wear.', 'department_id' => $this->departments['women'], 'category_id' => $this->categories['women_tops'] ?? null, 'price' => 29.99],
            ['title' => 'Off-Shoulder Top', 'description' => 'Trendy off-shoulder top for a feminine look.', 'department_id' => $this->departments['women'], 'category_id' => $this->categories['women_tops'] ?? null, 'price' => 44.99],
            ['title' => 'Peplum Blouse', 'description' => 'Flattering peplum style blouse with flare detail.', 'department_id' => $this->departments['women'], 'category_id' => $this->categories['women_tops'] ?? null, 'price' => 54.99],
            ['title' => 'Crop Top - Ribbed', 'description' => 'Modern ribbed crop top for contemporary styling.', 'department_id' => $this->departments['women'], 'category_id' => $this->categories['women_tops'] ?? null, 'price' => 34.99],

            // Bottoms
            ['title' => 'High-Waisted Jeans', 'description' => 'Flattering high-waisted denim jeans with stretch.', 'department_id' => $this->departments['women'], 'category_id' => $this->categories['women_pants'] ?? null, 'price' => 79.99],
            ['title' => 'Wide Leg Trousers', 'description' => 'Sophisticated wide leg trousers for office wear.', 'department_id' => $this->departments['women'], 'category_id' => $this->categories['women_pants'] ?? null, 'price' => 69.99],
            ['title' => 'Pleated Midi Skirt', 'description' => 'Elegant pleated skirt in midi length.', 'department_id' => $this->departments['women'], 'category_id' => $this->categories['women_skirts'] ?? null, 'price' => 59.99],
            ['title' => 'Pencil Skirt - Black', 'description' => 'Classic black pencil skirt for professional settings.', 'department_id' => $this->departments['women'], 'category_id' => $this->categories['women_skirts'] ?? null, 'price' => 49.99],
            ['title' => 'A-Line Skirt', 'description' => 'Versatile A-line skirt suitable for various occasions.', 'department_id' => $this->departments['women'], 'category_id' => $this->categories['women_skirts'] ?? null, 'price' => 54.99],

            // Outerwear
            ['title' => 'Trench Coat - Beige', 'description' => 'Classic beige trench coat for timeless style.', 'department_id' => $this->departments['women'], 'category_id' => $this->categories['women_outerwear'] ?? null, 'price' => 149.99],
            ['title' => 'Leather Jacket', 'description' => 'Edgy leather jacket for a bold statement.', 'department_id' => $this->departments['women'], 'category_id' => $this->categories['women_outerwear'] ?? null, 'price' => 199.99],
            ['title' => 'Wool Blazer', 'description' => 'Professional wool blazer for business attire.', 'department_id' => $this->departments['women'], 'category_id' => $this->categories['women_outerwear'] ?? null, 'price' => 129.99],
            ['title' => 'Puffer Jacket', 'description' => 'Warm puffer jacket for cold weather protection.', 'department_id' => $this->departments['women'], 'category_id' => $this->categories['women_outerwear'] ?? null, 'price' => 109.99],

            // Lingerie & Sleepwear
            ['title' => 'Lace Bra Set', 'description' => 'Delicate lace bra and panty set.', 'department_id' => $this->departments['women'], 'category_id' => $this->categories['women_lingerie'] ?? null, 'price' => 49.99],
            ['title' => 'Silk Pajama Set', 'description' => 'Luxurious silk pajamas for comfortable sleep.', 'department_id' => $this->departments['women'], 'category_id' => $this->categories['women_lingerie'] ?? null, 'price' => 89.99],
            ['title' => 'Cotton Nightgown', 'description' => 'Soft cotton nightgown for restful nights.', 'department_id' => $this->departments['women'], 'category_id' => $this->categories['women_lingerie'] ?? null, 'price' => 39.99],
            ['title' => 'Robe - Satin', 'description' => 'Elegant satin robe for lounging in style.', 'department_id' => $this->departments['women'], 'category_id' => $this->categories['women_lingerie'] ?? null, 'price' => 59.99],

            // Additional variety
            ['title' => 'Wrap Dress', 'description' => 'Flattering wrap dress with adjustable fit.', 'department_id' => $this->departments['women'], 'category_id' => $this->categories['women_dresses'] ?? null, 'price' => 84.99],
            ['title' => 'Cardigan Sweater', 'description' => 'Cozy cardigan perfect for layering.', 'department_id' => $this->departments['women'], 'category_id' => $this->categories['women_tops'] ?? null, 'price' => 64.99],
        ];

        return array_slice($products, 0, $count);
    }

    /**
     * Generate Children's products
     */
    private function getChildrensProducts(int $count): array
    {
        $products = [
            ['title' => 'Kids Graphic T-Shirt Set', 'description' => 'Fun graphic tees with colorful designs kids love.', 'department_id' => $this->departments['children'], 'category_id' => null, 'price' => 19.99],
            ['title' => 'Boys Denim Jeans', 'description' => 'Durable denim jeans for active boys.', 'department_id' => $this->departments['children'], 'category_id' => null, 'price' => 34.99],
            ['title' => 'Girls Dress - Floral', 'description' => 'Adorable floral dress for special occasions.', 'department_id' => $this->departments['children'], 'category_id' => null, 'price' => 39.99],
            ['title' => 'Kids Hoodie - Cotton', 'description' => 'Comfortable cotton hoodie for everyday wear.', 'department_id' => $this->departments['children'], 'category_id' => null, 'price' => 29.99],
            ['title' => 'Girls Leggings Set', 'description' => 'Stretchy and comfortable leggings in various colors.', 'department_id' => $this->departments['children'], 'category_id' => null, 'price' => 24.99],
            ['title' => 'Boys Shorts - Athletic', 'description' => 'Athletic shorts for sports and play.', 'department_id' => $this->departments['children'], 'category_id' => null, 'price' => 22.99],
            ['title' => 'Kids Pajama Set', 'description' => 'Cozy pajama sets with fun patterns.', 'department_id' => $this->departments['children'], 'category_id' => null, 'price' => 27.99],
            ['title' => 'Girls Skirt - Tutu Style', 'description' => 'Playful tutu skirt for twirling and fun.', 'department_id' => $this->departments['children'], 'category_id' => null, 'price' => 26.99],
            ['title' => 'Boys Button-Down Shirt', 'description' => 'Smart button-down shirt for formal occasions.', 'department_id' => $this->departments['children'], 'category_id' => null, 'price' => 32.99],
            ['title' => 'Kids Sweater - Knit', 'description' => 'Warm knit sweater for cold weather.', 'department_id' => $this->departments['children'], 'category_id' => null, 'price' => 36.99],
            ['title' => 'Girls Cardigan', 'description' => 'Cute cardigan sweater for layering.', 'department_id' => $this->departments['children'], 'category_id' => null, 'price' => 31.99],
            ['title' => 'Boys Polo Shirt', 'description' => 'Classic polo shirt for smart casual wear.', 'department_id' => $this->departments['children'], 'category_id' => null, 'price' => 28.99],
            ['title' => 'Kids Raincoat', 'description' => 'Waterproof raincoat in bright colors.', 'department_id' => $this->departments['children'], 'category_id' => null, 'price' => 44.99],
            ['title' => 'Girls Jumpsuit', 'description' => 'Trendy one-piece jumpsuit for easy dressing.', 'department_id' => $this->departments['children'], 'category_id' => null, 'price' => 38.99],
            ['title' => 'Boys Cargo Pants', 'description' => 'Functional cargo pants with multiple pockets.', 'department_id' => $this->departments['children'], 'category_id' => null, 'price' => 33.99],
            ['title' => 'Kids Winter Jacket', 'description' => 'Insulated winter jacket for warmth.', 'department_id' => $this->departments['children'], 'category_id' => null, 'price' => 59.99],
            ['title' => 'Girls Tights Pack', 'description' => 'Colorful tights in convenient multi-pack.', 'department_id' => $this->departments['children'], 'category_id' => null, 'price' => 18.99],
            ['title' => 'Boys Sweatpants', 'description' => 'Comfortable sweatpants for lounging.', 'department_id' => $this->departments['children'], 'category_id' => null, 'price' => 25.99],
            ['title' => 'Kids Swimsuit', 'description' => 'Fun swimwear for pool and beach.', 'department_id' => $this->departments['children'], 'category_id' => null, 'price' => 29.99],
            ['title' => 'Girls Party Dress', 'description' => 'Elegant dress for birthday parties and events.', 'department_id' => $this->departments['children'], 'category_id' => null, 'price' => 49.99],
            ['title' => 'Boys Track Suit', 'description' => 'Matching track suit for active kids.', 'department_id' => $this->departments['children'], 'category_id' => null, 'price' => 42.99],
            ['title' => 'Kids Denim Jacket', 'description' => 'Classic denim jacket in kids sizes.', 'department_id' => $this->departments['children'], 'category_id' => null, 'price' => 39.99],
            ['title' => 'Girls Romper', 'description' => 'Cute and comfortable summer romper.', 'department_id' => $this->departments['children'], 'category_id' => null, 'price' => 33.99],
            ['title' => 'Boys Vest', 'description' => 'Smart vest for layering over shirts.', 'department_id' => $this->departments['children'], 'category_id' => null, 'price' => 27.99],
            ['title' => 'Kids Flannel Shirt', 'description' => 'Soft flannel shirt in plaid patterns.', 'department_id' => $this->departments['children'], 'category_id' => null, 'price' => 30.99],
        ];

        return array_slice($products, 0, $count);
    }

    /**
     * Generate Footwear products
     */
    private function getFootwearProducts(int $count, string $type = 'general'): array
    {
        $products = [
            ['title' => 'Men\'s Leather Dress Shoes', 'description' => 'Classic leather dress shoes for formal occasions.', 'department_id' => $this->departments['footwear'], 'category_id' => null, 'price' => 129.99],
            ['title' => 'Women\'s High Heels', 'description' => 'Elegant high heels perfect for special events.', 'department_id' => $this->departments['footwear'], 'category_id' => null, 'price' => 89.99],
            ['title' => 'Casual Sneakers - Unisex', 'description' => 'Comfortable sneakers for everyday wear.', 'department_id' => $this->departments['footwear'], 'category_id' => null, 'price' => 79.99],
            ['title' => 'Running Shoes - Performance', 'description' => 'High-performance running shoes with cushioning.', 'department_id' => $this->departments['footwear'], 'category_id' => null, 'price' => 119.99],
            ['title' => 'Kids School Shoes', 'description' => 'Durable school shoes for children.', 'department_id' => $this->departments['footwear'], 'category_id' => null, 'price' => 49.99],
            ['title' => 'Women\'s Ankle Boots', 'description' => 'Stylish ankle boots for fall and winter.', 'department_id' => $this->departments['footwear'], 'category_id' => null, 'price' => 99.99],
            ['title' => 'Men\'s Athletic Trainers', 'description' => 'Versatile training shoes for gym workouts.', 'department_id' => $this->departments['footwear'], 'category_id' => null, 'price' => 94.99],
            ['title' => 'Women\'s Ballet Flats', 'description' => 'Classic ballet flats for comfort and style.', 'department_id' => $this->departments['footwear'], 'category_id' => null, 'price' => 59.99],
            ['title' => 'Hiking Boots - Waterproof', 'description' => 'Rugged waterproof boots for outdoor adventures.', 'department_id' => $this->departments['footwear'], 'category_id' => null, 'price' => 139.99],
            ['title' => 'Flip Flops - Summer', 'description' => 'Casual flip flops for beach and pool.', 'department_id' => $this->departments['footwear'], 'category_id' => null, 'price' => 24.99],
            ['title' => 'Men\'s Loafers', 'description' => 'Sophisticated loafers for business casual.', 'department_id' => $this->departments['footwear'], 'category_id' => null, 'price' => 84.99],
            ['title' => 'Women\'s Wedge Sandals', 'description' => 'Comfortable wedge sandals with style.', 'department_id' => $this->departments['footwear'], 'category_id' => null, 'price' => 69.99],
            ['title' => 'Kids Light-Up Shoes', 'description' => 'Fun light-up shoes that kids adore.', 'department_id' => $this->departments['footwear'], 'category_id' => null, 'price' => 44.99],
            ['title' => 'Basketball Shoes', 'description' => 'High-top basketball shoes for court performance.', 'department_id' => $this->departments['footwear'], 'category_id' => null, 'price' => 129.99],
            ['title' => 'Women\'s Pumps', 'description' => 'Classic pumps for professional settings.', 'department_id' => $this->departments['footwear'], 'category_id' => null, 'price' => 79.99],
            ['title' => 'Men\'s Chelsea Boots', 'description' => 'Trendy Chelsea boots in leather.', 'department_id' => $this->departments['footwear'], 'category_id' => null, 'price' => 119.99],
            ['title' => 'Espadrilles - Canvas', 'description' => 'Lightweight espadrilles for summer.', 'department_id' => $this->departments['footwear'], 'category_id' => null, 'price' => 54.99],
            ['title' => 'Soccer Cleats', 'description' => 'Professional soccer cleats for the field.', 'department_id' => $this->departments['footwear'], 'category_id' => null, 'price' => 89.99],
            ['title' => 'Women\'s Knee-High Boots', 'description' => 'Fashion-forward knee-high boots.', 'department_id' => $this->departments['footwear'], 'category_id' => null, 'price' => 149.99],
            ['title' => 'Men\'s Slip-On Shoes', 'description' => 'Easy slip-on shoes for convenience.', 'department_id' => $this->departments['footwear'], 'category_id' => null, 'price' => 64.99],
            ['title' => 'Cross-Training Shoes', 'description' => 'Versatile shoes for various workouts.', 'department_id' => $this->departments['footwear'], 'category_id' => null, 'price' => 99.99],
            ['title' => 'Kids Velcro Sneakers', 'description' => 'Easy velcro sneakers for young children.', 'department_id' => $this->departments['footwear'], 'category_id' => null, 'price' => 39.99],
            ['title' => 'Women\'s Mules', 'description' => 'Stylish backless mules for easy wear.', 'department_id' => $this->departments['footwear'], 'category_id' => null, 'price' => 74.99],
            ['title' => 'Men\'s Oxford Shoes', 'description' => 'Traditional Oxford shoes for formal wear.', 'department_id' => $this->departments['footwear'], 'category_id' => null, 'price' => 109.99],
            ['title' => 'Winter Snow Boots', 'description' => 'Insulated boots for snow and ice.', 'department_id' => $this->departments['footwear'], 'category_id' => null, 'price' => 119.99],
        ];

        return array_slice($products, 0, $count);
    }

    /**
     * Generate Sports Wear products
     */
    private function getSportsWearProducts(int $count): array
    {
        $products = [
            ['title' => 'Performance T-Shirt - Moisture Wicking', 'description' => 'Technical fabric tee that keeps you dry during workouts.', 'department_id' => $this->departments['sports_wear'], 'category_id' => null, 'price' => 34.99],
            ['title' => 'Compression Leggings', 'description' => 'Supportive compression leggings for training.', 'department_id' => $this->departments['sports_wear'], 'category_id' => null, 'price' => 49.99],
            ['title' => 'Running Shorts - Lightweight', 'description' => 'Ultra-light running shorts with built-in liner.', 'department_id' => $this->departments['sports_wear'], 'category_id' => null, 'price' => 39.99],
            ['title' => 'Sports Bra - High Impact', 'description' => 'Maximum support sports bra for intense activities.', 'department_id' => $this->departments['sports_wear'], 'category_id' => null, 'price' => 44.99],
            ['title' => 'Track Jacket - Zip-Up', 'description' => 'Classic track jacket for warm-ups and cool-downs.', 'department_id' => $this->departments['sports_wear'], 'category_id' => null, 'price' => 59.99],
            ['title' => 'Yoga Pants - Stretchy', 'description' => 'Flexible yoga pants with high waist design.', 'department_id' => $this->departments['sports_wear'], 'category_id' => null, 'price' => 54.99],
            ['title' => 'Tank Top - Racerback', 'description' => 'Breathable racerback tank for cardio workouts.', 'department_id' => $this->departments['sports_wear'], 'category_id' => null, 'price' => 29.99],
            ['title' => 'Sweatpants - Jogger Style', 'description' => 'Comfortable jogger sweatpants for athleisure.', 'department_id' => $this->departments['sports_wear'], 'category_id' => null, 'price' => 49.99],
            ['title' => 'Cycling Shorts - Padded', 'description' => 'Padded cycling shorts for long rides.', 'department_id' => $this->departments['sports_wear'], 'category_id' => null, 'price' => 64.99],
            ['title' => 'Athletic Hoodie', 'description' => 'Cozy hoodie perfect for post-workout.', 'department_id' => $this->departments['sports_wear'], 'category_id' => null, 'price' => 69.99],
            ['title' => 'Training Top - Long Sleeve', 'description' => 'Performance long sleeve for cold weather training.', 'department_id' => $this->departments['sports_wear'], 'category_id' => null, 'price' => 44.99],
            ['title' => 'Basketball Jersey', 'description' => 'Breathable basketball jersey for court play.', 'department_id' => $this->departments['sports_wear'], 'category_id' => null, 'price' => 39.99],
            ['title' => 'Swim Trunks - Quick Dry', 'description' => 'Fast-drying swim trunks for water sports.', 'department_id' => $this->departments['sports_wear'], 'category_id' => null, 'price' => 34.99],
            ['title' => 'Windbreaker Jacket', 'description' => 'Lightweight windbreaker for outdoor running.', 'department_id' => $this->departments['sports_wear'], 'category_id' => null, 'price' => 74.99],
            ['title' => 'Gym Shorts - Mesh', 'description' => 'Breathable mesh shorts for gym workouts.', 'department_id' => $this->departments['sports_wear'], 'category_id' => null, 'price' => 32.99],
            ['title' => 'Base Layer Set', 'description' => 'Thermal base layer for cold weather sports.', 'department_id' => $this->departments['sports_wear'], 'category_id' => null, 'price' => 79.99],
            ['title' => 'Soccer Jersey', 'description' => 'Official-style soccer jersey with team colors.', 'department_id' => $this->departments['sports_wear'], 'category_id' => null, 'price' => 44.99],
            ['title' => 'Workout Crop Top', 'description' => 'Stylish crop top for fitness classes.', 'department_id' => $this->departments['sports_wear'], 'category_id' => null, 'price' => 36.99],
            ['title' => 'Tennis Skirt', 'description' => 'Classic tennis skirt with built-in shorts.', 'department_id' => $this->departments['sports_wear'], 'category_id' => null, 'price' => 49.99],
            ['title' => 'Athletic Pants - Tapered', 'description' => 'Tapered athletic pants with zip pockets.', 'department_id' => $this->departments['sports_wear'], 'category_id' => null, 'price' => 59.99],
            ['title' => 'Rashguard - UV Protection', 'description' => 'UV-protective rashguard for water activities.', 'department_id' => $this->departments['sports_wear'], 'category_id' => null, 'price' => 42.99],
            ['title' => 'Track Pants - Side Stripe', 'description' => 'Retro track pants with contrast stripes.', 'department_id' => $this->departments['sports_wear'], 'category_id' => null, 'price' => 54.99],
            ['title' => 'Sleeveless Workout Shirt', 'description' => 'Muscle-cut sleeveless shirt for training.', 'department_id' => $this->departments['sports_wear'], 'category_id' => null, 'price' => 27.99],
            ['title' => 'Cycling Jersey', 'description' => 'Aerodynamic cycling jersey with pockets.', 'department_id' => $this->departments['sports_wear'], 'category_id' => null, 'price' => 69.99],
            ['title' => 'Warmup Suit - Full Set', 'description' => 'Complete warmup suit for athletes.', 'department_id' => $this->departments['sports_wear'], 'category_id' => null, 'price' => 99.99],
        ];

        return array_slice($products, 0, $count);
    }

    /**
     * Generate Accessories products
     */
    private function getAccessoriesProducts(int $count): array
    {
        $products = [
            ['title' => 'Leather Belt - Classic', 'description' => 'Genuine leather belt with metal buckle.', 'department_id' => $this->departments['accessories'], 'category_id' => null, 'price' => 39.99],
            ['title' => 'Wool Scarf - Winter', 'description' => 'Warm wool scarf in neutral colors.', 'department_id' => $this->departments['accessories'], 'category_id' => null, 'price' => 34.99],
            ['title' => 'Baseball Cap', 'description' => 'Adjustable baseball cap for casual wear.', 'department_id' => $this->departments['accessories'], 'category_id' => null, 'price' => 24.99],
            ['title' => 'Leather Wallet', 'description' => 'Slim leather wallet with card slots.', 'department_id' => $this->departments['accessories'], 'category_id' => null, 'price' => 49.99],
            ['title' => 'Sunglasses - Aviator Style', 'description' => 'Classic aviator sunglasses with UV protection.', 'department_id' => $this->departments['accessories'], 'category_id' => null, 'price' => 59.99],
            ['title' => 'Beanie Hat - Knit', 'description' => 'Cozy knit beanie for cold weather.', 'department_id' => $this->departments['accessories'], 'category_id' => null, 'price' => 19.99],
            ['title' => 'Crossbody Bag', 'description' => 'Stylish crossbody bag for hands-free convenience.', 'department_id' => $this->departments['accessories'], 'category_id' => null, 'price' => 69.99],
            ['title' => 'Wrist Watch - Analog', 'description' => 'Elegant analog watch with leather strap.', 'department_id' => $this->departments['accessories'], 'category_id' => null, 'price' => 129.99],
            ['title' => 'Silk Tie', 'description' => 'Premium silk tie for formal occasions.', 'department_id' => $this->departments['accessories'], 'category_id' => null, 'price' => 44.99],
            ['title' => 'Leather Gloves', 'description' => 'Touchscreen-compatible leather gloves.', 'department_id' => $this->departments['accessories'], 'category_id' => null, 'price' => 54.99],
            ['title' => 'Backpack - Canvas', 'description' => 'Durable canvas backpack for daily use.', 'department_id' => $this->departments['accessories'], 'category_id' => null, 'price' => 79.99],
            ['title' => 'Pendant Necklace', 'description' => 'Delicate pendant necklace in sterling silver.', 'department_id' => $this->departments['accessories'], 'category_id' => null, 'price' => 89.99],
            ['title' => 'Fedora Hat', 'description' => 'Classic fedora hat for sophisticated style.', 'department_id' => $this->departments['accessories'], 'category_id' => null, 'price' => 49.99],
            ['title' => 'Shoulder Bag - Tote', 'description' => 'Spacious tote bag for shopping and work.', 'department_id' => $this->departments['accessories'], 'category_id' => null, 'price' => 64.99],
            ['title' => 'Bracelet - Chain Link', 'description' => 'Trendy chain link bracelet in gold tone.', 'department_id' => $this->departments['accessories'], 'category_id' => null, 'price' => 39.99],
            ['title' => 'Bucket Hat', 'description' => 'Casual bucket hat for sun protection.', 'department_id' => $this->departments['accessories'], 'category_id' => null, 'price' => 27.99],
            ['title' => 'Card Holder', 'description' => 'Minimalist card holder in genuine leather.', 'department_id' => $this->departments['accessories'], 'category_id' => null, 'price' => 29.99],
            ['title' => 'Hoop Earrings', 'description' => 'Classic hoop earrings in various sizes.', 'department_id' => $this->departments['accessories'], 'category_id' => null, 'price' => 34.99],
            ['title' => 'Messenger Bag', 'description' => 'Professional messenger bag for work.', 'department_id' => $this->departments['accessories'], 'category_id' => null, 'price' => 89.99],
            ['title' => 'Bow Tie', 'description' => 'Pre-tied bow tie for formal events.', 'department_id' => $this->departments['accessories'], 'category_id' => null, 'price' => 32.99],
            ['title' => 'Clutch Purse', 'description' => 'Elegant clutch purse for evening wear.', 'department_id' => $this->departments['accessories'], 'category_id' => null, 'price' => 59.99],
            ['title' => 'Stud Earrings - Crystal', 'description' => 'Sparkling crystal stud earrings.', 'department_id' => $this->departments['accessories'], 'category_id' => null, 'price' => 44.99],
            ['title' => 'Duffle Bag - Gym', 'description' => 'Spacious gym duffle with shoe compartment.', 'department_id' => $this->departments['accessories'], 'category_id' => null, 'price' => 74.99],
            ['title' => 'Anklet - Delicate Chain', 'description' => 'Dainty anklet with charm details.', 'department_id' => $this->departments['accessories'], 'category_id' => null, 'price' => 24.99],
            ['title' => 'Pocket Square Set', 'description' => 'Coordinated pocket squares for suits.', 'department_id' => $this->departments['accessories'], 'category_id' => null, 'price' => 29.99],
        ];

        return array_slice($products, 0, $count);
    }

    /**
     * Attach images to product from Unsplash
     */
    private function attachProductImages(Product $product, string $title): void
    {
        try {
            // Determine search keywords based on product title
            $keywords = $this->getImageKeywords($title);
            $this->command->info("  → Downloading image for '{$title}' (keywords: {$keywords})");

            for ($i = 0; $i < $this->imagesPerProduct; $i++) {
                // Download image from Lorem Picsum (reliable placeholder service)
                // Using random seed based on product ID to get consistent but varied images
                $seed = $product->id + $i;
                $imageUrl = "https://picsum.photos/seed/{$seed}/640/480";
                $this->command->info("    - Fetching from: {$imageUrl}");

                // Disable SSL verification for local development seeding
                $response = Http::withoutVerifying()->timeout(10)->get($imageUrl);

                if ($response->successful()) {
                    $this->command->info("    ✓ Download successful ({$response->header('Content-Length')} bytes)");

                    // Create temporary file
                    $tempPath = 'temp/' . Str::random(40) . '.jpg';
                    Storage::put($tempPath, $response->body());
                    $this->command->info("    ✓ Saved to temp: {$tempPath}");

                    // Add to media library
                    $storagePath = Storage::path($tempPath);
                    $this->command->info("    → Adding to media library from: {$storagePath}");

                    $media = $product->addMedia($storagePath)
                        ->preservingOriginal()
                        ->toMediaCollection('images');

                    $this->command->info("    ✓ Media attached! ID: {$media->id}, Path: {$media->getPath()}");

                    // Clean up temp file
                    Storage::delete($tempPath);
                    $this->command->info("    ✓ Temp file cleaned up");

                    // Add small delay to get different images
                    usleep(300000); // 0.3 seconds
                } else {
                    $this->command->error("    ✗ Download failed: HTTP {$response->status()}");
                }
            }

            // Verify images were attached
            $imageCount = $product->getMedia('images')->count();
            $this->command->info("  ✓ Product '{$title}' now has {$imageCount} image(s)");

        } catch (\Exception $e) {
            $this->command->error("  ✗ Failed to download images for: {$title}");
            $this->command->error("    Error: " . $e->getMessage());
            $this->command->error("    File: " . $e->getFile() . ':' . $e->getLine());
        }
    }

    /**
     * Get appropriate image search keywords based on product title
     */
    private function getImageKeywords(string $title): string
    {
        $title = strtolower($title);

        // Map product types to search keywords
        $keywordMap = [
            // Men's clothing
            'shirt' => 'mens-shirt,fashion',
            'polo' => 'polo-shirt,mens-fashion',
            't-shirt' => 'mens-tshirt,casual',
            'sweater' => 'mens-sweater,knitwear',
            'pants' => 'mens-pants,trousers',
            'jeans' => 'denim-jeans,mens',
            'shorts' => 'mens-shorts,casual',
            'suit' => 'mens-suit,formal',
            'blazer' => 'blazer,menswear',
            'tuxedo' => 'tuxedo,formal',
            'underwear' => 'mens-underwear,fashion',
            'boxer' => 'boxer-briefs,mens',

            // Women's clothing
            'dress' => 'womens-dress,fashion',
            'gown' => 'evening-gown,elegant',
            'blouse' => 'womens-blouse,fashion',
            'skirt' => 'womens-skirt,fashion',
            'leggings' => 'leggings,activewear',
            'jacket' => 'fashion-jacket,outerwear',
            'coat' => 'coat,outerwear',
            'lingerie' => 'lingerie,fashion',
            'pajama' => 'pajamas,sleepwear',
            'nightgown' => 'nightgown,sleepwear',
            'robe' => 'robe,loungewear',
            'cardigan' => 'cardigan,knitwear',

            // Children's
            'kids' => 'kids-clothing,children',
            'boys' => 'boys-clothing,kids',
            'girls' => 'girls-clothing,kids',

            // Footwear
            'shoes' => 'shoes,footwear',
            'sneakers' => 'sneakers,footwear',
            'boots' => 'boots,footwear',
            'heels' => 'high-heels,womens-shoes',
            'sandals' => 'sandals,footwear',
            'loafers' => 'loafers,mens-shoes',
            'flats' => 'ballet-flats,womens-shoes',
            'cleats' => 'soccer-cleats,sports',

            // Sports wear
            'performance' => 'activewear,sports',
            'athletic' => 'athletic-wear,fitness',
            'yoga' => 'yoga-pants,activewear',
            'running' => 'running-gear,sportswear',
            'training' => 'training-clothes,fitness',
            'jersey' => 'sports-jersey,athletic',
            'compression' => 'compression-wear,fitness',

            // Accessories
            'belt' => 'leather-belt,accessory',
            'scarf' => 'scarf,fashion-accessory',
            'cap' => 'baseball-cap,hat',
            'hat' => 'hat,fashion',
            'wallet' => 'leather-wallet,accessory',
            'sunglasses' => 'sunglasses,eyewear',
            'bag' => 'fashion-bag,accessory',
            'backpack' => 'backpack,bag',
            'watch' => 'wristwatch,accessory',
            'tie' => 'necktie,formal',
            'gloves' => 'fashion-gloves,accessory',
            'necklace' => 'necklace,jewelry',
            'earrings' => 'earrings,jewelry',
            'bracelet' => 'bracelet,jewelry',
        ];

        // Find matching keyword
        foreach ($keywordMap as $key => $value) {
            if (str_contains($title, $key)) {
                return $value;
            }
        }

        // Default fallback
        return 'fashion,clothing';
    }
}
