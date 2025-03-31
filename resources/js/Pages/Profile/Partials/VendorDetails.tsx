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

            <header>
                <h2 className="flex justify-between mb-8 text-lg font-medium text-gray-900">
                    Vendor Details
                    {user.vendor?.status === 'pending' &&
                        <span className={'badge badge-warning'}>{user.vendor.status_label}</span>}
                    {user.vendor?.status === 'rejected' &&
                        <span className={'badge badge-error'}>{user.vendor.status_label}</span>}
                    {user.vendor?.status === 'approved' &&
                        <span className={'badge badge-success'}>{user.vendor.status_label}</span>}
                </h2>
            </header>

            <div>
                {!user.vendor &&
                    <button
                        disabled={processing}
                        onClick={() => setShowBecomeVendorConfimation(true)}
                        className="btn btn-primary w-full">
                        Become a vendor
                    </button>}

                {user.vendor && (
                    <>
                        <form onSubmit={updateVendor}>
                            <div className="mb-4">
                                <InputLabel htmlFor='name' value='store name' />
                                <TextInput id='name'
                                    className="mt-1 block w-full"
                                    value={data.store_name}
                                    onChange={onStoreNameChange}
                                    required
                                    isFocused
                                    autoComplete="name"
                                />
                                <InputError message={errors.store_name} className="mt-2" />
                            </div>
                            <div className="mb-4">
                                <InputLabel htmlFor='address' value='store address' />
                                <textarea id='address'
                                    className="textarea textarea-bordered w-full mt-1"
                                    value={data.store_address}
                                    onChange={(e) => setData('store_address', e.target.value)}
                                    placeholder="Your store address"></textarea>
                                <InputError message={errors.store_address} className="mt-2" />
                            </div>
                            <div className="flex items-center gap-4">
                                <PrimaryButton type='submit' disabled={processing} className="btn btn-primary">
                                    Update
                                </PrimaryButton>
                            </div>
                        </form>
                        <form action={route('stripe.connect')}
                            method={'post'}
                            className={'my-8'}>
                            <input type="hidden" name="_token" value={token} />
                            {user.strip_account_active && (
                                <div className={'text-center text-gray-600 my-4 text-sm'}>
                                    You are successfully connected to Stripe
                                </div>
                            )}
                            <button className="btn btn-primary w-full"
                                disabled={user.strip_account_active}>
                                Connect to Stripe
                            </button>
                        </form>
                    </>
                )}
            </div>

            <Modal show={showBecomeVendorConfimation} onClose={closeModal}>
                <form action="" onSubmit={becomeVendor} className="p-8">
                    <h2 className="text-lg font-medium text-gray-900 ">
                        Are you sure you want to become a Vendor?
                    </h2>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton className="ms-3" disabled={processing}>
                            Confirm
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </section>
    )
}

export default VendorDetails

/*8*/
