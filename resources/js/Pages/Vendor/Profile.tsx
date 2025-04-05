import { PageProps, PaginationProps, Product, Vendor } from '@/types';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { ProductItem } from '@/Components/App/ProductItem';

function Profile({
    vendor,
    products
}: PageProps<{vendor: Vendor, products: PaginationProps<Product>}>) {
    return (
        <AppLayout>
            <Head title={vendor.store_name} />
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 p-8">
               {products.data.map(product => (
                  <ProductItem product={product} key={product.id}/>
               ))}
            </div>
        </AppLayout>
    );
}
export default Profile
