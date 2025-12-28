import { navigateTo } from '@/helpers';
import { TopVendor } from '@/types';
import VendorCard from './VendorCard';

interface TopVendorsProps {
    content?: {
        title?: string;
        view_all_button?: string;
        is_active?: boolean;
        sort_order?: number;
    };
    topVendors?: TopVendor[];
}

export const goToAllVendorsPage = () => {
    navigateTo('vendor.all');
}

const TopVendors = ({ content, topVendors: vendorsData }: TopVendorsProps) => {

    const topVendors = vendorsData && vendorsData.length > 0 ? vendorsData : null;

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-8">
                <div className="flex items-center justify-between mb-12">
                    {content?.title && (
                        <h2 className="text-4xl font-bold text-gray-900">{content.title}</h2>
                    )}
                    {content?.view_all_button && (
                        <button className="border border-gray-300 hover:border-gray-400
                                           transition-colors px-6 py-2 rounded-full"
                            onClick={goToAllVendorsPage}>
                            {content.view_all_button}
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {topVendors?.map((vendor) => (
                        <VendorCard key={vendor.id} vendor={vendor} maxProducts={3} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TopVendors;
