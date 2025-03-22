import ApplicationLogo from '@/Components/App/ApplicationLogo';
import NavBar from '@/Components/App/NavBar';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <>
            <NavBar />
            <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-1 sm:justify-center sm:pt-0  bg-gray-900">
                {/* <div>
                <Link href="/">
                    <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
                </Link>
            </div> */}

                <div className=" w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg  bg-gray-800">
                    {children}
                </div>
            </div>
        </>
    );
}
