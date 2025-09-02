interface Brand {
    alt: string | undefined;
    src: string | undefined;
    name: string;
    image: string;
}

interface Props {
    content?: {
        items?: Brand[];
    };
}


const Brands = ({ content }: Props) => {
    const auto_rotate = true;
    const rotation_speed = 'medium'
    const brands = content?.items ?? [];

    if (brands.length === 0) {
        console.log('No brands found - returning empty section');
        return null;
    }

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
                {[...brands, ...brands, ...brands, ...brands].map((brand, index) => {
                    return (
                        <div
                            key={index}
                            className="w-[200px] mr-24 flex justify-center items-center"
                        >
                            <img
                                src={brand.src || `/storage/${brand.image}`}
                                alt={brand.alt || brand.name}
                                className="h-8 w-auto brightness-0 invert opacity-70 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                                onError={(e) => {
                                    console.error('Image failed to load:', brand);
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Brands;
