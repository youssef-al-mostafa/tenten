import { Link } from '@inertiajs/react'
import { footerData } from '@/config/footerConfig'

const Footer = () => {
    return (
        <div className="footer relative flex flex-col gap-2 bg-white
                        h-fit pt-6 sm:pt-8 lg:pt-10 pb-5 mx-auto w-full">
            <div className="container footer-main flex flex-col lg:flex-row justify-between
                             mx-auto mb-6 gap-8 lg:gap-0 lg:mb-3 w-[90%]">
                <div className="footer-col w-full lg:w-[22%] flex flex-col gap-4
                                sm:gap-6 lg:gap-7 text-center lg:text-left">
                    <Link className="logo bg-transparent hover:bg-transparent border-0 font-satoshi
                                     font-extrabold transition-all duration-300 text-[18px] sm:text-[20px]
                                     md:text-[24px] lg:text-[35px] text-black"
                          href={'/'}>
                        {footerData.brandInfo.name}
                    </Link>
                    <p className="font-satoshi font-normal text-xs sm:text-sm leading-snug
                                  tracking-normal text-black opacity-60 max-w-sm mx-auto lg:mx-0">
                        {footerData.brandInfo.description}
                    </p>
                    <div className="social-media-row flex justify-center lg:justify-start gap-4 sm:gap-5">
                        {footerData.socialLinks.map((social) => (
                            <a key={social.name}
                               href={social.href}
                               className="social-media-icon text-black overflow-hidden hover:text-gray-600 transition-colors"
                               aria-label={social.name}>
                                <svg xmlns="http://www.w3.org/2000/svg"
                                     className="w-4 h-4 sm:w-5 sm:h-5"
                                     fill="currentColor"
                                     viewBox="0 0 16 16">
                                    <path d={social.icon} />
                                </svg>
                            </a>
                        ))}
                    </div>
                </div>
                <div className="footer-col w-full lg:w-[70%] grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
                    {footerData.columns.map((column) => (
                        <div key={column.title} className="footer-col-item flex flex-col gap-3">
                            <h3 className="font-satoshi font-medium text-black text-sm
                                           sm:text-base tracking-[2px] sm:tracking-[3px]">
                                {column.title}
                            </h3>
                            <ul className="flex flex-col gap-2">
                                {column.links.map((link) => (
                                    <li key={link.label}>
                                        <Link href={link.href}
                                              className="font-satoshi font-light text-xs sm:text-sm leading-snug
                                                         tracking-normal text-black opacity-60
                                                         hover:opacity-80 transition-opacity">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <div className="divider w-[90%] sm:w-[85%] mx-auto flex gap-0 my-0 items-center"></div>
            <div className="rights-footer w-[90%] sm:w-[85%] mx-auto flex justify-center items-center py-2">
                <div className='text-xs sm:text-sm text-black opacity-60 text-center'>
                    &copy; {footerData.copyright.text}
                    {footerData.copyright.showYear && ` - ${new Date().getFullYear()}`}, All rights reserved
                </div>
            </div>
        </div>
    )
}

export default Footer
