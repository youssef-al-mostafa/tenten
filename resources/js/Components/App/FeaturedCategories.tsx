import { ArrowRight } from 'lucide-react';

interface FeaturedCategory {
    id: number;
    name: string;
    slug: string;
    image: string;
    productCount: number;
    description: string;
    gradient: string;
}

const FeaturedCategories = () => {
    const categories: FeaturedCategory[] = [
        {
            id: 1,
            name: "Women's Fashion",
            slug: "womens-fashion",
            image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=400&fit=crop",
            productCount: 2847,
            description: "Elegant styles for the modern woman",
            gradient: "from-pink-500 to-rose-500"
        },
        {
            id: 2,
            name: "Men's Fashion",
            slug: "mens-fashion",
            image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=600&h=400&fit=crop",
            productCount: 1923,
            description: "Sophisticated looks for every occasion",
            gradient: "from-blue-500 to-indigo-600"
        },
        {
            id: 3,
            name: "Children's Wear",
            slug: "childrens-wear",
            image: "https://images.unsplash.com/photo-1519278013264-f2b64a6a4c58?w=600&h=400&fit=crop",
            productCount: 1456,
            description: "Comfortable and stylish kids clothing",
            gradient: "from-yellow-500 to-orange-500"
        },
        {
            id: 4,
            name: "Sportswear",
            slug: "sportswear",
            image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
            productCount: 892,
            description: "Performance gear for active lifestyle",
            gradient: "from-green-500 to-teal-600"
        },
        {
            id: 5,
            name: "Accessories",
            slug: "accessories",
            image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=400&fit=crop",
            productCount: 1234,
            description: "Complete your look with perfect accessories",
            gradient: "from-purple-500 to-pink-600"
        },
        {
            id: 6,
            name: "Footwear",
            slug: "footwear",
            image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=400&fit=crop",
            productCount: 567,
            description: "Step out in style and comfort",
            gradient: "from-gray-700 to-gray-900"
        }
    ];

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-8">
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-4xl font-bold text-gray-900">FEATURED CATEGORIES</h2>
                    <button className="border border-gray-300 hover:border-gray-400 transition-colors px-6 py-2 rounded-full">
                        Browse All Categories
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <div key={category.id} className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-70 group-hover:opacity-80 transition-opacity`}></div>
                            </div>

                            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                                <div className="mb-2">
                                    <h3 className="text-2xl font-bold mb-1">{category.name}</h3>
                                    <p className="text-sm opacity-90 mb-2">{category.description}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">
                                            {category.productCount.toLocaleString()} Products
                                        </span>
                                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>

                            <div className="absolute top-4 right-4 bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-3 py-1">
                                <span className="text-white text-sm font-medium">
                                    {category.productCount > 1000 ? `${Math.floor(category.productCount / 1000)}k+` : category.productCount}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <p className="text-gray-600 mb-4">
                        Discover products from over 30,000+ happy customers across all categories
                    </p>
                    <button className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                        Explore All Products
                    </button>
                </div>
            </div>
        </section>
    );
};

export default FeaturedCategories;
