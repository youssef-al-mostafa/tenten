import { CartItem } from "./types";
import { router } from '@inertiajs/react';

export const arraysAreEqual = (arr1: unknown[], arr2: unknown[]): boolean => {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((value, index) => value === arr2[index]);
}

export const productRoute = (item: CartItem) => {
    const params = new URLSearchParams(window.location.search);
    Object.entries(item.option_ids).forEach(([typeId, optionId]) => {
        params.append(`options[${typeId}]`, optionId + '');
    })
    return route('product.show', item.product_id + '?' + params.toString());
}

/**
 * Navigate to a route using Inertia router
 * @param routeName - Laravel route name
 * @param params - Route parameters (optional)
 */
export const navigateTo = (routeName: string, params?: any) => {
    router.visit(route(routeName, params));
}

/**
 * Specific navigation helpers for common routes
 */
export const goToVendorProfile = (storeName: string) => {
    navigateTo('vendor.profile', storeName);
}

export const goToProductsPage = () => {
    navigateTo('products.index');
}

export const goToProductDetails = (productId: number | string) => {
    navigateTo('product.show', productId);
}
