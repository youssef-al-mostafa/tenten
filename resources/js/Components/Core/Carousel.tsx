import { Image } from '@/Types';
import { useEffect, useState } from 'react';

interface Props {
    images: Image[];
}

export const Carousel = ({ images }: Props) => {
    const [selectedImage, setSelectedImage] = useState<Image>(images[0]);
    useEffect(() => {
        setSelectedImage(images[0])
    }, [images])
    return (
        <>
            <div className="flex items-start gap-8">
                <div className="flex flex-col items-center gap-2 py-2">
                    {images.map((image, i) => (
                        <button key={image.id}
                            className={"border-2" + (selectedImage === image ? " border-blue-500" : "")}
                            onClick={(event) => setSelectedImage(image)}>
                            <img src={image.thumb}
                                alt='Image Thumb'
                                className="w-[50px]" />
                        </button>
                    ))}
                </div>
                <div className="carousel w-full">
                    <div className='carousel-item w-full'>
                        <img src={selectedImage.large} alt='Product Image' className='w-full' />
                    </div>
                </div>
            </div>
        </>
    )
}
