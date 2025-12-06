import { MapPin } from 'lucide-react';
import { goToVendorProfile, navigateTo } from '@/helpers';

interface TopVendor {
    id: number;
    name: string;
    storeName: string;
    avatar: string;
    rating: number;
    reviewCount: number;
    location: string;
    description: string;
    topProducts: {
        id: number;
        image: string;
        title: string;
        price: number;
    }[];
}

interface TopVendorsProps {
    content?: {
        title?: string;
        view_all_button?: string;
        is_active?: boolean;
        sort_order?: number;
    };
    topVendors?: TopVendor[];
}

export const goToAllVendorsPage = () => {
    navigateTo('vendor.all');
}

const TopVendors = ({ content, topVendors: vendorsData }: TopVendorsProps) => {
    const defaultVendors: TopVendor[] = [
        {
            id: 1,
            name: "Fashion Haven",
            storeName: "@fashionhaven",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
            rating: 4.9,
            reviewCount: 2847,
            location: "New York, USA",
            description: "Premium fashion and accessories for modern lifestyle",
            topProducts: [
                {
                    id: 1,
                    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=80&h=80&fit=crop",
                    title: "Designer Dress",
                    price: 89.99
                },
                {
                    id: 2,
                    image: "https://images.unsplash.com/photo-1506629905607-d5e31ad24e04?w=80&h=80&fit=crop",
                    title: "Summer Blazer",
                    price: 129.99
                },
                {
                    id: 3,
                    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=80&h=80&fit=crop",
                    title: "Casual Sneakers",
                    price: 79.99
                }
            ]
        }
    ];

    const topVendors = vendorsData && vendorsData.length > 0 ? vendorsData : defaultVendors;

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-8">
                <div className="flex items-center justify-between mb-12">
                    {content?.title && (
                        <h2 className="text-4xl font-bold text-gray-900">{content.title}</h2>
                    )}
                    {content?.view_all_button && (
                        <button className="border border-gray-300 hover:border-gray-400
                                           transition-colors px-6 py-2 rounded-full"
                            onClick={goToAllVendorsPage}>
                            {content.view_all_button}
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {topVendors.map((vendor) => (
                        <div key={vendor.id} className="bg-white rounded-lg shadow-md hover:shadow-lg
                                                        transition-shadow overflow-hidden">
                            <div className="p-6 flex flex-col justify-between h-full">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center
                                                    justify-center flex-shrink-0">
                                        {vendor.avatar ? (
                                            <img
                                                src={vendor.avatar}
                                                alt={vendor.name}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-xl font-bold text-gray-600">
                                                {vendor.name.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-lg text-gray-900">
                                                {vendor.name}
                                            </h3>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-2">
                                            {vendor.storeName}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-gray-600 mb-4">
                                    {vendor.description === 'No description available' ? ' ' : vendor.description}
                                </p>

                                <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                                    <MapPin className="h-4 w-4" />
                                    <span>{vendor.location}</span>
                                </div>

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

                                <button
                                    onClick={() => goToVendorProfile(vendor.storeName)}
                                    className="w-full bg-black text-white py-2 rounded-lg
                                              hover:bg-gray-800 transition-colors">
                                    Visit Store
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TopVendors;
