import { PageProps, PaginationProps, Vendor } from '@/types';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Store } from 'lucide-react';
import VendorCard from '@/Components/App/VendorCard';

interface AllVendorsProps extends Record<string, unknown> {
    vendors: PaginationProps<Vendor>;
}

const AllVendors = ({ vendors }: PageProps<AllVendorsProps>) => {
    return (
        <AppLayout>
            <Head title="All Stores">
                <meta name="description" content="Discover all our verified vendors. Browse stores and find unique products from trusted sellers." />
            </Head>

            <div className="bg-gray-50 min-h-screen">
                <div className="container mx-auto px-8 py-12">
                    <div className="mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-3">All Stores</h1>
                        <p className="text-gray-600">
                            Discover amazing stores from verified vendors
                        </p>
                    </div>

                    {vendors.data.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="max-w-md mx-auto">
                                <Store className="w-24 h-24 mx-auto text-gray-300 mb-6" />
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">No vendors found</h3>
                                <p className="text-gray-600">
                                    There are no active vendors at the moment. Check back soon!
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {vendors.data.map((vendor) => (
                                    <VendorCard key={vendor.user_id} vendor={vendor} maxProducts={6} />
                                ))}
                            </div>

                            {vendors.meta?.links && Array.isArray(vendors.meta.links) && vendors.meta.links.length > 3 && (
                                <div className="mt-12 flex justify-center">
                                    <div className="flex items-center gap-2">
                                        {vendors.meta.links.map((link, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    if (link.url) {
                                                        router.get(link.url, {}, {
                                                            preserveState: true,
                                                        });
                                                    }
                                                }}
                                                disabled={!link.url}
                                                className={`min-w-[40px] px-4 py-2 rounded-lg font-satoshi font-medium transition-all duration-200 ${link.active
                                                    ? 'bg-black text-white shadow-md'
                                                    : link.url
                                                        ? 'bg-white text-gray-700 hover:bg-black hover:text-white border border-gray-300'
                                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                    }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default AllVendors;
