import { Image } from '@/types';

interface Props {
    images: Image[];
}

export const Carousel = ({ images }: Props) => {
    return (
        <>
            <div className="flex items-start gap-8">
                <div className="flex flex-col items-center gap-2 py-2">
                    {images.map((image, i) => (
                        <a  key={image.id}
                            className="border-2 hover:border-blue-500"
                            href={'#item'+i}>
                                <img
                                    src={image.thumb}
                                    alt='Image Thumb'
                                    className="w-[50px]"
                                />
                        </a>
                    ))}
                </div>
                <div className="carousel w-full">
                    {images.map((image, i) => (
                        <div key={image.id} id={'item' + i} className='carousel-item w-full'>

                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
