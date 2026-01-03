import { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
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

    if (!departments || departments.length === 0) {
        return null;
    }

    const categories: FeaturedCategory[] = departments
        .filter((dept: any) => dept.active)
        .map((dept: any) => {
            return {
                id: dept.id,
                name: dept.name,
                slug: dept.slug,
                image: dept.image ? `/storage/${dept.image}` : 'https://via.placeholder.com/600x400',
                productCount: dept.products_count ?? 0,
                description: dept.description || dept.name,
                gradient: dept.color ? dept.color : '#6B7280'
            };
        });

    return (
        <section className="py-8 sm:py-12 lg:py-16 bg-white">
            <div className="container mx-auto px-0 w-[90%] max-w-[1600px]">
                <div className="flex flex-col sm:flex-row items-center justify-between
                                mb-8 sm:mb-10 lg:mb-12 gap-4">
                    {content?.title && (
                        <h2 className="flex text-center mx-auto font-integral_cf font-extrabold text-black
                                       text-2xl sm:text-3xl lg:text-4xl">
                            {content.title}
                        </h2>
                    )}
                    {content?.browse_button && (
                        <button className="border border-gray-300 hover:border-gray-400 transition-colors px-4
                                           sm:px-6 py-2 rounded-full text-sm sm:text-base w-full sm:w-auto">
                            {content.browse_button}
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={route('product.byDepartment', category.slug)}
                            className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl
                                       transition-all duration-300 cursor-pointer block">
                            <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-cover object-center group-hover:scale-110
                                               transition-transform duration-300"
                                    loading="lazy"/>
                                <div
                                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent
                                               to-transparent opacity-70 group-hover:opacity-80 transition-opacity"
                                    style={{
                                        background: `linear-gradient(to top, ${category.gradient}CC, ${category.gradient}66, transparent)`
                                    }}
                                ></div>
                            </div>

                            <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 text-white">
                                <div className="mb-2">
                                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-1">{category.name}</h3>
                                    <p className="text-xs sm:text-sm opacity-90 mb-2 line-clamp-2">{category.description}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs sm:text-sm font-medium">
                                            {category.productCount.toLocaleString()} Products
                                        </span>
                                        <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>

                            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white bg-opacity-20 backdrop-blur-sm
                                            rounded-full px-2 sm:px-3 py-1">
                                <span className="text-white text-xs sm:text-sm font-medium">
                                    {category.productCount > 1000 ? `${Math.floor(category.productCount / 1000)}k+` : category.productCount}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="text-center mt-8 sm:mt-10 lg:mt-12">
                    {content?.bottom_text && (
                        <p className="text-gray-600 mb-4 text-sm sm:text-base px-4">
                            {content.bottom_text}
                        </p>
                    )}
                    {content?.explore_button && (
                        <button className="bg-black text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg hover:bg-gray-800
                                           transition-colors text-sm sm:text-base w-full sm:w-auto">
                            {content.explore_button}
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
};

export default FeaturedCategories;
