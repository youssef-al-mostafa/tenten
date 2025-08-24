import { Eye, Heart, ShoppingBag } from 'lucide-react';

interface Collection {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    image: string;
    itemCount: number;
    priceRange: string;
    theme: string;
    products: {
        id: number;
        image: string;
        title: string;
        price: number;
        brand: string;
    }[];
}

const CuratedCollections = () => {
    const collections: Collection[] = [
        {
            id: 1,
            title: "Spring Elegance",
            subtitle: "Fresh & Sophisticated",
            description: "Discover timeless pieces that capture the essence of spring sophistication with flowing fabrics and delicate details.",
            image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=800&fit=crop",
            itemCount: 12,
            priceRange: "$89 - $399",
            theme: "light",
            products: [
                {
                    id: 1,
                    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=150&h=200&fit=crop",
                    title: "Silk Midi Dress",
                    price: 189.99,
                    brand: "Elegant Co"
                },
                {
                    id: 2,
                    image: "https://images.unsplash.com/photo-1506629905607-d5e31ad24e04?w=150&h=200&fit=crop",
                    title: "Linen Blazer",
                    price: 149.99,
                    brand: "Modern Style"
                },
                {
                    id: 3,
                    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=150&h=200&fit=crop",
                    title: "Block Heels",
                    price: 129.99,
                    brand: "Step Forward"
                }
            ]
        },
        {
            id: 2,
            title: "Winter Luxe",
            subtitle: "Opulent & Warm",
            description: "Embrace the season with luxurious textures, rich fabrics, and statement pieces that define winter elegance.",
            image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=800&fit=crop",
            itemCount: 15,
            priceRange: "$129 - $599",
            theme: "dark",
            products: [
                {
                    id: 1,
                    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=150&h=200&fit=crop",
                    title: "Cashmere Coat",
                    price: 499.99,
                    brand: "Luxury Line"
                },
                {
                    id: 2,
                    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=150&h=200&fit=crop",
                    title: "Wool Scarf",
                    price: 89.99,
                    brand: "Cozy Couture"
                },
                {
                    id: 3,
                    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=150&h=200&fit=crop",
                    title: "Leather Boots",
                    price: 299.99,
                    brand: "Urban Steps"
                }
            ]
        },
        {
            id: 3,
            title: "Evening Glamour",
            subtitle: "Sophisticated & Bold",
            description: "Make an unforgettable impression with our carefully selected evening wear that combines modern sophistication with timeless glamour.",
            image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&h=800&fit=crop",
            itemCount: 8,
            priceRange: "$199 - $799",
            theme: "elegant",
            products: [
                {
                    id: 1,
                    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=150&h=200&fit=crop",
                    title: "Evening Gown",
                    price: 599.99,
                    brand: "Glamour House"
                },
                {
                    id: 2,
                    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=150&h=200&fit=crop",
                    title: "Clutch Bag",
                    price: 149.99,
                    brand: "Accent Pieces"
                },
                {
                    id: 3,
                    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=150&h=200&fit=crop",
                    title: "Statement Earrings",
                    price: 79.99,
                    brand: "Jewel Craft"
                }
            ]
        }
    ];

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">CURATED COLLECTIONS</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Thoughtfully selected pieces for every occasion, styled by our fashion experts to inspire your next look.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {collections.map((collection) => (
                        <div key={collection.id} className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                            <div className="relative h-96 overflow-hidden">
                                <img
                                    src={collection.image}
                                    alt={collection.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-500"></div>

                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button className="bg-white bg-opacity-90 backdrop-blur-sm rounded-full p-2 hover:bg-opacity-100 transition-all">
                                        <Heart className="h-5 w-5 text-gray-700" />
                                    </button>
                                    <button className="bg-white bg-opacity-90 backdrop-blur-sm rounded-full p-2 hover:bg-opacity-100 transition-all">
                                        <Eye className="h-5 w-5 text-gray-700" />
                                    </button>
                                </div>

                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-4">
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">{collection.title}</h3>
                                        <p className="text-sm text-gray-600 font-medium mb-2">{collection.subtitle}</p>
                                        <div className="flex justify-between items-center text-sm text-gray-700">
                                            <span>{collection.itemCount} pieces</span>
                                            <span className="font-semibold">{collection.priceRange}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    {collection.description}
                                </p>

                                <div className="mb-6">
                                    <h4 className="font-semibold text-gray-900 mb-3">Featured Items</h4>
                                    <div className="grid grid-cols-3 gap-3">
                                        {collection.products.map((product) => (
                                            <div key={product.id} className="group/item relative">
                                                <img
                                                    src={product.image}
                                                    alt={product.title}
                                                    className="w-full h-24 object-cover rounded-lg group-hover/item:scale-105 transition-transform duration-300"
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover/item:bg-opacity-20 rounded-lg transition-all duration-300 flex items-center justify-center">
                                                    <ShoppingBag className="h-4 w-4 text-white opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                                                </div>
                                                <div className="mt-2">
                                                    <p className="text-xs text-gray-600 truncate">{product.title}</p>
                                                    <p className="text-xs font-semibold text-gray-900">${product.price}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium">
                                    Explore Collection
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <button className="border border-gray-300 hover:border-gray-400 transition-colors px-8 py-3 rounded-full font-medium">
                        View All Collections
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CuratedCollections;
