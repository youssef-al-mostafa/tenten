import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginationProps, Product } from '@/types';
import Head from '@/Components/Core/Head';
import GuestLayout from '@/Layouts/GuestLayout';
import NavBar from '@/Components/App/NavBar';
import { ProductItem } from '@/Components/App/ProductItem';

export default function Home({
    auth,
    products
}: PageProps<{ products: PaginationProps<Product>}>) {
    const Layout = auth.user ? AuthenticatedLayout : GuestLayout;
    return (
        <>
            <NavBar />
            <div className="bg-gray-100 h-[300px]">
                <main>
                    <div className="hero  h-[300px]">
                        <div className="hero-content text-center">
                            <div className="max-w-md">
                                <h1 className="text-5xl font-bold">Hello there</h1>
                                <p className="py-6">
                                    Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
                                    quasi. In deleniti eaque aut repudiandae et a id nisi.
                                </p>
                                <button className="btn btn-primary">Get Started</button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 p-8">
               {products.data.map(product => (
                  <ProductItem product={product} key={product.id}/>
               ))}
            </div>
        </>
    );
}
