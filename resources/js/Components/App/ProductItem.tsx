import React from 'react'
import { Product } from '@/types';
import { Link } from '@inertiajs/react';
import { CurrencyFormatter } from '../Core/CurrencyFormatter';
import { useForm } from '@inertiajs/react';

interface Props {
    product: Product;
}

type ProductForm = {
    option_ids: Record<string, number>;
    quantity: number;
    price: number | null;
}

export const ProductItem = ({ product }: Props) => {

    const form = useForm<ProductForm>({
        option_ids: {},
        quantity: 1,
        price: product.price,
    })

    const addToCart = () => {
        form.post(route('cart.store', product.id), {
            preserveScroll: true,
            preserveState: true,
            onError: (err) => {
                console.error(err)
            },
        })
    }
    return (
        <div className='card bg-base-100 shadow-xl'>
            <Link href={route('product.show', product.id)}>
                <figure>
                    <img src={product.image}
                        alt={product.title}
                        className='aspect-square object-cover' />
                </figure>
            </Link>
            <div className="card-body">
                <h2 className="card-title">
                    {product.title}
                    <p>
                        by&nbsp;
                        <Link href={route('vendor.profile', product.user.store_name)} className='hover:underline'>
                            {product.user.store_name}
                        </Link>
                        &nbsp; in&nbsp;
                        <Link href='/' className='hover:underline'>
                            {product.department.name}
                        </Link>
                    </p>
                </h2>
            </div>
            <div className="card-actions items-center justify-between mt-3">
                <button onClick={addToCart} className="btn btn-primary">Add to Cart</button>
                <span className="text-2xl">
                    <CurrencyFormatter amount={product.price} />
                </span>
            </div>
        </div>
    )
}
