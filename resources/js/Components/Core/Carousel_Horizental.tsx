import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useEffect, useState } from 'react';
import { Autoplay, Navigation, Pagination, Scrollbar } from 'swiper/modules';

interface Props {
    Section_header?: string;
    Slides?: Slide[];
}

interface Slide {
    nb_stars: number;
    header: string;
    text: string;
}

const defaultSlides: Slide[] = [
    {
        nb_stars: 5,
        header: "Sarah M.",
        text: "I'm blown away by the quality and style of the clothes I received from Tenten."
    },
    {
        nb_stars: 4,
        header: "Alex K.",
        text: "Finding clothes that align with my personal style used to be a challenge until I discovered Tenten"
    },
    {
        nb_stars: 5,
        header: "Jessica L.",
        text: "Tenten has completely transformed my wardrobe. I can't recommend them enough!"
    },
    {
        nb_stars: 3,
        header: "Michael B.",
        text: "The variety of styles available at Tenten is impressive. I always find something I love."
    },
    {
        nb_stars: 4,
        header: "Emily R.",
        text: "Shopping at Tenten is a breeze. The website is user-friendly and the clothes are top-notch."
    },
    {
        nb_stars: 5,
        header: "David W.",
        text: "I appreciate the attention to detail in every piece of clothing I order from Tenten."
    }
];
const defaultSectionHeader = 'OUR HAPPY CUSTOMERS';


const Carousel_Horizental = ({ Section_header, Slides }: Props) => {
    const [currentSlides, setCurrentSlides] = useState<Slide[]>([]);
    const [sectionHeader, setSectionHeader] = useState<string | undefined>(Section_header);

    useEffect(() => {
        if (!Slides || Slides.length === 0) {
            setCurrentSlides(defaultSlides);
        } else {
            setCurrentSlides(Slides);
        }
    }, [Slides]);
    useEffect(() => {
        if (Section_header) {
            setSectionHeader(Section_header);
        } else {
            setSectionHeader(defaultSectionHeader);
        }
    }, [Section_header]);

    return (
        <div className="w-[90%] mx-auto h-fit py-7">
            <div className="flex justify-between w-full p-0 h-fit mb-8">
                <h1 className='text-black font-integral_cf font-extrabold text-4xl w-[50%] h-fit'>
                    {sectionHeader}
                </h1>
                <div className="flex gap-4">
                    <button className="custom-prev-button">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    <button className="custom-next-button">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>
            <Swiper
                modules={[Navigation, Pagination, Scrollbar, Autoplay]}
                spaceBetween={50}
                slidesPerView={3}
                navigation={{
                    prevEl: '.custom-prev-button',
                    nextEl: '.custom-next-button',
                }}
                loop={true}
                autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}>
                {currentSlides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <div  className="flex flex-col gap-2 border-solid border-[2px] rounded-2xl p-5 bg-white w-full h-full shadow-none">
                            <div className="flex">
                                {Array.from({ length: slide.nb_stars }).map((_, index) => (
                                    <svg width="21" height="18" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11.5526 0L14.751 6.8872L22.2895 7.80085L16.7278 12.971L18.1884 20.4229L11.5526 16.731L4.91676 20.4229L6.37735 12.971L0.815609 7.80085L8.3541 6.8872L11.5526 0Z" fill="#FFC633" />
                                    </svg>
                                ))}
                            </div>
                            <h1 className='text-black font-satoshi font-bold text-lg'>
                                {slide.header}
                            </h1>
                            <p className="font-satoshi font-normal text-sm leading-snug tracking-normal text-black opacity-60">
                                {slide.text}
                            </p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}

export default Carousel_Horizental
