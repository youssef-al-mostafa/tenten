import { Sparkles, TrendingUp, ShoppingBag, Heart } from 'lucide-react';

interface SeasonalItem {
    id: number;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    brand: string;
    category: string;
    isNew: boolean;
    isTrending: boolean;
    versatilityScore: number;
    occasions: string[];
}

interface SeasonalSection {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    theme: string;
    items: SeasonalItem[];
}

const SeasonalMustHaves = () => {
    const seasonalSections: SeasonalSection[] = [
        {
            id: 1,
            title: "Spring Essentials",
            subtitle: "Fresh & Versatile",
            description: "Build your perfect spring wardrobe with these timeless pieces that transition effortlessly from day to night.",
            theme: "spring",
            items: [
                {
                    id: 1,
                    name: "Classic Trench Coat",
                    price: 299.99,
                    originalPrice: 349.99,
                    image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=300&h=400&fit=crop",
                    brand: "Timeless Co",
                    category: "Outerwear",
                    isNew: false,
                    isTrending: true,
                    versatilityScore: 5,
                    occasions: ["Work", "Weekend", "Travel"]
                },
                {
                    id: 2,
                    name: "Silk Button-Down Shirt",
                    price: 159.99,
                    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&h=400&fit=crop",
                    brand: "Elegant Essentials",
                    category: "Tops",
                    isNew: true,
                    isTrending: false,
                    versatilityScore: 5,
                    occasions: ["Office", "Brunch", "Date Night"]
                },
                {
                    id: 3,
                    name: "High-Waisted Wide Pants",
                    price: 129.99,
                    image: "https://images.unsplash.com/photo-1506629905607-d5e31ad24e04?w=300&h=400&fit=crop",
                    brand: "Modern Silhouette",
                    category: "Bottoms",
                    isNew: false,
                    isTrending: true,
                    versatilityScore: 4,
                    occasions: ["Work", "Casual", "Evening"]
                },
                {
                    id: 4,
                    name: "Leather Loafers",
                    price: 199.99,
                    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=400&fit=crop",
                    brand: "Comfort Luxury",
                    category: "Shoes",
                    isNew: false,
                    isTrending: false,
                    versatilityScore: 4,
                    occasions: ["Office", "Weekend", "Travel"]
                }
            ]
        },
        {
            id: 2,
            title: "Capsule Wardrobe",
            subtitle: "10 Pieces, Endless Looks",
            description: "These carefully selected investment pieces work together to create countless stylish combinations for any season.",
            theme: "capsule",
            items: [
                {
                    id: 5,
                    name: "Little Black Dress",
                    price: 249.99,
                    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=300&h=400&fit=crop",
                    brand: "Iconic Pieces",
                    category: "Dresses",
                    isNew: false,
                    isTrending: false,
                    versatilityScore: 5,
                    occasions: ["Work", "Dinner", "Events", "Travel"]
                },
                {
                    id: 6,
                    name: "Cashmere Cardigan",
                    price: 189.99,
                    originalPrice: 229.99,
                    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop",
                    brand: "Luxe Basics",
                    category: "Knitwear",
                    isNew: false,
                    isTrending: true,
                    versatilityScore: 5,
                    occasions: ["Office", "Weekend", "Travel", "Layering"]
                },
                {
                    id: 7,
                    name: "Tailored Blazer",
                    price: 219.99,
                    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop",
                    brand: "Sharp Tailoring",
                    category: "Blazers",
                    isNew: true,
                    isTrending: false,
                    versatilityScore: 5,
                    occasions: ["Work", "Meetings", "Events", "Smart Casual"]
                },
                {
                    id: 8,
                    name: "White Sneakers",
                    price: 149.99,
                    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop",
                    brand: "Clean Lines",
                    category: "Shoes",
                    isNew: false,
                    isTrending: true,
                    versatilityScore: 4,
                    occasions: ["Casual", "Weekend", "Travel", "Athleisure"]
                }
            ]
        },
    ];

    const renderVersatilityStars = (score: number) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Sparkles
                        key={star}
                        className={`h-3 w-3 ${star <= score ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                ))}
            </div>
        );
    };

    return (
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
            <div className="container mx-auto px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">SEASONAL MUST-HAVES</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Build your perfect wardrobe with versatile pieces that work seamlessly together across seasons and occasions.
                    </p>
                </div>

                <div className="space-y-20">
                    {seasonalSections.map((section) => (
                        <div key={section.id} className="space-y-8">
                            <div className="text-center">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{section.title}</h3>
                                <p className="text-lg text-gray-600 font-medium mb-3">{section.subtitle}</p>
                                <p className="text-gray-600 max-w-3xl mx-auto">{section.description}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {section.items.map((item) => (
                                    <div key={item.id} className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                                        <div className="relative overflow-hidden">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                                            />

                                            <div className="absolute top-3 left-3 flex flex-col gap-1">
                                                {item.isNew && (
                                                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                                        New
                                                    </span>
                                                )}
                                                {item.isTrending && (
                                                    <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                                                        <TrendingUp className="h-3 w-3" />
                                                        Trending
                                                    </span>
                                                )}
                                            </div>

                                            <div className="absolute top-3 right-3 flex gap-2">
                                                <button className="bg-white bg-opacity-90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-opacity-100">
                                                    <Heart className="h-4 w-4 text-gray-700" />
                                                </button>
                                                <button className="bg-white bg-opacity-90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-opacity-100">
                                                    <ShoppingBag className="h-4 w-4 text-gray-700" />
                                                </button>
                                            </div>

                                            {item.originalPrice && (
                                                <div className="absolute bottom-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
                                                    Save ${(item.originalPrice - item.price).toFixed(2)}
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-900 line-clamp-1">{item.name}</h4>
                                                    <p className="text-sm text-gray-600">{item.brand}</p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-gray-900">${item.price}</span>
                                                        {item.originalPrice && (
                                                            <span className="text-sm text-gray-500 line-through">${item.originalPrice}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs text-gray-600">Versatility:</span>
                                                    {renderVersatilityStars(item.versatilityScore)}
                                                </div>
                                                <div className="flex flex-wrap gap-1">
                                                    {item.occasions.slice(0, 3).map((occasion, idx) => (
                                                        <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                                            {occasion}
                                                        </span>
                                                    ))}
                                                    {item.occasions.length > 3 && (
                                                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                                            +{item.occasions.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <button className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium">
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="text-center">
                                <button className="border border-gray-300 hover:border-gray-400 transition-colors px-6 py-2 rounded-full font-medium">
                                    View Complete {section.title}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SeasonalMustHaves;
