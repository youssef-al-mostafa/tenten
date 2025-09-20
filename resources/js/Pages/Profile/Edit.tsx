import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import VendorDetails from './Partials/VendorDetails';
import { User, Settings, Shield, Store } from 'lucide-react';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;

    return (
        <AuthenticatedLayout>
            <Head title="Profile" />

            <div className="py-16 bg-gray-50 min-h-screen max-w-full">
                <div className="container mx-auto px-8 w-[90%]">
                    <div className="mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">My Profile</h1>
                        <p className="text-lg text-gray-600">
                            Manage your account settings and vendor information
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                                <div className="text-center mb-6">
                                    <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                        <User className="h-12 w-12 text-gray-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
                                    <p className="text-gray-600">{user.email}</p>
                                    {user.vendor && (
                                        <div className="mt-2">
                                            <span className={`badge ${
                                                user.vendor.status === 'approved' ? 'badge-success' :
                                                user.vendor.status === 'pending' ? 'badge-warning' :
                                                'badge-error'
                                            }`}>
                                                {user.vendor.status_label}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <User className="h-5 w-5" />
                                        <span className="text-sm">Customer Account</span>
                                    </div>
                                    {user.vendor && (
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <Store className="h-5 w-5" />
                                            <span className="text-sm">Vendor Account</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Shield className="h-5 w-5" />
                                        <span className="text-sm">
                                            {user.email_verified_at ? 'Email Verified' : 'Email Unverified'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-3">
                            <div className="space-y-8">
                                <div className="bg-white rounded-lg shadow-md p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <User className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                                    </div>
                                    <UpdateProfileInformationForm
                                        mustVerifyEmail={mustVerifyEmail}
                                        status={status}
                                        className=""
                                    />
                                </div>

                                <div className="bg-white rounded-lg shadow-md p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                            <Shield className="h-5 w-5 text-green-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
                                    </div>
                                    <UpdatePasswordForm className="" />
                                </div>

                                <div className="bg-white rounded-lg shadow-md p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                            <Store className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">Vendor Details</h2>
                                    </div>
                                    <VendorDetails />
                                </div>

                                <div className="bg-white rounded-lg shadow-md p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                            <Settings className="h-5 w-5 text-red-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">Account Management</h2>
                                    </div>
                                    <DeleteUserForm className="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
