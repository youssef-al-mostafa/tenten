import { Product } from '@/types'
import { Head } from '@inertiajs/react';
import React from 'react'
interface Props {
    product?: Product;
}

function Show({ product }: Props) {
    return (
        <>
            <Head title="Product" />
            <div>Show</div>
        </>

    )
}

export default Show
