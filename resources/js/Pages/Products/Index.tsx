import { Department, PageProps, PaginationProps, Product } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { ProductItem } from '@/Components/App/ProductItem';
import { useState, useEffect, useDeferredValue } from 'react';

interface ProductsIndexProps {
    products: PaginationProps<Product>;
    departments: { data: Department[] };
    filters: {
        keyword?: string;
        department?: string;
        sort?: string;
    };
}

const ProductsIndex = ({ products, departments = { data: [] }, filters }: ProductsIndexProps) => {
    const { props } = usePage();
    const appName = props.appName || 'TenTen';

    const [searchTerm, setSearchTerm] = useState(filters.keyword || '');
    const [selectedDepartment, setSelectedDepartment] = useState(filters.department || '');
    const [sortBy, setSortBy] = useState(filters.sort || 'newest');

    const deferredSearchTerm = useDeferredValue(searchTerm);

    useEffect(() => {
        const params: any = {
            sort: sortBy,
            department: selectedDepartment,
        };

        if (deferredSearchTerm) {
            params.keyword = deferredSearchTerm;
        }

        router.get(route('products.index'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    }, [deferredSearchTerm]);

    const handleFilterChange = (type: 'department' | 'sort', value: string) => {
        const params: any = {
            keyword: searchTerm,
        };

        if (type === 'department') {
            setSelectedDepartment(value);
            params.department = value;
            params.sort = sortBy;
        } else {
            setSortBy(value);
            params.department = selectedDepartment;
            params.sort = value;
        }

        router.get(route('products.index'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedDepartment('');
        setSortBy('newest');
        router.get(route('products.index'), {}, {
            preserveState: true,
        });
    };

    const sortOptions = [
        { value: 'newest', label: 'Newest First' },
        { value: 'name', label: 'Name A-Z' },
        { value: 'price_low', label: 'Price: Low to High' },
        { value: 'price_high', label: 'Price: High to Low' },
    ];

    return (
        <AppLayout>
            <Head title='All Products'>
                <meta name="description" content="Discover all our amazing products from various vendors. Find exactly what you're looking for with our filtering and search options." />
            </Head>

            <div className="bg-base-200 border-b border-gray-100 sticky top-0 z-40 shadow-sm">
                <div className="container mx-auto px-6 py-6">
                    <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                        <div className="relative flex-1 max-w-md">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full
                                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                           transition-all duration-200 bg-gray-50 focus:bg-white"
                            />
                        </div>

                        <div className="flex flex-wrap gap-4 items-center">
                            <select
                                value={selectedDepartment}
                                onChange={(e) => handleFilterChange('department', e.target.value)}
                                className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white
                                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                           transition-all duration-200 font-medium pr-8"
                            >
                                <option value="">All Departments</option>
                                {departments?.data && Array.isArray(departments.data) && departments.data.map((dept) => (
                                    <option key={dept.id} value={dept.slug}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={sortBy}
                                onChange={(e) => handleFilterChange('sort', e.target.value)}
                                className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white
                                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                           transition-all duration-200 font-medium pr-8"
                            >
                                {sortOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>

                            {(searchTerm || selectedDepartment || sortBy !== 'newest') && (
                                <button
                                    onClick={clearFilters}
                                    className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl
                                               hover:bg-gray-200 transition-colors duration-200 font-medium
                                               flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-base-200 min-h-screen">
                <div className="container mx-auto px-6 py-12">

                    {products.data.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="max-w-md mx-auto">
                                <svg className="w-24 h-24 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.674-2.64L5 9.5m14 3.5L17.674 10.36A7.962 7.962 0 0012 9z" />
                                </svg>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">No products found</h3>
                                <p className="text-gray-600 mb-6">
                                    We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white
                                               rounded-full font-medium hover:bg-blue-700 transition-colors duration-200"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {products.data.map((product) => (
                                    <ProductItem key={product.id} product={product} />
                                ))}
                            </div>

                            {Array.isArray(products.links) && products.links.length > 3 && (
                                <div className="mt-12 flex justify-center">
                                    <div className="flex items-center space-x-2">
                                        {products.links.map((link, index) => (
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
                                                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${link.active
                                                    ? 'bg-blue-600 text-white'
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

export default ProductsIndex;
