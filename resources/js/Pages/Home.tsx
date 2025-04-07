import { PageProps, PaginationProps, Product } from '@/types';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { ProductItem } from '@/Components/App/ProductItem';
import Banner from '@/Components/App/Banner';
import Brands from '@/Components/App/Brands';
import Carousel_Horizental from '@/Components/Core/Carousel_Horizental';

export default function Home({
    auth,
    products
}: PageProps<{ products: PaginationProps<Product>}>) {
    return (
        <AppLayout>
            <Head title="Home" />
            <Banner />
            <Brands />
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 p-8">
               {products.data.map(product => (
                  <ProductItem product={product} key={product.id}/>
               ))}
            </div>
            <Carousel_Horizental />
        </AppLayout>
    );
}
