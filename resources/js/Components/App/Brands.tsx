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
        <div className='flex gap-[50%] bg-black w-full h-[112px] items-center overflow-hidden'>
            <div
              className="flex gap-24 animate-[brands_20s_linear_infinite] whitespace-nowrap" >
              {brands.map((brand, index) => (
                <img
                  key={`set1-${index}`}
                  src={brand.src}
                  alt={brand.alt}
                  className='h-6 w-auto inline-block' />
              ))}
            </div>
            <div
              className="flex gap-24 animate-[brands_20s_linear_infinite] whitespace-nowrap" >
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
