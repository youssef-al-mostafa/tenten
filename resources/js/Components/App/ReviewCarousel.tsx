import { useEffect, useState, useRef, useCallback } from 'react';

interface Review {
    id: number;
    name: string;
    stars: number;
    review: string;
}

interface Props {
    header?: string;
    reviews?: Review[];
}

const ReviewCarousel = ({
    header = "OUR HAPPY CUSTOMERS",
    reviews = [
        {
            id: 1,
            name: "Sarah M.",
            stars: 5,
            review: "I'm blown away by the quality and style of the clothes I received from Tenten. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations."
        },
        {
            id: 2,
            name: "Alex K.",
            stars: 4,
            review: "Finding clothes that align with my personal style used to be a challenge until I discovered Tenten. The range of options they offer is truly remarkable."
        },
        {
            id: 3,
            name: "Jessica L.",
            stars: 5,
            review: "Tenten has completely transformed my wardrobe. I can't recommend them enough! The quality is outstanding and the customer service is top-notch."
        },
        {
            id: 4,
            name: "Michael B.",
            stars: 4,
            review: "The variety of styles available at Tenten is impressive. I always find something I love and the prices are very reasonable for the quality you get."
        },
        {
            id: 5,
            name: "Emily R.",
            stars: 5,
            review: "Shopping at Tenten is a breeze. The website is user-friendly and the clothes are top-notch. Fast delivery and excellent packaging too!"
        },
        {
            id: 6,
            name: "David W.",
            stars: 4,
            review: "I appreciate the attention to detail in every piece of clothing I order from Tenten. The fabric quality and stitching are exceptional."
        }
    ]
}: Props) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const reviewsPerPage = 3;
    const totalPages = Math.ceil(reviews.length / reviewsPerPage);
    const [isHovered, setIsHovered] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const nextSlide = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex((prev) => Math.min(prev + 1, totalPages - 1));
        setTimeout(() => setIsTransitioning(false), 500);
    }, [isTransitioning, totalPages]);

    useEffect(() => {
        if (currentIndex < totalPages - 1 && !isHovered && !isTransitioning)
            { const interval = setInterval(() => {
                nextSlide();
             }, 6000);
             return () => clearInterval(interval);
            } },
        [isHovered, isTransitioning, currentIndex, totalPages, nextSlide]);

    const prevSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
        setTimeout(() => setIsTransitioning(false), 500);
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex mb-3">
                {[...Array(5)].map((_, index) => (
                    <svg
                        key={index}
                        width="20"
                        height="19"
                        viewBox="0 0 23 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M11.5526 0L14.751 6.8872L22.2895 7.80085L16.7278 12.971L18.1884 20.4229L11.5526 16.731L4.91676 20.4229L6.37735 12.971L0.815609 7.80085L8.3541 6.8872L11.5526 0Z"
                            fill={index < rating ? "#FFC633" : "#E5E7EB"}
                        />
                    </svg>
                ))}
            </div>
        );
    };

    const renderReviewCard = (review: Review) => (
        <div
            key={review.id}
            className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 flex-shrink-0 w-full"
        >
            <h3 className="font-satoshi font-bold text-lg text-black mb-3">
                {review.name}
            </h3>
            {renderStars(review.stars)}
            <p className="font-satoshi font-normal text-base leading-relaxed text-black opacity-60">
                "{review.review}"
            </p>
        </div>
    );

    return (
        <div
            className="w-[90%] mx-auto py-16"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex justify-between items-center mb-12">
                <h2 className="font-integral_cf font-extrabold text-black text-4xl">
                    {header}
                </h2>

                <div className="flex gap-4">
                    <button
                        onClick={prevSlide}
                        disabled={isTransitioning}
                        className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-black hover:bg-black hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

                    <button
                        onClick={nextSlide}
                        disabled={isTransitioning}
                        className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-black hover:bg-black hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="relative overflow-hidden">
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{
                        transform: `translateX(-${currentIndex * 100}%)`
                    }}
                >
                    {Array.from({ length: totalPages }).map((_, pageIndex) => {
                        const startIndex = pageIndex * reviewsPerPage;
                        const pageReviews = reviews.slice(startIndex, startIndex + reviewsPerPage);

                        return (
                            <div
                                key={pageIndex}
                                className="w-full flex-shrink-0"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {pageReviews.map(renderReviewCard)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ReviewCarousel;
