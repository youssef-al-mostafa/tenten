import { Product } from '@/types';
import React from 'react';

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
        <>
            <style>{`
                @keyframes scroll-infinite {
                    from {
                        transform: translateX(0);
                    }
                    to {
                        transform: translateX(calc(-1 * (6rem + 200px) * 5));
                    }
                }

                .brands-animate {
                    animation: scroll-infinite 15s linear infinite;
                }

                .brands-animate:hover {
                    animation-play-state: paused;
                }

                .brand-item {
                    width: 200px;
                    margin-right: 6rem;
                }
            `}</style>

            <div className="bg-black w-full h-[112px] flex items-center overflow-hidden relative">
                <div className="brands-animate flex items-center whitespace-nowrap">
                    {[...brands, ...brands, ...brands, ...brands].map((brand, index) => (
                        <div key={index} className="brand-item flex justify-center items-center">
                            <img
                                src={brand.src}
                                alt={brand.alt}
                                className="h-8 w-auto brightness-0 invert opacity-70 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Brands;
