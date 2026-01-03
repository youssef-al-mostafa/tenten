import { productRoute } from '@/helpers';
import type { CartItem } from '@/types';
import { Link, router, useForm } from '@inertiajs/react';
import TextInput from '../Core/TextInput';
import { useState } from 'react';
import { CurrencyFormatter } from '../Core/CurrencyFormatter';


interface Props {
    item: CartItem;
}

const CartItem = ({ item }: Props) => {
    const [error, setError] = useState('');

    const onDeleteClick = () => {
        router.delete(route('cart.destroy', item.product_id), {
            preserveScroll: true,
            data: {
                option_ids: item.option_ids
            }
        })
    }

    const handleQuantityChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setError('');
        router.patch(route('cart.update', item.product_id), {
            quantity: ev.target.value,
            option_ids: item.option_ids
        }, {
            preserveScroll: true,
            onError: (errors) => {
                setError(Object.values(errors)[0])
            }
        })
    }
    return (
        <>
            <div key={item.id} className='flex flex-col sm:flex-row gap-4 sm:gap-6 p-3'>
                <Link href={productRoute(item)} className='w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 flex justify-center self-center sm:self-start'>
                    <img src={item.image} alt='Product Image' className='max-w-full max-h-full object-contain' />
                </Link>
                <div className="flex-1 flex flex-col gap-3">
                    <div className="flex-1 text-center sm:text-left">
                        <h3 className="mb-2 text-sm sm:text-base font-semibold">
                            <Link href={productRoute(item)}>
                                {item.title}
                            </Link>
                        </h3>
                        <div className="text-xs sm:text-sm">
                            {item.options.map((option) => (
                                <div key={option.id}>
                                    <strong className="text-bold">
                                        {option.type.name} :
                                    </strong>
                                    {' ' + option.option_name}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 items-center sm:items-start">
                        <div className="flex items-center gap-2">
                            <div className="text-xs sm:text-sm">Quantity:</div>
                            <div className={error ? 'tooltip tooltip-open tooltip-error' : ''} data-tip={error}>
                                <TextInput type='number' defaultValue={item.quantity} onBlur={handleQuantityChange}
                                    className='input-sm w-16'></TextInput>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                            <button className="btn btn-xs sm:btn-sm btn-ghost" onClick={
                                () => onDeleteClick()
                            }>
                                Delete
                            </button>
                            <button className="btn btn-xs sm:btn-sm btn-ghost">
                                Save for Later
                            </button>
                        </div>
                        <div className="font-bold text-base sm:text-lg sm:ml-auto">
                            <CurrencyFormatter amount={item.price * item.quantity} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="divider"></div>
        </>
    )
}

export default CartItem;
