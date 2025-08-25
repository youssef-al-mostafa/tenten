
import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { PageProps, PaginationProps, Product } from '@/types';
import { PageRenderer } from '@/Components/Core/PageRender';

export default function Home({
    products,
    pageContent
}: PageProps<{
    products: PaginationProps<Product>;
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
                }}
            />
        </AppLayout>
    );
}
