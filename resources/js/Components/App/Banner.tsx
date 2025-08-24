
interface Props {
    img?: string;
    banner_header?: string;
    banner_text?: string;
    button_text?: string;

    property_1_nb?: string;
    property_1_text?: string;

    property_2_nb?: string;
    property_2_text?: string;

    property_3_nb?: string;
    property_3_text?: string;
}

const Banner = ({ img, banner_header, property_1_nb, property_1_text, property_2_nb, property_2_text, property_3_nb, property_3_text }: Props) => {
    return (
        <>
            <div className="bg-base-200 h-[calc(100vh-110px)] ">
                <div className="flex justify-between max-w-full p-0 h-full w-[90%] mx-auto">
                    <div className="banner-content flex flex-col gap-7 h-fit my-auto w-[41%]">
                        <h1 className='leading font-integral_cf font-extrabold text-black text-5xl'>
                            FIND CLOTHES
                            THAT MATCHES
                            YOUR STYLE
                        </h1>
                        <p className="font-satoshi font-normal text-base leading-snug tracking-normal text-black opacity-60">
                            Browse through our diverse range of meticulously crafted garments,
                            designed to bring out your individuality and cater to your sense
                            of style.
                        </p>
                        <button className="btn
                                         bg-black
                                         text-white
                                           rounded-full
                                           w-48
                                           px-15
                                           hover:border-solid
                                         hover:border-black
                                         hover:bg-white
                                         hover:text-black
                                           hover:border-3">
                            Shop Now
                        </button>
                        <div className="banner-numbers flex gap-4">
                            <div className="flex flex-col text">
                                <span className="font-satoshi font-bold text-black text-2xl">
                                    200+
                                </span>
                                <span className="font-satoshi font-normal text-sm leading-snug tracking-normal text-black opacity-60">
                                    International Brands
                                </span>
                            </div>
                            <div className="w-[1px] h-web bg-gray-500"></div>
                            <div className="flex flex-col text">
                                <span className="font-satoshi font-bold text-black text-2xl">
                                    2000+
                                </span>
                                <span className="font-satoshi font-normal text-sm leading-snug tracking-normal text-black opacity-60">
                                    High-Quality Products
                                </span>
                            </div>
                            <div className="w-[1px] h-web bg-gray-500"></div>
                            <div className="flex flex-col text">
                                <span className="font-satoshi font-bold text-black text-2xl">
                                    30000+
                                </span>
                                <span className="font-satoshi font-normal text-sm leading-snug tracking-normal text-black opacity-60">
                                    Happy Customers
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className='relative pt-2'>
                        <svg className='absolute right-0 top-14 w-[104px] h-[104px]' viewBox="0 0 104 104" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M52 0C53.7654 27.955 76.0448 50.2347 104 52C76.0448 53.7654 53.7654 76.0448 52 104C50.2347 76.0448 27.955 53.7654 0 52C27.955 50.2347 50.2347 27.955 52 0Z" fill="black" />
                        </svg>
                        <svg className='absolute left-0 top-1/2  w-[56px] h-[56px]' viewBox="0 0 104 104" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M52 0C53.7654 27.955 76.0448 50.2347 104 52C76.0448 53.7654 53.7654 76.0448 52 104C50.2347 76.0448 27.955 53.7654 0 52C27.955 50.2347 50.2347 27.955 52 0Z" fill="black" />
                        </svg>
                        <img alt="Banner Image"
                            src="/images/banner.png"
                            className="h-webkit" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Banner;
