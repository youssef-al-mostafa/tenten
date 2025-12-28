
import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { PageProps, PaginationProps, Product } from '@/types';
import { PageRenderer } from '@/Components/Core/PageRender';

export default function Home({
    products,
    topVendors,
    pageContent
}: PageProps<{
    products: PaginationProps<Product>;
    topVendors?: any[];
    pageContent?: any;
}>) {
    return (
        <AppLayout>
            <Head title="Home" />

            <PageRenderer
                pageSlug="home"
                initialPageContent={pageContent}
                additionalProps={{
                    new_arrivals: { products },
                    product_showcase: { products },
                    top_vendors: { topVendors },
                }}
            />
        </AppLayout>
    );
}
