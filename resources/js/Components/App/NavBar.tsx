import { Link, useForm, usePage } from '@inertiajs/react'
import { ChangeEvent, FormEventHandler, useState, useEffect } from 'react'
import MiniCartDropDown from './MiniCartDropDown';
import { PageProps } from '@/types';

function NavBar() {
    const { auth, departments, totalQuantity, keyword } = usePage<PageProps>().props;
    const { user } = auth;
    const searchForm = useForm<{ keyword: string }>({ keyword: keyword || '' });
    const { url } = usePage();
    const currentRoute = route().current();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const onSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        searchForm.get(url, {
            preserveScroll: true,
            preserveState: true
        });
    };

    const NavLinks = [
        {
            Name: 'Shop4',
            Route: 'products.index'
        },
        {
            Name: 'New Arrivals',
            Route: 'products.new'
        },
        {
            Name: 'Help',
            Route: 'help'
        }
    ];

    return (
        <>
            <div className="flex gap-2 sm:gap-3 md:gap-6 bg-base-200 items-center w-full py-2 sm:py-3 md:py-5 px-3 sm:px-4 md:px-14 justify-between">
                <div className="flex text-black">
                    <Link className="logo bg-transparent hover:bg-transparent border-0 font-integral_cf font-extrabold text-[20px] sm:text-[24px] md:text-[32px] lg:text-[40px]"
                        href={route('home')}>
                        Tenten
                    </Link>
                </div>
                <div className="menu-nav hidden lg:flex w-[fit-content] min-w-max gap-6 xl:gap-9 flex-row
                               items-center p-0 font-satoshi font-medium text-[16px] xl:text-[18px] 2xl:text-[21px] my-auto">
                    {NavLinks && NavLinks.map((Item) => (
                        <Link key={Item.Name}
                            className='bg-transparent hover:bg-transparent border-0 mt-[0.4rem] transition-colors hover:text-gray-600'
                            href={route(Item.Route)}>
                            {Item.Name}
                        </Link>
                    ))}
                </div>
                {/* <div className="search-bar min-w-[200px] my-auto w-webkit">
                    <form onSubmit={onSubmit} className="relative flex items-center w-full mt-[0.4rem]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="absolute w-5 h-5 top-2.5 left-2.5 text-slate-600 z-10">
                            <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
                        </svg>

                        <input
                            value={searchForm.data.keyword}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => searchForm.setData('keyword', e.target.value)}
                            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700
                                       text-sm border-[2px] border-slate-800 pl-10 pr-12 py-2 rounded-[50px]
                                       transition duration-300 ease
                                       shadow-sm focus:shadow"
                            placeholder="Search"
                        />

                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-slate-100
                                       rounded-full transition-colors duration-200 flex gap-4 align-middle justify-center"
                            aria-label="Search"
                        >
                        </button>
                    </form>
                </div> */}
                <div className="flex justify-end items-center gap-1 sm:gap-2 md:gap-4 my-auto min-w-max">
                    <button
                        className="btn btn-ghost btn-circle lg:hidden p-1 sm:p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle p-1 sm:p-2">
                            <div className="indicator">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.375 20.25C9.375 20.6208 9.26503 20.9834 9.059 21.2917C8.85298 21.6 8.56014 21.8404 8.21753 21.9823C7.87492 22.1242 7.49792 22.1613 7.1342 22.089C6.77049 22.0166 6.4364 21.838 6.17417 21.5758C5.91195 21.3136 5.73337 20.9795 5.66103 20.6158C5.58868 20.2521 5.62581 19.8751 5.76773 19.5325C5.90964 19.1899 6.14996 18.897 6.45831 18.691C6.76665 18.485 7.12916 18.375 7.5 18.375C7.99728 18.375 8.47419 18.5725 8.82582 18.9242C9.17745 19.2758 9.375 19.7527 9.375 20.25ZM17.25 18.375C16.8792 18.375 16.5166 18.485 16.2083 18.691C15.9 18.897 15.6596 19.1899 15.5177 19.5325C15.3758 19.8751 15.3387 20.2521 15.411 20.6158C15.4834 20.9795 15.662 21.3136 15.9242 21.5758C16.1864 21.838 16.5205 22.0166 16.8842 22.089C17.2479 22.1613 17.6249 22.1242 17.9675 21.9823C18.3101 21.8404 18.603 21.6 18.809 21.2917C19.015 20.9834 19.125 20.6208 19.125 20.25C19.125 19.7527 18.9275 19.2758 18.5758 18.9242C18.2242 18.5725 17.7473 18.375 17.25 18.375ZM22.0753 7.08094L19.5169 15.3966C19.3535 15.9343 19.0211 16.4051 18.569 16.739C18.1169 17.0729 17.5692 17.2521 17.0072 17.25H7.77469C7.2046 17.2482 6.65046 17.0616 6.1953 16.7183C5.74015 16.3751 5.40848 15.8936 5.25 15.3459L2.04469 4.125H1.125C0.826631 4.125 0.540483 4.00647 0.329505 3.7955C0.118526 3.58452 0 3.29837 0 3C0 2.70163 0.118526 2.41548 0.329505 2.2045C0.540483 1.99353 0.826631 1.875 1.125 1.875H2.32687C2.73407 1.87626 3.12988 2.00951 3.45493 2.25478C3.77998 2.50004 4.01674 2.84409 4.12969 3.23531L4.81312 5.625H21C21.1761 5.62499 21.3497 5.6663 21.5069 5.74561C21.664 5.82492 21.8004 5.94001 21.905 6.08164C22.0096 6.22326 22.0795 6.38746 22.1091 6.56102C22.1387 6.73458 22.1271 6.91266 22.0753 7.08094ZM19.4766 7.875H5.45531L7.41375 14.7281C7.43617 14.8065 7.48354 14.8755 7.54867 14.9245C7.6138 14.9736 7.69315 15.0001 7.77469 15H17.0072C17.0875 15.0002 17.1656 14.9746 17.2303 14.927C17.2949 14.8794 17.3426 14.8123 17.3662 14.7356L19.4766 7.875Z" fill="black" />
                                </svg>
                                <span className="badge badge-sm indicator-item text-xs">{totalQuantity}</span>
                            </div>
                        </div>
                        <MiniCartDropDown />
                    </div>

                    {user && (
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full">
                                    <img
                                        alt="User avatar"
                                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                                </div>
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                                <li>
                                    <Link href={route('profile.edit')} className="justify-between">
                                        Profile
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route('logout')}
                                        method='post'
                                        as='button'>
                                        Logout
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    )}

                    {!user && (
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Link
                                href={route('login')}
                                className="btn btn-ghost font-satoshi font-medium text-[14px] sm:text-[16px] text-gray-700 hover:text-gray-900 hover:bg-gray-100/50 border-0 px-2 sm:px-4 py-2 h-auto min-h-[2rem] sm:min-h-[2.5rem] rounded-lg transition-all duration-200"
                            >
                                Login
                            </Link>
                            <Link
                                href={route('register')}
                                className="btn btn-primary font-satoshi font-medium text-[14px] sm:text-[16px] text-white bg-black hover:bg-gray-800 border-black hover:border-gray-800 px-3 sm:px-6 py-2 h-auto min-h-[2rem] sm:min-h-[2.5rem] rounded-lg transition-all duration-200"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <div className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                <div
                    className={`absolute inset-0 bg-black transition-opacity duration-300 ease-in-out ${isMobileMenuOpen ? 'bg-opacity-50' : 'bg-opacity-0'}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
                <div className={`absolute top-0 right-0 h-full w-4/5 sm:w-3/5 md:w-1/2 bg-base-100 shadow-xl transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="flex items-center justify-between p-3 sm:p-4 border-b">
                        <Link className="font-integral_cf font-extrabold text-xl sm:text-2xl text-black" href={route('home')}>
                            Tenten
                        </Link>
                        <button
                            className="btn btn-ghost btn-circle p-2"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex flex-col p-4 space-y-4">
                        {NavLinks && NavLinks.map((Item) => (
                            <Link
                                key={Item.Name}
                                className="text-lg font-satoshi font-medium text-gray-700 hover:text-gray-900 py-2 border-b border-gray-100"
                                href={route(Item.Route)}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {Item.Name}
                            </Link>
                        ))}

                        {currentRoute === 'home' && departments && Array.isArray(departments) && (
                            <div className="pt-4">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Departments</h3>
                                {departments.map((department) => (
                                    <Link
                                        key={department.id}
                                        href={route('product.byDepartment', department.slug)}
                                        className="block text-base font-medium text-gray-600 hover:text-gray-800 py-2 border-b border-gray-100"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {department.name}
                                    </Link>
                                ))}
                            </div>
                        )}

                        {!user && (
                            <div className="pt-6 space-y-3 border-t">
                                <Link
                                    href={route('login')}
                                    className="block w-full text-center btn btn-ghost font-satoshi font-medium text-gray-700 hover:text-gray-900 py-3"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="block w-full text-center btn btn-primary font-satoshi font-medium text-white bg-black hover:bg-gray-800 py-3"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}

                        {user && (
                            <div className="pt-6 space-y-3 border-t">
                                <Link
                                    href={route('profile.edit')}
                                    className="block text-lg font-satoshi font-medium text-gray-700 hover:text-gray-900 py-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Profile
                                </Link>
                                <Link
                                    href={route('logout')}
                                    method='post'
                                    as='button'
                                    className="block w-full text-left text-lg font-satoshi font-medium text-red-600 hover:text-red-800 py-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Logout
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {currentRoute === 'home' && (
                <div className="navbar bg-base-200 border-t min-h-4 justify-center">
                    <div className="navbar-center hidden lg:flex">
                        <ul className="menu menu-horizontal px-1 z-20 py-0">
                            {departments && Array.isArray(departments) && departments.map((department) => (
                                <li key={department.id}>
                                    <Link href={route('product.byDepartment', department.slug)}
                                        className="font-medium text-sm text-gray-600 hover:text-gray-800">
                                        {department.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </>
    )
}

export default NavBar
