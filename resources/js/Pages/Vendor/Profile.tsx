import { PageProps, PaginationProps, Product, Vendor } from '@/types';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { ProductItem } from '@/Components/App/ProductItem';
import { MapPin, Package, Star, Calendar, Share2 } from 'lucide-react';

function Profile({
    vendor,
    products
}: PageProps<{ vendor: Vendor, products: PaginationProps<Product> }>) {
    const totalProducts = products.data.length;
    const memberSince = new Date(vendor.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
    });

    return (
        <AppLayout>
            <Head title={`${vendor.store_name} - Store Profile`} />

            <div className="bg-base-200">
                <div className="pt-8 pb-8 px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-start gap-6 mb-8">
                            <div className="flex-shrink-0">
                                <div className="w-20 h-20 rounded-full bg-base-200 flex items-center justify-center shadow-lg">
                                    {vendor.cover_image ? (
                                        <img
                                            src={`/storage/${vendor.cover_image}`}
                                            alt={vendor.store_name}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-2xl font-bold text-gray-600">
                                            {vendor.store_name.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h1 className="text-3xl font-bold text-base-content mb-2">
                                            {vendor.store_name}
                                        </h1>
                                        <div className="flex items-center gap-1 text-base-content/70 mb-4">
                                            <Calendar className="w-4 h-4" />
                                            <span>Member since {memberSince}</span>
                                        </div>
                                        {vendor.store_address && (
                                            <div className="flex items-center gap-2 text-base-content/70 mb-4">
                                                <MapPin className="w-4 h-4" />
                                                <span>{vendor.store_address}</span>
                                            </div>
                                        )}
                                        {vendor.store_description && (
                                            <p className="text-base-content/80 leading-relaxed">
                                                {vendor.store_description}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        onClick={async () => {
                                            if (navigator.share) {
                                                try {
                                                    await navigator.share({
                                                        title: `${vendor.store_name} - Store`,
                                                        text: `Check out ${vendor.store_name} on TenTen`,
                                                        url: window.location.href
                                                    });
                                                } catch (err) {
                                                    console.log('Error sharing:', err);
                                                }
                                            } else {
                                                navigator.clipboard.writeText(window.location.href);
                                                alert('Store link copied to clipboard!');
                                            }
                                        }}
                                        className="bg-black text-white hover:bg-gray-800 px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <Share2 className="w-4 h-4" />
                                        Share Store
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-base-content">
                                    Products ({totalProducts})
                                </h2>
                                <div className="flex gap-2">
                                    <select className="select select-bordered select-sm h-fit">
                                        <option>Sort by: Latest</option>
                                        <option>Price: Low to High</option>
                                        <option>Price: High to Low</option>
                                        <option>Most Popular</option>
                                    </select>
                                </div>
                            </div>

                            {products.data.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {products.data.map(product => (
                                        <ProductItem product={product} key={product.id} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <Package className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
                                    <h3 className="text-xl font-bold text-base-content mb-2">
                                        No Products Yet
                                    </h3>
                                    <p className="text-base-content/70">
                                        This store hasn't listed any products yet. Check back soon!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
export default Profile
