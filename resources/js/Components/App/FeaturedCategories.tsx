import { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';
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

interface FeaturedCategoriesProps {
    content?: {
        title?: string;
        bottom_text?: string;
        browse_button?: string;
        explore_button?: string;
        is_active?: boolean;
        sort_order?: number;
    };
}

const FeaturedCategories = ({ content }: FeaturedCategoriesProps) => {
    const { departments } = usePage<PageProps>().props;
    console.log('FeaturedCategories data:', { content, departments });

    if (!departments?.data || departments.data.length === 0) {
        return null;
    }

    const categories: FeaturedCategory[] = departments.data
        .filter((dept: any) => dept.active)
        .map((dept: any) => ({
            id: dept.id,
            name: dept.name,
            slug: dept.slug,
            image: dept.image ? `/storage/${dept.image}` : 'https://via.placeholder.com/600x400',
            productCount: dept.categories?.length || 0,
            description: dept.description || dept.name,
            gradient: dept.color ? dept.color : '#6B7280'
        }));

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-8">
                <div className="flex items-center justify-between mb-12">
                    {content?.title && (
                        <h2 className="text-4xl font-bold text-gray-900">{content.title}</h2>
                    )}
                    {content?.browse_button && (
                        <button className="border border-gray-300 hover:border-gray-400 transition-colors px-6 py-2 rounded-full">
                            {content.browse_button}
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <div key={category.id} className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
                                    loading="lazy"
                                />
                                <div 
                                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70 group-hover:opacity-80 transition-opacity"
                                    style={{
                                        background: `linear-gradient(to top, ${category.gradient}CC, ${category.gradient}66, transparent)`
                                    }}
                                ></div>
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
                    {content?.bottom_text && (
                        <p className="text-gray-600 mb-4">
                            {content.bottom_text}
                        </p>
                    )}
                    {content?.explore_button && (
                        <button className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                            {content.explore_button}
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
};

export default FeaturedCategories;
