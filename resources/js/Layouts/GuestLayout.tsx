import ApplicationLogo from '@/Components/App/ApplicationLogo';
import NavBar from '@/Components/App/NavBar';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <>
            <NavBar />
            <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-1 sm:justify-center sm:pt-0">
                <div className=" w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                    {children}
                </div>
            </div>
        </>
    );
}
