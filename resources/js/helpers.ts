import { CartItem } from "./types";

export const arraysAreEqual = (arr1: unknown[], arr2: unknown[]): boolean =>{
    if (arr1.length !== arr2.length) return false;
    return arr1.every((value,index) => value === arr2[index]);
}

export const productRoute = (item : CartItem) => {
    const params = new URLSearchParams(window.location.search);
    Object.entries(item.option_ids).forEach(([typeId, optionId]) => {
        params.append(`options[${typeId}]`, optionId + '');
    })
    return route('product.show', item.product_id + '?' + params.toString());
}
