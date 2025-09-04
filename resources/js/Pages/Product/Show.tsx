/* eslint-disable prefer-const */
import NavBar from '@/Components/App/NavBar';
import { ProductItem } from '@/Components/App/ProductItem';
import { Carousel } from '@/Components/Core/Carousel';
import { CurrencyFormatter } from '@/Components/Core/CurrencyFormatter';
import { arraysAreEqual } from '@/helpers';
import { Product, VariationTypeOption } from '@/types'
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { error } from 'console';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

interface Props {
    product: Product;
    variationOptions: number[];
    appName: string;
    similarProducts?: {
        data: Product[];
    };
    pageContent?: any;
}

type ProductForm = {
    option_ids: Record<string, number>;
    quantity: number;
    price: number | null;
}

function Show({ appName, product, variationOptions, similarProducts, pageContent }: Props) {
    const form = useForm<ProductForm>({
        option_ids: {},
        quantity: 1,
        price: null,
    })
    const { url } = usePage();
    const [selectedOptions, setSelectedOptions] = useState<Record<number, VariationTypeOption>>([]);

    const getContent = (section: string, field: string) => {
        return pageContent?.[section]?.[field] || pageContent?.fields?.[section]?.[field]?.default || '';
    };

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

    const getOptionIdsMap = useCallback((newOptions: object) => {
        return Object.fromEntries(Object.entries(newOptions).map(([a, b]) => [a, b.id]))
    }, []);

    const chooseOption = useCallback((typeId: number, option: VariationTypeOption, updateRouter: boolean = true) => {
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
    }, [url, getOptionIdsMap])

    useEffect(() => {
        for (let type of product.variationTypes) {
            const selectedOptionId: number = variationOptions[type.id];
            chooseOption(
                type.id,
                type.options.find(op => op.id == selectedOptionId) || type.options[0],
                false)
        }
    }, [chooseOption, product.variationTypes, variationOptions])

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
            <div key={type.id} className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className='mb-4 font-semibold text-lg text-gray-900'>{type.name}</h3>
                {type.type === 'Image' &&
                    <div className="flex flex-wrap gap-3">
                        {type.options.map((option) => (
                            <div
                                key={option.id}
                                onClick={() => chooseOption(type.id, option)}
                                className="cursor-pointer group"
                            >
                                {option.images && (
                                    <img
                                        src={option.images[0].thumb}
                                        className={`w-16 h-16 rounded-lg object-cover border-2 transition-all duration-200 group-hover:scale-105 ${selectedOptions[type.id]?.id === option.id
                                            ? 'border-blue-500 ring-2 ring-blue-200'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        alt={option.name}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                }
                {type.type === 'Radio' &&
                    <div className="flex flex-wrap gap-2">
                        {type.options.map(option => (
                            <label
                                key={option.id}
                                className={`px-4 py-2 border-2 rounded-lg cursor-pointer transition-all duration-200 ${selectedOptions[type.id]?.id === option.id
                                    ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                <input
                                    onChange={() => chooseOption(type.id, option)}
                                    className='hidden'
                                    type='radio'
                                    value={option.id}
                                    checked={selectedOptions[type.id]?.id === option.id}
                                    name={'variation_type_' + type.id}
                                />
                                {option.name}
                            </label>
                        ))}
                    </div>
                }
            </div>
        )));
    }

    const renderAddToCartButton = () => {
        return (
            <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                        <select
                            value={form.data.quantity}
                            onChange={onQuantityChange}
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        >
                            {Array.from({
                                length: Math.min(10, computedProduct.quantity)
                            }).map((el, i) => (
                                <option key={i} value={i + 1}>{i + 1}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <button
                    onClick={addToCart}
                    className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2'
                    disabled={form.processing}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 5H3m4 8l-1 4h13m-13-4l1 4h13m-13-4v0m13 0v0M9 19a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2z" />
                    </svg>
                    <span>{form.processing ? 'Adding...' : 'Add to Cart'}</span>
                </button>
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        Secure checkout
                    </div>
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                        </svg>
                        Free returns
                    </div>
                </div>
            </div>
        );
    }

    useEffect(() => {
        const idsMap = Object.fromEntries(
            Object.entries(selectedOptions).map(([typeId, option]: [string, VariationTypeOption]) => [typeId, option.id])
        );
        form.setData('option_ids', idsMap);
    }, [selectedOptions]);

    return (
        <>
            <Head>
                <title>{product.title}</title>
                <meta name="title" content={(product.meta_title || product.title).toString()} />
                <meta name="description" content={product.meta_description} />
                <link rel="canonical" href={route('product.show', product.slug)} />

                <meta property="og:title" content={product.meta_title} />
                <meta property="og:description" content={product.meta_description} />
                <meta property="og:image" content={images[0]?.small} />
                <meta property="og:url" content={route('product.show', product.slug)} />
                <meta property="og:type" content="product" />
                <meta property="og :site_name" content={appName} />
            </Head>
            <NavBar />
            <div className="bg-base-200 min-h-screen">
                <div className="container mx-auto px-14 py-8">
                    <nav className="text-sm breadcrumbs mb-6">
                        <ul className="flex items-center space-x-2 text-gray-600">
                            <li><Link href={route('home')} className="hover:text-gray-900">Home</Link></li>
                            <li className="before:content-['/'] before:mx-2">
                                <Link href={route('product.byDepartment', product.department.slug)}
                                    className="hover:text-gray-900">
                                    {product.department.name}
                                </Link>
                            </li>
                            <li className="before:content-['/'] before:mx-2 text-gray-900 font-medium truncate">
                                {product.title}
                            </li>
                        </ul>
                    </nav>

                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="grid gap-0 grid-cols-1 lg:grid-cols-12">
                            <div className="col-span-7 bg-white">
                                <div className="sticky top-8 p-6">
                                    <Carousel images={images} />
                                </div>
                            </div>

                            <div className="col-span-5 p-8 bg-base-200">
                                <div className="max-w-lg">
                                    <div className="mb-4">
                                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-4">
                                            {product.department.name}
                                        </span>
                                        <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">{product.title}</h1>
                                        <div className="flex items-center text-gray-600 mb-6">
                                            <span className="text-sm">Sold by</span>
                                            <Link
                                                href={route('vendor.profile', product.user.store_name)}
                                                className='ml-2 font-semibold text-blue-600 hover:text-blue-700 hover:underline'
                                            >
                                                {product.user.store_name}
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="mb-8 p-4 bg-white rounded-lg border-2 border-gray-200">
                                        <div className="text-4xl font-bold text-gray-900 mb-2">
                                            <CurrencyFormatter amount={computedProduct.price} />
                                        </div>
                                        {computedProduct.quantity != undefined && computedProduct.quantity < 10 && (
                                            <div className='flex items-center text-orange-600 text-sm font-medium'>
                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                Only {computedProduct.quantity} left in stock
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-6">
                                        {renderProductVariationTypes()}
                                        {renderAddToCartButton()}
                                    </div>

                                    <div className="mt-8 pt-8 border-t border-gray-200">
                                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                                            {getContent('product_details', 'page_title')}
                                        </h2>
                                        <div className="prose prose-gray max-w-none wysiwyg-output text-gray-700" dangerouslySetInnerHTML={{
                                            __html: product.description
                                        }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {similarProducts && similarProducts.data.length > 0 && (
                <div className="bg-gray-50 py-16">
                    <div className="container mx-auto px-14">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                {getContent('similar_products', 'title')}
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                {getContent('similar_products', 'description')}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {similarProducts.data.slice(0, 8).map((similarProduct) => (
                                <ProductItem key={similarProduct.id} product={similarProduct} />
                            ))}
                        </div>

                        <div className="text-center mt-12">
                            <Link
                                href={route('product.byDepartment', product.department.slug)}
                                className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                            >
                                View All in {product.department.name}
                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>

    )
}
export default Show
