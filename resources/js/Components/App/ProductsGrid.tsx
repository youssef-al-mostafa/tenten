import { Product, PaginationProps } from '@/types';
import { ProductItem } from '@/Components/App/ProductItem';
import { goToProductsPage } from '@/helpers';

interface ProductsGridProps {
    header?: string;
    products?: PaginationProps<Product>;
    content?: SectionContent;
    emptyMessage?: string;
    className?: string;
    showHeader?: boolean;
    gridCols?: {
        sm?: string;
        md?: string;
        lg?: string;
        xl?: string;
    };
}

const EmptyState = ({ message }: { message: string }) => (
    <div className="col-span-full text-center py-12 sm:py-16 lg:py-20">
        <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 sm:mb-6 bg-transparent rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 sm:w-12 sm:h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
        <h3 className="font-integral_cf font-bold text-black text-xl sm:text-2xl mb-2">
            {message}
        </h3>
        <p className="font-satoshi font-normal text-sm sm:text-base text-black opacity-60 max-w-md mx-auto px-4">
            We're constantly adding new products. Check back soon for amazing deals and the latest styles!
        </p>
    </div>
);

const ProductsGrid = ({
    products,
    header,
    content,
    emptyMessage = "No products found",
    className = "",
    showHeader = true,
    gridCols = {
        sm: "grid-cols-1",
        md: "sm:grid-cols-2",
        lg: "md:grid-cols-3",
        xl: "lg:grid-cols-4"
    }
}: ProductsGridProps) => {
    const actualTitle = typeof content?.title === 'string' ? content.title : header;
    const hasProducts = products?.data && products.data.length > 0;

    const gridClasses = [
        gridCols.sm || "grid-cols-1",
        gridCols.md || "md:grid-cols-2",
        gridCols.lg || "lg:grid-cols-3",
        gridCols.xl && gridCols.xl
    ].filter(Boolean).join(" ");

    return (
        <section className={`w-[90%] max-w-[1600px] mx-auto py-8 sm:py-12 lg:py-16 ${className}`}>
            {showHeader && (
                <div className="mb-8 sm:mb-10 lg:mb-12 text-center">
                    <h2 className="font-integral_cf font-extrabold text-black text-2xl sm:text-3xl lg:text-4xl mb-4">
                        {actualTitle}
                    </h2>
                </div>
            )}

            <div className={`grid ${gridClasses} gap-4 sm:gap-6 lg:gap-8`}>
                {!hasProducts ? (
                    <EmptyState message={emptyMessage} />
                ) : (
                    products.data.map(product => (
                        <ProductItem product={product} key={product.id} />
                    ))
                )}
            </div>

            {hasProducts && (
                <div className="text-center mt-8 sm:mt-10 lg:mt-12">
                    <button
                        className="btn bg-white text-black border-2 border-black rounded-full
                                   px-6 sm:px-8 py-2 sm:py-3 font-satoshi font-medium text-sm
                                   sm:text-base hover:bg-black hover:text-white transition-all
                                   duration-300 w-full sm:w-auto min-w-[200px]"
                        onClick={goToProductsPage}>
                        View All Products
                    </button>
                </div>
            )}
        </section>
    );
};

export default ProductsGrid;
