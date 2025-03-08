import { Product } from '@/types'
import { Head } from '@inertiajs/react';
import React from 'react'
interface Props {
    product?: Product;
    variationOptions?: number[];
}

function Show({ product ,variationOptions}: Props) {
    console.log('variation options : ',variationOptions);
    console.log('product : ',product);
    return (
        <>
            <Head title="Product" />
            <div>Show</div>
        </>

    )
}

export default Show
