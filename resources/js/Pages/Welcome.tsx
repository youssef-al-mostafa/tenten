import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import Head from '@/Components/Core/Head';
import GuestLayout from '@/Layouts/GuestLayout';
import NavBar from '@/Components/App/NavBar';

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    const Layout = auth.user ? AuthenticatedLayout : GuestLayout;
    return (
        <>
            <NavBar />
            {/* <Head>Youss</Head> */}
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                <main>
                    <div className="hero bg-gray-800 h-[300px]">
                        <div className="hero-content text-center">
                            <div className="max-w-md">
                                <h1 className="text-5xl font-bold">Hello there</h1>
                                <p className="py-6">
                                    Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
                                    quasi. In deleniti eaque aut repudiandae et a id nisi.
                                </p>
                                <button className="btn btn-primary">Get Started</button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

        </>
    );
}
