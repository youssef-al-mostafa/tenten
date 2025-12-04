import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';

export default function Help({
    pageContent
}: PageProps<{
    pageContent?: any;
}>) {
    const getIconColorClass = (color: string) => {
        const colorMap: Record<string, string> = {
            blue: 'bg-blue-100 text-blue-600',
            green: 'bg-green-100 text-green-600',
            purple: 'bg-purple-100 text-purple-600',
            yellow: 'bg-yellow-100 text-yellow-600'
        };
        return colorMap[color] || 'bg-blue-100 text-blue-600';
    };

    const heroData = pageContent?.fields?.hero_section;
    const vendorData = pageContent?.fields?.vendor_verification;
    const commissionData = pageContent?.fields?.commission_structure;
    const approvalData = pageContent?.fields?.product_approval;
    const ctaData = pageContent?.fields?.cta_section;

    return (
        <AppLayout>
            <Head title="Help & Support" />

            {heroData && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
                    <div className="container mx-auto px-6 text-center">
                        <h1 className="text-5xl font-bold text-gray-900 mb-6">
                            {heroData.title?.default}
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            {heroData.subtitle?.default}
                        </p>
                    </div>
                </div>
            )}

            {vendorData && (
                <div className="py-16 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">{vendorData.title?.default}</h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">{vendorData.description?.default}</p>
                        </div>

                        {vendorData.steps?.default && (
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                                {vendorData.steps.default.map((step: any) => (
                                    <div key={step.step_number} className="text-center">
                                        <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${getIconColorClass(step.icon_color)}`}>
                                            <span className="text-2xl font-bold">{step.step_number}</span>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                                        <p className="text-gray-600">{step.description}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-12">
                            {vendorData.documents?.default && (
                                <div className="bg-gray-50 p-8 rounded-xl">
                                    <h3 className="text-2xl font-semibold text-gray-900 mb-6">{vendorData.requirements_title?.default}</h3>
                                    <ul className="space-y-3">
                                        {vendorData.documents.default.map((doc: any, index: number) => (
                                            <li key={index} className="flex items-center">
                                                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-gray-700">{doc.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="space-y-6">
                                {vendorData.processing_time?.default && (
                                    <div className="bg-blue-50 p-6 rounded-xl">
                                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Processing Time</h4>
                                        <p className="text-blue-600 font-medium">{vendorData.processing_time.default}</p>
                                    </div>
                                )}
                                {vendorData.approval_rate?.default && (
                                    <div className="bg-green-50 p-6 rounded-xl">
                                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Approval Rate</h4>
                                        <p className="text-green-600 font-medium">{vendorData.approval_rate.default}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {commissionData && (
                <div className="py-16 bg-gray-50">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">{commissionData.title?.default}</h2>
                        </div>

                        {commissionData.fees?.default && (
                            <div className="grid md:grid-cols-3 gap-8 mb-12">
                                {commissionData.fees.default.map((fee: any, index: number) => (
                                    <div key={index} className="bg-white p-8 rounded-xl shadow-sm">
                                        <div className={`w-12 h-12 mb-4 rounded-lg flex items-center justify-center ${getIconColorClass(fee.icon_color)}`}>
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{fee.name}</h3>
                                        <div className="text-3xl font-bold text-gray-900 mb-3">{fee.percentage}</div>
                                        <p className="text-gray-600">{fee.description}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {commissionData.payout_info?.default && (
                            <div className="bg-blue-50 p-8 rounded-xl text-center">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Payout Information</h3>
                                <p className="text-gray-700">{commissionData.payout_info.default}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {approvalData && (
                <div className="py-16 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">{approvalData.title?.default}</h2>
                        </div>

                        {approvalData.approval_process_steps?.default && (
                            <div className="mb-16">
                                <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">{approvalData.approval_process_title?.default}</h3>
                                <div className="grid md:grid-cols-3 gap-8">
                                    {approvalData.approval_process_steps.default.map((step: any) => (
                                        <div key={step.step_number} className="text-center">
                                            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                                <span className="text-2xl font-bold">{step.step_number}</span>
                                            </div>
                                            <h4 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h4>
                                            <p className="text-gray-600">{step.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-12">
                            {approvalData.approved_items?.default && (
                                <div className="bg-green-50 p-8 rounded-xl">
                                    <h3 className="text-2xl font-semibold text-gray-900 mb-6">{approvalData.quality_standards_title?.default}</h3>
                                    <h4 className="text-lg font-medium text-gray-800 mb-4">✅ Approved Items</h4>
                                    <ul className="space-y-3">
                                        {approvalData.approved_items.default.map((item: any, index: number) => (
                                            <li key={index} className="flex items-center">
                                                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-gray-700">{item.item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {approvalData.prohibited_items?.default && (
                                <div className="bg-red-50 p-8 rounded-xl">
                                    <h4 className="text-lg font-medium text-gray-800 mb-4">❌ Prohibited Items</h4>
                                    <ul className="space-y-3">
                                        {approvalData.prohibited_items.default.map((item: any, index: number) => (
                                            <li key={index} className="flex items-center">
                                                <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-gray-700">{item.item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {approvalData.quality_approval_rate?.default && (
                            <div className="mt-8 text-center">
                                <div className="bg-blue-50 p-6 rounded-xl inline-block">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Success Rate</h4>
                                    <p className="text-blue-600 font-medium text-xl">{approvalData.quality_approval_rate.default}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {ctaData && (
                <div className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-4xl font-bold text-white mb-6">{ctaData.title?.default}</h2>
                        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">{ctaData.description?.default}</p>
                        {ctaData.button_text?.default && ctaData.button_link?.default && (
                            <Link
                                href={ctaData.button_link.default}
                                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transition-colors duration-200"
                            >
                                {ctaData.button_text.default}
                                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
