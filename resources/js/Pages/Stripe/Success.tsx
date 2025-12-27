import { CurrencyFormatter } from '@/Components/Core/CurrencyFormatter';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import type { Order, PageProps } from '@/types';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { Head, Link } from '@inertiajs/react';

const Success = ({ orders }: PageProps<{ orders: Order[] }>) => {
    return (
        <AuthenticatedLayout showNavBar={false}>
            <Head title="Payment was Completed" />
            <div className="w-[480px] mx-auto py-8 px-4">
                <div className="flex flex-col gap-2 items-center">
                    <div className="text-6xl text-emerald-600">
                        <CheckCircleIcon className='size-24' />
                    </div>
                    <div className="text-3xl">
                        Payment was Completed
                    </div>
                </div>
                <div className="my-6 text-lg">
                    Thanks for your purchase.
                    Your payment was completed successfully.
                </div>
                {orders.map(order => (
                    <div key={order.id} className="bg-white rounded-lg p-6 mb-4">
                        <h3 className="text-3xl mb-3">
                            Order Summary
                        </h3>
                        <div className="flex justify-between mb-2 font-bold">
                            <div className="text-gray-600">
                                Seller
                            </div>
                            <div>
                                <Link href='#' className='hover:underline'>
                                    {order.vendorUser.store_name}
                                </Link>
                            </div>
                        </div>
                        <div className="flex justify-between mb-2">
                            <div className="text-gray-600">
                                Order Number
                            </div>
                            <div>
                                <Link href='#' className='hover:underline'>
                                    #{order.id}
                                </Link>
                            </div>
                        </div>
                        <div className="flex justify-between mb-3">
                            <div className="text-gray-600">
                                Items
                            </div>
                            <div>
                                {order.orderItems.length}
                            </div>
                        </div>
                        <div className="flex justify-between mb-3">
                            <div className="text-gray-600">
                                Total
                            </div>
                            <div>
                                <CurrencyFormatter amount={order.total_price} />
                            </div>
                        </div>
                        <div className="flex justify-center mt-4">
                            <Link href={route('home')}
                                  className='btn bg-gray-800 text-white hover:bg-gray-700'>
                                Back to Home
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </AuthenticatedLayout>
    )
}

export default Success;
