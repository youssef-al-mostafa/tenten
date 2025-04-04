import { Product } from '@/types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

interface Props {
    product?: Product;
}

const Brands = ({ product }: Props) => {
    const brands = [
        { src: "/images/brands/calvin-klein.png", alt: "calvin-klein" },
        { src: "/images/brands/gucci.png", alt: "gucci" },
        { src: "/images/brands/prada.png", alt: "prada" },
        { src: "/images/brands/versace.png", alt: "versace" },
        { src: "/images/brands/zara.png", alt: "zara" },
    ];

    return (
        <div className='flex bg-black w-full h-[112px] items-center'>
            <div className='w-[90%] mx-auto'>
                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={50}
                    slidesPerView={5}
                    loop={true}
                    autoplay={{
                        delay: 0,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    speed={1500}
                    className="BrandsSwiper">
                    {[...brands, ...brands, ...brands].map((brand, index) => (
                        <SwiperSlide key={index} className='text-center mx-auto!'>
                            <img
                                src={brand.src}
                                alt={brand.alt}
                                className='h-6 w-fit mx-auto transition-all hover:scale-110'
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default Brands;
