import { Department, PageProps, PaginationProps, Product } from '@/Types';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { ProductItem } from '@/Components/App/ProductItem';

const index = ({
    appName,
    department,
    products
}: PageProps<{ department: Department, products: PaginationProps<Product> }>) => {
    return (
        <AppLayout>
            <Head>
                <title>{department.name}</title>
                <meta name="title" content={department.meta_title} />
                <meta name="description" content={department.meta_description} />
                <link rel="canonical" href={route('product.byDepartment', department.slug)} />
                <meta property="og: title" content={department.name} />
                <meta property="og: description" content={department.meta_description} />
                <meta property="og: url" content={route('product.byDepartment', department.slug)} />
                <meta property="og: type" content="website" />
                <meta property="og: site_name" content={appName} />
            </Head>

            <div className="container mx-auto">
                <div className="hero bg-base-200 min-h-[120px]">
                    <div className="hero-content text-center">
                        <div className="max-w-lg">
                            <h1 className="text-5xl font-bold">
                                {department.name}
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 p-8">
                {products.data.length === 0 && <div className="py-16 px-8 text-centertext-gray-300 text-3xl">
                    No products found
                </div>}

                {products.data.map(product => (
                    <ProductItem product={product} key={product.id} />
                ))}
            </div>
        </AppLayout>
    );
}

export default index
