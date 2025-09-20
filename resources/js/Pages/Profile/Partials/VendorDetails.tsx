import InputError from '@/Components/Core/InputError';
import InputLabel from '@/Components/Core/InputLabel';
import Modal from '@/Components/Core/Modal';
import PrimaryButton from '@/Components/Core/PrimaryButton';
import SecondaryButton from '@/Components/Core/SecondaryButton';
import TextInput from '@/Components/Core/TextInput';
import { useForm, usePage } from '@inertiajs/react';
import React, { FormEventHandler, useState } from 'react'

interface Props {
    className?: string;
}

function VendorDetails({ className }: Props) {

    const [showBecomeVendorConfimation, setShowBecomeVendorConfimation] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const user = usePage().props.auth.user;
    const token = usePage().props.csrf_token;

    const {
        data, setData, post, errors, processing, recentlySuccessful
    } = useForm({
        store_name: user.vendor?.store_name || user.name.toLowerCase().replace(/\s+/g, '-'),
        store_address: user.vendor?.store_address,
    });

    const onStoreNameChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setData('store_name', ev.target.value.toLowerCase().replace(/\s+/g, '-'));
    }

    const becomeVendor: FormEventHandler = (ev) => {
        ev.preventDefault();
        post(route('vendor.store'), {
            preserveScroll: true,
            onSuccess: () => {
                closeModal()
                setSuccessMessage('You can now create and publish products');
            },
            onError: (error) => {
                console.error(error);
            }
        });
    }

    const updateVendor: FormEventHandler = (ev) => {
        ev.preventDefault();
        post(route('vendor.store'), {
            preserveScroll: true,
            onSuccess: () => {
                closeModal()
                setSuccessMessage('Vendor details updated successfully');
            },
            onError: (error) => {
                console.error(error);
            }
        });
    }

    const closeModal = () => {
        setShowBecomeVendorConfimation(false);
    }

    return (
        <section className={className}>
            {recentlySuccessful &&
                <div className='toast toast-end toast-top'>
                    <div className="alert alert-success">
                        <span>{successMessage}</span>
                    </div>
                </div>
            }

            <div className="mb-6">
                <p className="text-gray-600">
                    {!user.vendor 
                        ? "Join our marketplace as a vendor to start selling your products."
                        : "Manage your vendor store settings and payment information."
                    }
                </p>
            </div>

            <div>
                {!user.vendor ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Start Selling Today</h3>
                        <p className="text-gray-600 mb-6">
                            Become a vendor and reach thousands of customers on our platform
                        </p>
                        <button
                            disabled={processing}
                            onClick={() => setShowBecomeVendorConfimation(true)}
                            className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Processing...' : 'Become a Vendor'}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <form onSubmit={updateVendor} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel 
                                        htmlFor='name' 
                                        value='Store Name'
                                        className="text-gray-700 font-medium mb-2"
                                    />
                                    <TextInput 
                                        id='name'
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                        value={data.store_name}
                                        onChange={onStoreNameChange}
                                        required
                                        isFocused
                                        autoComplete="name"
                                        placeholder="Enter your store name"
                                    />
                                    <InputError message={errors.store_name} className="mt-2" />
                                </div>
                                
                                <div>
                                    <InputLabel 
                                        htmlFor='address' 
                                        value='Store Address'
                                        className="text-gray-700 font-medium mb-2"
                                    />
                                    <textarea 
                                        id='address'
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
                                        rows={3}
                                        value={data.store_address}
                                        onChange={(e) => setData('store_address', e.target.value)}
                                        placeholder="Enter your store address"
                                    />
                                    <InputError message={errors.store_address} className="mt-2" />
                                </div>
                            </div>
                            
                            <div className="flex items-center pt-4">
                                <button
                                    type='submit' 
                                    disabled={processing}
                                    className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Updating...' : 'Update Store Details'}
                                </button>
                            </div>
                        </form>

                        <div className="border-t border-gray-200 pt-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Settings</h3>
                            
                            {user.strip_account_active ? (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <h4 className="text-green-900 font-medium">Stripe Connected</h4>
                                    </div>
                                    <p className="text-green-800 text-sm">
                                        Your Stripe account is successfully connected. You can now receive payments for your sales.
                                    </p>
                                </div>
                            ) : (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                                    <h4 className="text-yellow-900 font-medium mb-2">Connect Your Stripe Account</h4>
                                    <p className="text-yellow-800 text-sm mb-4">
                                        To receive payments for your sales, you need to connect your Stripe account.
                                    </p>
                                    <form action={route('stripe.connect')} method={'post'}>
                                        <input type="hidden" name="_token" value={token} />
                                        <button 
                                            type="submit"
                                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                        >
                                            Connect to Stripe
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <Modal show={showBecomeVendorConfimation} onClose={closeModal}>
                <div className="p-8">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Become a Vendor
                        </h2>
                        <p className="text-gray-600">
                            Are you ready to start selling on our marketplace?
                        </p>
                    </div>
                    
                    <form onSubmit={becomeVendor}>
                        <div className="flex justify-center gap-4">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Processing...' : 'Yes, Become a Vendor'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </section>
    )
}

export default VendorDetails

/*8*/
