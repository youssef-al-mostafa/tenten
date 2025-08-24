import { PageProps, PaginationProps, Product } from '@/types';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Banner from '@/Components/App/Banner';
import Brands from '@/Components/App/Brands';
import ProductsGrid from '@/Components/App/ProductsGrid';
import ReviewCarousel from '@/Components/App/ReviewCarousel';
import TopVendors from '@/Components/App/TopVendors';
import FeaturedCategories from '@/Components/App/FeaturedCategories';
import CuratedCollections from '@/Components/App/CuratedCollections';

export default function Home({
    auth,
    products
}: PageProps<{ products: PaginationProps<Product> }>) {
    return (
        <AppLayout>
            <Head title="Home" />
            <Banner />
            <Brands />
            <CuratedCollections/>
            <ProductsGrid
                products={products}
                sectionTitle="NEW ARRIVALS"
                emptyMessage="No new arrivals at the moment"
                showHeader={true}
                className="bg-transparent"
                gridCols={{
                    sm: "grid-cols-1",
                    md: "md:grid-cols-2",
                    lg: "lg:grid-cols-4"
                }}
            />
            <TopVendors />
            <FeaturedCategories />
            <ReviewCarousel />
        </AppLayout>
    );
}
