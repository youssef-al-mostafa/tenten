import { Link } from '@inertiajs/react'
import React from 'react'

const Footer = () => {
    return (
        <>
            <div className="footer relative flex flex-col gap-2 bg-base-100 w-full h-fit pt-6 sm:pt-8 lg:pt-10 pb-5 mt-6 sm:mt-9">
                <div className="footer-main flex flex-col lg:flex-row justify-between w-[90%] sm:w-[85%] mx-auto mb-6 gap-8 lg:gap-0 lg:mb-3">
                    <div className="footer-col w-full lg:w-[22%] flex flex-col gap-4 sm:gap-6 lg:gap-7 text-center lg:text-left">
                        <Link className="logo bg-transparent hover:bg-transparent
                        border-0 font-integral_cf font-extrabold text-[24px] sm:text-[28px] lg:text-[33px] text-black" href={'/'}>
                            Tenten
                        </Link>
                        <p className="font-satoshi font-normal text-xs sm:text-sm leading-snug tracking-normal text-black opacity-60 max-w-sm mx-auto lg:mx-0">
                            We have clothes that suits your style
                            and which you're proud to wear.
                            From women to men.
                        </p>
                        <div className="social-media-row flex justify-center lg:justify-start gap-4 sm:gap-5">
                            <a href="#" className="social-media-icon text-black overflow-hidden hover:text-gray-600 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
                                </svg>
                            </a>
                            <a href="#" className="social-media-icon text-black overflow-hidden hover:text-gray-600 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
                                </svg>
                            </a>
                            <a href="#" className="social-media-icon text-black overflow-hidden hover:text-gray-600 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
                                </svg>
                            </a>
                            <a href="#" className="social-media-icon text-black overflow-hidden hover:text-gray-600 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div className="footer-col w-full lg:w-[70%] grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
                        <div className="footer-col-1 flex flex-col gap-3">
                            <h3 className="font-satoshi text-center font-medium text-black text-sm sm:text-base tracking-[2px] sm:tracking-[3px]">
                                COMPANY
                            </h3>
                            <ul className="flex flex-col gap-2">
                                <li>
                                    <Link href="#" className="text-center flex justify-center font-satoshi font-light text-xs sm:text-sm leading-snug tracking-normal text-black opacity-60 hover:opacity-80 transition-opacity">About</Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-center flex justify-center font-satoshi font-light text-xs sm:text-sm leading-snug tracking-normal text-black opacity-60 hover:opacity-80 transition-opacity">Features</Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-center flex justify-center font-satoshi font-light text-xs sm:text-sm leading-snug tracking-normal text-black opacity-60 hover:opacity-80 transition-opacity">Works</Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-center flex justify-center font-satoshi font-light text-xs sm:text-sm leading-snug tracking-normal text-black opacity-60 hover:opacity-80 transition-opacity">Career</Link>
                                </li>
                            </ul>
                        </div>
                        <div className="footer-col-2 flex flex-col gap-3">
                            <h3 className="font-satoshi text-center font-medium text-black
                            text-sm sm:text-base tracking-[2px] sm:tracking-[3px]">
                                HELP
                            </h3>
                            <ul className="flex flex-col gap-2">
                                <li>
                                    <Link href="#" className="text-center flex justify-center font-satoshi font-light text-xs leading-snug tracking-normal text-black opacity-60">Customer Support</Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-center flex justify-center font-satoshi font-light text-xs leading-snug tracking-normal text-black opacity-60">Delivery Details</Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-center flex justify-center font-satoshi font-light text-xs leading-snug tracking-normal text-black opacity-60">Terms & Conditions</Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-center flex justify-center font-satoshi font-light text-xs leading-snug tracking-normal text-black opacity-60">Privacy Policy</Link>
                                </li>
                            </ul>
                        </div>
                        <div className="footer-col-2 flex flex-col gap-3">
                            <h3 className="font-satoshi text-center font-medium text-black text-base tracking-[3px]">
                                FAQ
                            </h3>
                            <ul className="flex flex-col gap-2">
                                <li>
                                    <Link href="#" className="text-center flex justify-center font-satoshi font-light text-xs leading-snug tracking-normal text-black opacity-60">Account</Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-center flex justify-center font-satoshi font-light text-xs leading-snug tracking-normal text-black opacity-60">Manage Deliveries</Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-center flex justify-center font-satoshi font-light text-xs leading-snug tracking-normal text-black opacity-60">Orders</Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-center flex justify-center font-satoshi font-light text-xs leading-snug tracking-normal text-black opacity-60">Payments</Link>
                                </li>
                            </ul>
                        </div>
                        <div className="footer-col-2 flex flex-col gap-3">
                            <h3 className="font-satoshi text-center font-medium text-black text-base tracking-[3px]">
                                RESOURCES
                            </h3>
                            <ul className="flex flex-col gap-2">
                                <li>
                                    <Link href="#" className="text-center flex justify-center font-satoshi font-light text-xs leading-snug tracking-normal text-black opacity-60">Free eBooks</Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-center flex justify-center font-satoshi font-light text-xs leading-snug tracking-normal text-black opacity-60">Development Tutorial</Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-center flex justify-center font-satoshi font-light text-xs leading-snug tracking-normal text-black opacity-60">How to - Blog</Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-center flex justify-center font-satoshi font-light text-xs leading-snug tracking-normal text-black opacity-60">Youtube Playlist</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="divider w-[90%] sm:w-[85%] mx-auto flex gap-0 my-0 items-center"></div>
                <div className="rights-footer w-[90%] sm:w-[85%] mx-auto flex justify-center items-center py-2">
                    <div className='text-xs sm:text-sm text-black opacity-60 text-center'>
                        &copy; Youssef Al Mostafa, Tenten - {new Date().getFullYear()}, All rights reserved
                    </div>
                </div>
            </div>
        </>
    )
}

export default Footer
