import AuthLayout from '@/Layouts/AuthLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Mail, CheckCircle, Home } from 'lucide-react';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <AuthLayout>
            <Head title="Email Verification" />

            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Mail className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-base-content mb-2">
                    Verify Your Email
                </h2>
                <p className="text-base-content/70 text-sm max-w-md mx-auto">
                    Thanks for signing up! Before getting started, please verify your email address
                    by clicking on the link we just emailed to you. If you didn't receive the email,
                    we'll gladly send you another.
                </p>
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-6 alert alert-success">
                    <CheckCircle className="h-6 w-6" />
                    <span>A new verification link has been sent to your email address.</span>
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <button
                    type="submit"
                    className="w-full bg-base-content text-base-100 hover:bg-base-content/90 font-semibold
                              py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02]
                              shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed
                              disabled:transform-none flex items-center justify-center gap-2"
                    disabled={processing}
                >
                    {processing ? (
                        <>
                            <span className="loading loading-spinner loading-sm"></span>
                            Sending...
                        </>
                    ) : (
                        <>
                            <Mail className="w-5 h-5" />
                            Resend Verification Email
                        </>
                    )}
                </button>

                <div className="flex gap-3">
                    <Link
                        href={route('home')}
                        className="flex-1 text-center text-sm text-base-content/70 hover:text-base-content
                                  border border-base-300 hover:border-base-content/30 rounded-lg
                                  transition-all py-3 flex items-center justify-center gap-2"
                    >
                        <Home className="w-4 h-4" />
                        Back to Home
                    </Link>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="flex-1 text-center text-sm text-base-content/70 hover:text-base-content
                                   transition-colors py-3"
                    >
                        Log Out
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
