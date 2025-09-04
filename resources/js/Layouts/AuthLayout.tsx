import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

interface AuthLayoutProps extends PropsWithChildren {
    title?: string;
    subtitle?: string;
}

export default function AuthLayout({ children, title = "Welcome back", subtitle = "Sign in to continue to your account" }: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-200 to-base-300 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-6">
                <div className="text-center">
                    <Link href="/" className="inline-block mb-6">
                        <div className="text-4xl font-bold text-base-content hover:text-primary transition-colors">
                            TenTen
                        </div>
                    </Link>
                    <h2 className="text-2xl font-bold text-base-content mb-2">
                        {title}
                    </h2>
                    <p className="text-base-content/60">
                        {subtitle}
                    </p>
                </div>
                
                <div className="bg-base-100 shadow-2xl rounded-3xl p-8 border border-base-300">
                    {children}
                </div>

                <div className="text-center">
                    <p className="text-sm text-base-content/60">
                        Don't have an account?{' '}
                        <Link 
                            href={route('register')} 
                            className="font-semibold text-base-content hover:text-base-content/80 underline transition-colors"
                        >
                            Create one here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}