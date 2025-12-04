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
    const deleteForm = useForm({
        option_ids: item.option_ids
    })

    const [error, setError] = useState('');

    const onDeleteClick = () => {
        deleteForm.delete(route('cart.destroy', item.product_id), {
            preserveScroll: true
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
            <div key={item.id} className='flex gap-6 p-3'>
                <Link href={productRoute(item)} className='w-32 min-w-32 min-h-32 flex justify-center self-start'>
                    <img src={item.image} alt='Product Image' className='max-w-full max-h-full' />
                </Link>
                <div className="flex-1 flex flex-col">
                    <div className="flex-1">
                        <h3 className="mb-3 text-sm font-semibold">
                            <Link href={productRoute(item)}>
                                {item.title}
                            </Link>
                        </h3>
                        <div className="text-xs">
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
                </div>
                <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-2 items-center">
                        <div className="text-sm">Quantity:</div>
                        <div className={error ? 'tooltip tooltip-open tooltip-error' : ''} data-tip={error}>
                            <TextInput type='number' defaultValue={item.quantity} onBlur={handleQuantityChange}
                                className='input-sm w-16'></TextInput>
                        </div>
                        <button className="btn btn-sm btn-ghost" onClick={
                            () => onDeleteClick()
                        }>
                            Delete
                        </button>
                        <button className="btn btn-sm btn-ghost">
                            Save for Later
                        </button>
                        <div className="font-bold text-lg">
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
