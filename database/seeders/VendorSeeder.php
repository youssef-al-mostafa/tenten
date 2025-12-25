<?php

namespace Database\Seeders;

use App\Enums\RolesEnum;
use App\Enums\VendorStatusEnum;
use App\Models\User;
use App\Models\Vendor;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class VendorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $vendors = [
            // SPECIALIZED VENDORS (6) - Each focuses on ONE department
            [
                'name' => 'Marcus Thompson',
                'email_slug' => 'marcusmen',
                'store_name' => "Marcus Men's Collection",
                'store_description' => 'Premium menswear featuring classic and contemporary styles for the modern gentleman.',
                'store_address' => '123 Fashion Ave, New York, NY 10001',
                'specialization' => 'Men', // department_id: 6
            ],
            [
                'name' => 'Isabella Rose',
                'email_slug' => 'bellarosa',
                'store_name' => 'Bella Rosa Boutique',
                'store_description' => 'Elegant and trendy fashion pieces for women who love to express their unique style.',
                'store_address' => '456 Style Street, Los Angeles, CA 90210',
                'specialization' => 'Women', // department_id: 7
            ],
            [
                'name' => 'Sarah Martinez',
                'email_slug' => 'kidskingdom',
                'store_name' => 'Kids Kingdom',
                'store_description' => 'Adorable, comfortable, and durable clothing for children of all ages.',
                'store_address' => '789 Playground Rd, Chicago, IL 60614',
                'specialization' => 'Children', // department_id: 9
            ],
            [
                'name' => 'James Parker',
                'email_slug' => 'shoepalace',
                'store_name' => 'Shoe Palace',
                'store_description' => 'Premium footwear collection featuring the latest trends and timeless classics.',
                'store_address' => '321 Sole Street, Miami, FL 33139',
                'specialization' => 'Footwear', // department_id: 11
            ],
            [
                'name' => 'David Chen',
                'email_slug' => 'sportspro',
                'store_name' => 'Sports Pro Gear',
                'store_description' => 'High-performance athletic wear for professionals and fitness enthusiasts.',
                'store_address' => '555 Athletic Blvd, Seattle, WA 98101',
                'specialization' => 'Sports Wear', // department_id: 10
            ],
            [
                'name' => 'Emma Wilson',
                'email_slug' => 'accessoryhub',
                'store_name' => 'Accessory Hub',
                'store_description' => 'Curated collection of fashion accessories to complete your perfect look.',
                'store_address' => '888 Trend Lane, Austin, TX 78701',
                'specialization' => 'Accessories', // department_id: 8
            ],

            // MULTI-DEPARTMENT VENDORS (4) - Cover 2-3 related departments
            [
                'name' => 'Ryan Mitchell',
                'email_slug' => 'athleticmen',
                'store_name' => 'Athletic Men',
                'store_description' => 'Active lifestyle brand specializing in men\'s sportswear and athletic essentials.',
                'store_address' => '999 Active St, Denver, CO 80202',
                'specialization' => 'Men + Sports Wear', // departments: 6, 10
            ],
            [
                'name' => 'Sophia Anderson',
                'email_slug' => 'chicstyle',
                'store_name' => 'Chic & Style',
                'store_description' => 'Fashion-forward women\'s clothing and accessories for the contemporary woman.',
                'store_address' => '777 Elegant Ave, Boston, MA 02108',
                'specialization' => 'Women + Accessories', // departments: 7, 8
            ],
            [
                'name' => 'Michael Brown',
                'email_slug' => 'littlechamps',
                'store_name' => 'Little Champs',
                'store_description' => 'Complete clothing and footwear solutions for active and growing children.',
                'store_address' => '444 Family Rd, Portland, OR 97204',
                'specialization' => 'Children + Footwear', // departments: 9, 11
            ],
            [
                'name' => 'Olivia Davis',
                'email_slug' => 'activegear',
                'store_name' => 'Active Gear Store',
                'store_description' => 'Your one-stop shop for sportswear and performance footwear.',
                'store_address' => '222 Runner Way, San Diego, CA 92101',
                'specialization' => 'Sports Wear + Footwear', // departments: 10, 11
            ],

            // LARGE "DEPARTMENT STORE" VENDORS (2) - Sell across all or most departments
            [
                'name' => 'Robert Taylor',
                'email_slug' => 'fashionmart',
                'store_name' => 'Fashion Mart',
                'store_description' => 'Your complete fashion destination featuring clothing and accessories for the entire family.',
                'store_address' => '100 Commerce Plaza, Houston, TX 77002',
                'specialization' => 'All Departments', // all departments: 6,7,8,9,10,11
            ],
            [
                'name' => 'Jennifer White',
                'email_slug' => 'trendhaven',
                'store_name' => 'Trend Haven',
                'store_description' => 'Multi-brand fashion retailer offering the latest trends across all categories.',
                'store_address' => '500 Market St, San Francisco, CA 94102',
                'specialization' => 'All Departments', // all departments: 6,7,8,9,10,11
            ],
        ];

        foreach ($vendors as $vendorData) {
            $user = User::create([
                'name' => $vendorData['name'],
                'email' => 'youssefalmostafa22331+' . $vendorData['email_slug'] . '@gmail.com',
                'email_verified_at' => now(),
                'password' => Hash::make('youssef'),
            ]);
            $user->assignRole(RolesEnum::VENDOR->value);

            Vendor::create([
                'user_id' => $user->id,
                'status' => VendorStatusEnum::Approved,
                'store_name' => $vendorData['store_name'],
                'store_description' => $vendorData['store_description'],
                'store_address' => $vendorData['store_address'],
            ]);

            $this->command->info("Created vendor: {$vendorData['store_name']} ({$vendorData['specialization']})");
        }

        $this->command->info('✓ 12 vendors created successfully with password: youssef');
    }
}
