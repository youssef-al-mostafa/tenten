import { Image } from '@/types';
import { useState } from 'react';

interface Props {
    images: Image[];
}

export const Carousel = ({ images }: Props) => {
    const [selectedImage, setSelectedImage] = useState<Image>(images[0]);
    return (
        <>
            <div className="flex items-start gap-8">
                <div className="flex flex-col items-center gap-2 py-2">
                    {images.map((image, i) => (
                        <button key={image.id}
                           className="border-2 hover:border-blue-500">
                                <img src={image.thumb}
                                     alt='Image Thumb'
                                     className="w-[50px]"/>
                        </button>
                    ))}
                </div>
                <div className="carousel w-full">
                    {images.map((image, i) => (
                        <div key={image.id} id={'item' + i} className='carousel-item w-full'>
                           <img src={image.large} alt='Product Image' className='w-full'/>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
