import { PageProps, PaginationProps, Vendor } from '@/types';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { MapPin, Store } from 'lucide-react';
import { goToVendorProfile } from '@/helpers';

interface AllVendorsProps extends Record<string, unknown> {
    vendors: PaginationProps<Vendor>;
}

const AllVendors = ({ vendors }: PageProps<AllVendorsProps>) => {
    return (
        <AppLayout>
            <Head title="All Vendors">
                <meta name="description" content="Discover all our verified vendors. Browse stores and find unique products from trusted sellers." />
            </Head>

            <div className="bg-gray-50 min-h-screen">
                <div className="container mx-auto px-8 py-12">
                    <div className="mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-3">All Vendors</h1>
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
                                    <div
                                        key={vendor.user_id}
                                        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                                    >
                                        <div className="p-6 flex flex-col h-full">
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                                    {vendor.cover_image ? (
                                                        <img
                                                            src={`/storage/${vendor.cover_image}`}
                                                            alt={vendor.store_name}
                                                            className="w-full h-full rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-xl font-bold text-gray-600">
                                                            {vendor.store_name.charAt(0).toUpperCase()}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-lg text-gray-900 mb-1">
                                                        {vendor.store_name}
                                                    </h3>
                                                    {vendor.user && (
                                                        <p className="text-gray-600 text-sm">
                                                            by {vendor.user.name}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {vendor.store_description && (
                                                <p className="text-gray-600 mb-4 line-clamp-2">
                                                    {vendor.store_description}
                                                </p>
                                            )}

                                            {vendor.store_address && (
                                                <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                                                    <MapPin className="h-4 w-4" />
                                                    <span>{vendor.store_address}</span>
                                                </div>
                                            )}

                                            {vendor.topProducts && vendor.topProducts.length > 0 && (
                                                <div className="mb-4">
                                                    <h4 className="font-semibold text-sm text-gray-700 mb-2">
                                                        Top Products
                                                    </h4>
                                                    <div className="flex gap-2">
                                                        {vendor.topProducts.map((product) => (
                                                            <div key={product.id} className="">
                                                                <img
                                                                    src={product.image}
                                                                    alt={product.title}
                                                                    className="w-full h-16 object-cover rounded-md mb-1"
                                                                />
                                                                <p className="text-xs text-gray-600 truncate">
                                                                    {product.title}
                                                                </p>
                                                                <p className="text-xs font-semibold">
                                                                    ${product.price}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <button
                                                onClick={() => goToVendorProfile(vendor.store_name)}
                                                className="mt-auto w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
                                            >
                                                Visit Store
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {Array.isArray(vendors.links) && vendors.links.length > 3 && (
                                <div className="mt-12 flex justify-center">
                                    <div className="flex items-center space-x-2">
                                        {vendors.links.map((link, index) => (
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
                                                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                                                    link.active
                                                        ? 'bg-black text-white'
                                                        : link.url
                                                        ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
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
