/* eslint-disable prefer-const */
import NavBar from '@/Components/App/NavBar';
import { Carousel } from '@/Components/Core/Carousel';
import { CurrencyFormatter } from '@/Components/Core/CurrencyFormatter';
import { arraysAreEqual } from '@/helpers';
import { Product, VariationTypeOption } from '@/types'
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { error } from 'console';
import React, { useEffect, useMemo, useState } from 'react';

interface Props {
    product: Product;
    variationOptions: number[];
    appName: string;
}

type ProductForm = {
    option_ids: Record<string, number>;
    quantity: number;
    price: number | null;
}

function Show({ appName, product, variationOptions }: Props) {
    // console.log('variation options : ',variationOptions);
    // console.log('product : ',product);
    const form = useForm<ProductForm>({
        option_ids: {},
        quantity: 1,
        price: null,
    })
    const { url } = usePage();

    const [selectedOptions, setSelectedOptions] =
        useState<Record<number, VariationTypeOption>>([]);

    const images = useMemo(() => {
        for (let typeId in selectedOptions) {
            const option = selectedOptions[typeId];
            if (option.images.length > 0) return option.images;
        }
        return product?.images
    }, [product, selectedOptions])

    const computedProduct = useMemo(() => {
        const selectedOptionIds = Object.values(selectedOptions)
            .map(option => option.id)
            .sort();

        for (let variation of product.variation) {
            const optionIds = variation.variation_type_option_ids.sort();
            if (arraysAreEqual(selectedOptionIds, optionIds)) {
                return {
                    price: variation.price,
                    quantity: variation.quantity === null ? Number.MAX_VALUE : variation.quantity,
                }
            }
        }
        return {
            price: product.price,
            quantity: product.quantity,
        }
    }, [product, selectedOptions])

    useEffect(() => {
        for (let type of product.variationTypes) {
            const selectedOptionId: number = variationOptions[type.id];
            console.log('this is the selected option id =>', selectedOptionId, type.options);
            chooseOption(
                type.id,
                type.options.find(op => op.id == selectedOptionId) || type.options[0],
                false)
        }
    }, [])

    const getOptionIdsMap = (newOptions: object) => {
        return Object.fromEntries(Object.entries(newOptions).map(([a, b]) => [a, b.id]))
    }

    const chooseOption = (typeId: number, option: VariationTypeOption, updateRouter: boolean = true) => {
        setSelectedOptions((prevSelectedOptions) => {
            const newOptions = {
                ...prevSelectedOptions,
                [typeId]: option,
            }
            if (updateRouter) {
                router.get(url, {
                    options: getOptionIdsMap(newOptions)
                }, {
                    preserveScroll: true,
                    preserveState: true
                })
            }
            return newOptions
        })
    }

    const onQuantityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        form.setData('quantity', parseInt(event.target.value));
    }

    const addToCart = () => {
        form.post(route('cart.store', product.id), {
            preserveScroll: true,
            preserveState: true,
            onError: (err) => {
                console.error(err)
            },
        })
    }

    const renderProductVariationTypes = () => {
        return (product.variationTypes.map((type) => (
            <div key={type.id}>
                <h3 className='mb-[20px] font-bold text-xl'>{type.name}</h3>
                {type.type === 'Image' &&
                    <div className="flex gap-2 mb-4">
                        {/* <pre>{JSON.stringify(product.variationTypes, undefined, 2)}</pre> */}
                        {type.options.map((option) => (
                            <div key={option.id} onClick={() => chooseOption(type.id, option)}>
                                {option.images && <img src={option.images[0].thumb}
                                    className={'w-[50px] ' + (selectedOptions[type.id]?.id === option.id ?
                                        'outline outline-4 outline-primary' : ''
                                    )} />}
                            </div>
                        ))}
                    </div>
                }
                {type.type === 'Radio' &&
                    <div className="flex join mb-4">
                        {type.options.map(option => (
                            <input key={option.id}
                                onChange={() => chooseOption(type.id, option)}
                                className='join-item btn w-fit'
                                type='radio'
                                value={option.id}
                                checked={selectedOptions[type.id]?.id === option.id}
                                name={'variation_type_' + type.id}
                                aria-label={option.name} />
                        ))}
                    </div>
                }
            </div>
        )));
    }

    const renderAddToCartButton = () => {
        return (
            <div className="mb-8 flex gap-4">
                <select value={form.data.quantity}
                    onChange={onQuantityChange}
                    className='select select-bordered w-full'>
                    {Array.from({
                        length: Math.min(10, computedProduct.quantity)
                    }).map((el, i) => (
                        <option key={i} value={i + 1}>Quantity: {i + 1}</option>
                    ))}
                </select>
                <button onClick={addToCart} className='btn btn-primary'>Add to Cart</button>
            </div>
        );
    }

    useEffect(() => {
        const idsMap = Object.fromEntries(
            Object.entries(selectedOptions).map(([typeId, option]: [string, VariationTypeOption]) => [typeId, option.id])
        );
        console.log('the ids Map form the use Effect :', idsMap)
        form.setData('option_ids', idsMap);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedOptions, form.setData]);
    return (
        <>
            <Head>
                <title>{product.title}</title>
                <meta name="title" content={(product.meta_title || product.title).toString()} />
                <meta name="description" content={product.meta_description} />
                <link rel="canonical" href={route('product. show', product.slug)} />

                <meta property="og:title" content={product.meta_title} />
                <meta property="og:description" content={product.meta_description} />
                <meta property="og:image" content={images[0]?.small} />
                <meta property="og:url" content={route('product.show', product.slug)} />
                <meta property="og:type" content="product" />
                <meta property="og :site_name" content={appName} />
            </Head>
            <NavBar />
            <div className="container mx-auto p-8">
                <div className="grid gap-8 grid-cols-1 lg:grid-cols-12">
                    <div className="col-span-7">
                        <Carousel images={images} />
                    </div>
                    <div className="col-span-5">
                        <h1 className="text-2xl mb-8">{product.title}</h1>
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
                        <div className="mb-8">
                            <div className="text-3xl font-semiblod">
                                <CurrencyFormatter amount={computedProduct.price} />
                            </div>
                        </div>

                        {renderProductVariationTypes()}
                        {computedProduct.quantity != undefined &&
                            computedProduct.quantity < 10 &&
                            <div className='text-error my-4'>
                                <span>Only {computedProduct.quantity} left</span>
                            </div>}
                        {renderAddToCartButton()}

                        <b className="text-xl">About this Item</b>
                        <div className="wysiwyg-output" dangerouslySetInnerHTML={{
                            __html: product
                                .description
                        }}></div>
                    </div>
                </div>
            </div>
        </>

    )
}
export default Show
