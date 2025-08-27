import React from 'react';

interface BrandsProps {
  content?: {
    title?: string;
    auto_rotate?: boolean;
    rotation_speed?: 'slow' | 'medium' | 'fast';
    is_active?: boolean;
    sort_order?: number;
  };
}

const Brands = ({ content }: BrandsProps) => {
  const {
    auto_rotate = true,
    rotation_speed = 'medium'
  } = content || {};

  const brands = [
    { src: "/images/brands/calvin-klein.png", alt: "calvin-klein" },
    { src: "/images/brands/gucci.png", alt: "gucci" },
    { src: "/images/brands/prada.png", alt: "prada" },
    { src: "/images/brands/versace.png", alt: "versace" },
    { src: "/images/brands/zara.png", alt: "zara" },
  ];

  const animationClass = {
    slow: 'animate-scroll-slow',
    medium: 'animate-scroll-medium',
    fast: 'animate-scroll-fast'
  }[rotation_speed];

  return (
    <div className="bg-black w-full h-[112px] flex items-center overflow-hidden relative">
      <div
        className={`
          ${animationClass}
          ${auto_rotate ? '' : '[animation-play-state:paused]'}
          hover:[animation-play-state:paused]
          flex items-center whitespace-nowrap
        `}
      >
        {[...brands, ...brands, ...brands, ...brands].map((brand, index) => (
          <div
            key={index}
            className="w-[200px] mr-24 flex justify-center items-center"
          >
            <img
              src={brand.src}
              alt={brand.alt}
              className="h-8 w-auto brightness-0 invert opacity-70 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Brands;
