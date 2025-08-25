import React from 'react'
import { Product, PaginationProps } from '@/types';
import { ProductItem } from '@/Components/App/ProductItem';

interface SectionContent {
  is_active?: boolean;
  sort_order?: number;
  [key: string]: unknown;
}

interface ProductsGridProps {
    products?: PaginationProps<Product>;
    content?: SectionContent;
    emptyMessage?: string;
    className?: string;
    sectionTitle?: string;
    showHeader?: boolean;
    gridCols?: {
        sm?: string;
        md?: string;
        lg?: string;
        xl?: string;
    };
}

const ProductsGrid = ({
    products,
    content,
    emptyMessage = "No products found",
    className = "",
    sectionTitle = "NEW ARRIVALS",
    showHeader = true,
    gridCols = {
        sm: "grid-cols-1",
        md: "md:grid-cols-2",
        lg: "lg:grid-cols-3",
        xl: "xl:grid-cols-4"
    }
}: ProductsGridProps) => {

    if (!products || !products.data) {
        return (
            <section className={`w-[90%] mx-auto py-16 ${className}`}>
                {showHeader && (
                    <div className="mb-12 text-center">
                        <h2 className="font-integral_cf font-extrabold text-black text-4xl mb-4">
                            {sectionTitle}
                        </h2>
                    </div>
                )}
                <div className="col-span-full">
                    <div className="text-center py-20">
                        <div className="w-32 h-32 mx-auto mb-6 bg-transparent rounded-full flex items-center justify-center">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h3 className="font-integral_cf font-bold text-black text-2xl mb-2">
                            {emptyMessage}
                        </h3>
                        <p className="font-satoshi font-normal text-base text-black opacity-60 max-w-md mx-auto">
                            We're constantly adding new products. Check back soon for amazing deals and the latest styles!
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    const gridClasses = [
        gridCols.sm || "grid-cols-1",
        gridCols.md || "md:grid-cols-2",
        gridCols.lg || "lg:grid-cols-3",
        gridCols.xl && gridCols.xl
    ].filter(Boolean).join(" ");

    return (
        <section className={`w-[90%] mx-auto py-16 ${className}`}>
            {showHeader && (
                <div className="mb-12 text-center">
                    <h2 className="font-integral_cf font-extrabold text-black text-4xl mb-4">
                        {sectionTitle}
                    </h2>
                </div>
            )}

            <div className={`grid ${gridClasses} gap-8`}>
                {products.data.length === 0 && (
                    <div className="col-span-full">
                        <div className="text-center py-20">
                            <div className="w-32 h-32 mx-auto mb-6 bg-transparent rounded-full flex items-center justify-center">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <h3 className="font-integral_cf font-bold text-black text-2xl mb-2">
                                {emptyMessage}
                            </h3>
                            <p className="font-satoshi font-normal text-base text-black opacity-60 max-w-md mx-auto">
                                We're constantly adding new products. Check back soon for amazing deals and the latest styles!
                            </p>
                        </div>
                    </div>
                )}

                {products.data.map(product => (
                    <ProductItem product={product} key={product.id} />
                ))}
            </div>

            {products.data.length > 0 && (
                <div className="text-center mt-12">
                    <button className="btn bg-white text-black border-2 border-black rounded-full px-8 py-3 font-satoshi font-medium text-base hover:bg-black hover:text-white transition-all duration-300 min-w-[200px]">
                        View All Products
                    </button>
                </div>
            )}
        </section>
    )
}

export default ProductsGrid
