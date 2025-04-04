import { PageProps } from '@/types';
import NavBar from '@/Components/App/NavBar';
import Footer from '@/Components/App/Footer';
import { usePage } from '@inertiajs/react';
import { ReactNode } from 'react';

export default function AppLayout({ children }: { children: ReactNode }) {
    const { auth } = usePage<PageProps>().props;

    return (
        <div className="min-h-screen flex flex-col">
            <NavBar/>
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}
