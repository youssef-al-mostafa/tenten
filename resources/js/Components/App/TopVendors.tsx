import { Star, MapPin, Package } from 'lucide-react';

interface TopVendor {
    id: number;
    name: string;
    storeName: string;
    avatar: string;
    rating: number;
    reviewCount: number;
    productCount: number;
    location: string;
    badge: string;
    description: string;
    topProducts: {
        id: number;
        image: string;
        title: string;
        price: number;
    }[];
}

const TopVendors = () => {
    const topVendors: TopVendor[] = [
        {
            id: 1,
            name: "Fashion Haven",
            storeName: "@fashionhaven",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
            rating: 4.9,
            reviewCount: 2847,
            productCount: 156,
            location: "New York, USA",
            badge: "Top Seller",
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
        },
        {
            id: 2,
            name: "Elite Couture",
            storeName: "@elitecouture",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
            rating: 4.8,
            reviewCount: 1923,
            productCount: 234,
            location: "Milan, Italy",
            badge: "Verified",
            description: "Luxury designer clothing and haute couture pieces",
            topProducts: [
                {
                    id: 1,
                    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=80&h=80&fit=crop",
                    title: "Silk Scarf",
                    price: 145.99
                },
                {
                    id: 2,
                    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=80&h=80&fit=crop",
                    title: "Leather Handbag",
                    price: 399.99
                },
                {
                    id: 3,
                    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=80&h=80&fit=crop",
                    title: "Evening Gown",
                    price: 599.99
                }
            ]
        },
        {
            id: 3,
            name: "Urban Style Co",
            storeName: "@urbanstyle",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
            rating: 4.7,
            reviewCount: 1456,
            productCount: 189,
            location: "London, UK",
            badge: "Rising Star",
            description: "Contemporary streetwear and urban fashion trends",
            topProducts: [
                {
                    id: 1,
                    image: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=80&h=80&fit=crop",
                    title: "Denim Jacket",
                    price: 89.99
                },
                {
                    id: 2,
                    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=80&h=80&fit=crop",
                    title: "Graphic Tee",
                    price: 34.99
                },
                {
                    id: 3,
                    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=80&h=80&fit=crop",
                    title: "High-top Sneakers",
                    price: 124.99
                }
            ]
        }
    ];

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-8">
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-4xl font-bold text-gray-900">TOP VENDORS</h2>
                    <button className="border border-gray-300 hover:border-gray-400 transition-colors px-6 py-2 rounded-full">
                        View All Vendors
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {topVendors.map((vendor) => (
                        <div key={vendor.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-start gap-4 mb-4">
                                    <img
                                        src={vendor.avatar}
                                        alt={vendor.name}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-lg text-gray-900">
                                                {vendor.name}
                                            </h3>
                                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                                {vendor.badge}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-2">{vendor.storeName}</p>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                <span className="font-semibold">{vendor.rating}</span>
                                                <span>({vendor.reviewCount})</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Package className="h-4 w-4" />
                                                <span>{vendor.productCount}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-gray-600 mb-4">{vendor.description}</p>

                                <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                                    <MapPin className="h-4 w-4" />
                                    <span>{vendor.location}</span>
                                </div>

                                <div className="mb-4">
                                    <h4 className="font-semibold text-sm text-gray-700 mb-2">Top Products</h4>
                                    <div className="flex gap-2">
                                        {vendor.topProducts.map((product) => (
                                            <div key={product.id} className="flex-1">
                                                <img
                                                    src={product.image}
                                                    alt={product.title}
                                                    className="w-full h-16 object-cover rounded-md mb-1"
                                                />
                                                <p className="text-xs text-gray-600 truncate">{product.title}</p>
                                                <p className="text-xs font-semibold">${product.price}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors">
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
