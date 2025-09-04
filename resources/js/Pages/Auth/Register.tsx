import InputError from '@/Components/Core/InputError';
import InputLabel from '@/Components/Core/InputLabel';
import PrimaryButton from '@/Components/Core/PrimaryButton';
import TextInput from '@/Components/Core/TextInput';
import AuthLayout from '@/Layouts/AuthLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Create your account" subtitle="Join TenTen and start your journey">
            <Head title="Create Account" />

            <form onSubmit={submit} className="space-y-6">
                <div className="space-y-2">
                    <InputLabel htmlFor="name" value="Full Name" className="text-base-content font-semibold text-sm" />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Enter your full name"
                        required
                    />
                    <InputError message={errors.name} className="mt-1" />
                </div>

                <div className="space-y-2">
                    <InputLabel htmlFor="email" value="Email Address" className="text-base-content font-semibold text-sm" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="Enter your email address"
                        required
                    />
                    <InputError message={errors.email} className="mt-1" />
                </div>

                <div className="space-y-2">
                    <InputLabel htmlFor="password" value="Password" className="text-base-content font-semibold text-sm" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="Create a strong password"
                        required
                    />
                    <InputError message={errors.password} className="mt-1" />
                </div>

                <div className="space-y-2">
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" className="text-base-content font-semibold text-sm" />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        placeholder="Confirm your password"
                        required
                    />
                    <InputError message={errors.password_confirmation} className="mt-1" />
                </div>

                <div className="pt-4">
                    <button 
                        type="submit"
                        className="w-full bg-base-content text-base-100 hover:bg-base-content/90 font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                        disabled={processing}
                    >
                        {processing ? (
                            <>
                                <span className="loading loading-spinner loading-sm"></span>
                                Creating account...
                            </>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </div>

                <div className="text-center pt-2">
                    <p className="text-sm text-base-content/60">
                        Already have an account?{' '}
                        <Link 
                            href={route('login')} 
                            className="font-semibold text-base-content hover:text-base-content/80 underline transition-colors"
                        >
                            Sign in here
                        </Link>
                    </p>
                </div>
            </form>
        </AuthLayout>
    );
}
