import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginationProps, Product } from '@/types';
import {Banner} from '@/Components/App/Banner';
import GuestLayout from '@/Layouts/GuestLayout';
import NavBar from '@/Components/App/NavBar';
import { ProductItem } from '@/Components/App/ProductItem';
import { Head } from '@inertiajs/react';
import Brands from '@/Components/App/Brands';

export default function Home({
    auth,
    products
}: PageProps<{ products: PaginationProps<Product>}>) {
    const Layout = auth.user ? AuthenticatedLayout : GuestLayout;
    return (
        <>
             <Head title="Home" />
            <NavBar/>
            <Banner/>
            <Brands/>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 p-8">
               {products.data.map(product => (
                  <ProductItem product={product} key={product.id}/>
               ))}
            </div>
        </>
    );
}
