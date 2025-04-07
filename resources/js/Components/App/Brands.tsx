import { Product } from '@/types';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';

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
        <div className='brands-cont flex gap-[50%] bg-black w-full h-[112px] items-center overflow-hidden'>
            <div className="brands-animate flex gap-24 w-fit whitespace-nowrap justify-center">
              {brands.map((brand, index) => (
                <img
                  key={`set1-${index}`}
                  src={brand.src}
                  alt={brand.alt}
                  className='h-6 w-auto inline-block' />
              ))}
            </div>
        </div>
      );
};

export default Brands;
