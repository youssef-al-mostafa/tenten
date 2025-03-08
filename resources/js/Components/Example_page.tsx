import { Head } from '@inertiajs/react';
import React from 'react'

interface Props {
    product? : string;
}

export default function Example({product}:Props){
  return (
    <>
     <Head title="Product" />
     <div>Example</div>
    </>
  )
}
