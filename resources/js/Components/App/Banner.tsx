import { Product } from '@/types';

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

export const Banner = ({ img, banner_header, property_1_nb, property_1_text, property_2_nb, property_2_text, property_3_nb, property_3_text }: Props) => {
    return (
        <>
            <div className="bg-base-200 h-[600px] ">
                <div className="flex justify-between max-w-full p-0 h-full w-[90%] mx-auto">
                    <div className="banner-content font-integral_cf font-extrabold text-black h-fit my-auto text-[64px]">
                        <h1 className='leading-[64px]'>
                            FIND CLOTHES <br />
                            THAT MATCHES <br />
                            YOUR STYLE
                        </h1>
                    </div>
                    <img alt="Banner Image"
                        src="/storage/banners/banner_main.png"
                        className="h-webkit" />
                </div>
            </div>
        </>
    )
}
