import { log } from "console";
import { Link } from '@inertiajs/react';

interface BannerProps {
    content?: {
        title?: string;
        subtitle?: string;
        button_text?: string;
        banner_image?: string;
        analytics?: Array<{
            name: string;
            number: string;
        }>;
        is_active?: boolean;
        sort_order?: number;
    };
}

const Banner = ({ content }: BannerProps) => {
    const {
        title,
        subtitle,
        button_text,
        banner_image,
        analytics
    } = content || {};

    const getImageUrl = (imagePath?: string) => {
        //if (!imagePath) return "/images/banner.png";

        // if (imagePath.startsWith('http') || imagePath.startsWith('/')) {
        //     return imagePath;
        // }

        return `/storage/${imagePath}`;
    };

    return (
        <div className="bg-base-200 min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] lg:h-[calc(100vh-110px)]">
            <div className="flex flex-col lg:flex-row justify-between items-center max-w-full p-0 h-full w-[90%] mx-auto py-8 lg:py-0">
                <div className="banner-content flex flex-col gap-4 sm:gap-6 lg:gap-7 h-fit my-auto w-full lg:w-[41%] text-center lg:text-left order-2 lg:order-1">
                    <h1 className='leading font-integral_cf font-extrabold text-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl'>
                        {title}
                    </h1>
                    <p className="font-satoshi font-normal text-sm sm:text-base md:text-lg leading-snug tracking-normal text-black opacity-60 max-w-md mx-auto lg:mx-0">
                        {subtitle}
                    </p>
                    <Link
                        href={route('products.index')}
                        className="btn bg-black text-white rounded-full w-full sm:w-60 lg:w-48
                                   px-4 sm:px-6 lg:px-15 py-3 sm:py-4 hover:border-solid hover:border-black
                                   hover:bg-white hover:text-black hover:border-3 no-underline text-center
                                   text-sm font-medium mx-auto lg:mx-0 leading-[0]"
                    >
                        {button_text}25
                    </Link>
                    <div className="banner-numbers flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 mt-4">
                        {analytics && analytics.map((stat, index) => (
                            <div key={index} className="flex items-center gap-3 sm:gap-4">
                                <div className="flex flex-col text-center lg:text-left">
                                    <span className="font-satoshi font-bold text-black text-xl sm:text-2xl">
                                        {stat.number}
                                    </span>
                                    <span className="font-satoshi font-normal text-xs sm:text-sm leading-snug tracking-normal text-black opacity-60">
                                        {stat.name}
                                    </span>
                                </div>
                                {index < analytics.length - 1 && (
                                    <div className="w-[1px] h-12 bg-gray-500 hidden sm:block"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className='relative pt-2 w-full lg:w-auto order-1 lg:order-2 mb-6 lg:mb-0'>
                    <svg className='absolute right-4 sm:right-8 lg:right-0 top-8 sm:top-12 lg:top-14 w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] lg:w-[104px] lg:h-[104px] opacity-80' viewBox="0 0 104 104" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M52 0C53.7654 27.955 76.0448 50.2347 104 52C76.0448 53.7654 53.7654 76.0448 52 104C50.2347 76.0448 27.955 53.7654 0 52C27.955 50.2347 50.2347 27.955 52 0Z" fill="black" />
                    </svg>
                    <svg className='absolute left-4 sm:left-8 lg:left-0 top-1/2 w-[32px] h-[32px] sm:w-[40px] sm:h-[40px] lg:w-[56px] lg:h-[56px] opacity-80' viewBox="0 0 104 104" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M52 0C53.7654 27.955 76.0448 50.2347 104 52C76.0448 53.7654 53.7654 76.0448 52 104C50.2347 76.0448 27.955 53.7654 0 52C27.955 50.2347 50.2347 27.955 52 0Z" fill="black" />
                    </svg>
                    <img
                        alt="Banner Image"
                        src={getImageUrl(banner_image)}
                        className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto lg:mx-0 h-auto object-contain"
                        onError={(e) => {
                            console.error('Error during banner image rendering ', e)
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Banner;
