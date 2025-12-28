import { MapPin } from 'lucide-react';
import { goToVendorProfile, formatStoreName } from '@/helpers';

interface Product {
    id: number;
    image: string;
    title: string;
    price: number;
}

interface VendorCardProps {
    vendor: {
        id?: number;
        user_id?: number;
        name?: string;
        storeName?: string;
        store_name?: string;
        avatar?: string | null;
        cover_image?: string | null;
        description?: string | null;
        store_description?: string | null;
        location?: string | null;
        store_address?: string | null;
        topProducts?: Product[];
        user?: {
            id: number;
            name: string;
        };
    };
    maxProducts?: number;
}

const VendorCard = ({ vendor, maxProducts = 3 }: VendorCardProps) => {
    const storeName = vendor.storeName || vendor.store_name || '';
    const ownerName = vendor.name || vendor.user?.name || '';
    const avatar = vendor.avatar || (vendor.cover_image ? `/storage/${vendor.cover_image}` : null);
    const description = vendor.description || vendor.store_description;
    const location = vendor.location || vendor.store_address;
    const products = vendor.topProducts?.slice(0, maxProducts) || [];

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
            <div className="p-6 flex flex-col justify-between h-full">
                <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        {avatar ? (
                            <img
                                src={avatar}
                                alt={storeName}
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            <span className="text-xl font-bold text-gray-600">
                                {storeName.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg text-gray-900">
                                {formatStoreName(storeName)}
                            </h3>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">
                            {ownerName}
                        </p>
                    </div>
                </div>
                <div>
                    {description && (
                        <p className="text-gray-600 mb-4 line-clamp-2">
                            {description}
                        </p>
                    )}
                    {location && (
                        <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                            <MapPin className="h-4 w-4" />
                            <span>{location}</span>
                        </div>
                    )}
                    {products.length > 0 && (
                        <div className="mb-4">
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">
                                Top Products
                            </h4>
                            <div className="flex gap-2 flex-wrap">
                                {products.map((product) => (
                                    <div key={product.id} className={maxProducts <= 3 ? "w-[48px]" : "w-[60px]"}>
                                        <img
                                            src={product.image}
                                            alt={product.title}
                                            className="w-full h-16 object-cover rounded-md mb-1"
                                        />
                                        <p className="text-xs text-gray-600 truncate">
                                            {product.title}
                                        </p>
                                        <p className="text-xs font-semibold">
                                            ${parseFloat(product.price.toString()).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => goToVendorProfile(storeName)}
                        className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Visit Store
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VendorCard;
