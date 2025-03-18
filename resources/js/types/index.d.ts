import { Config } from 'ziggy-js';

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export type PaginationProps<T> = {
    data : Array<T>;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    ziggy: Config & { location: string };
    totalPrice: number;
    totalQuantity: number;
    cartItems: CartItem[];
};

export type Product = {
    id: number;
    title : string;
    slug : string;
    price : number;
    quantity : number;
    image: string;
    images: Image[];
    short_description: string;
    description: string;
    user: {
        id:number;
        name:string;
    };
    department: {
        id: number;
        name: string;
    };
    variationTypes: VariationType[];
    variation: Array<{
        id: number;
        variation_type_option_ids: number[];
        quantity: number;
        price: number;
    }>;
}

export type VariationType = {
    id: number;
    name: string;
    type: 'Select' | 'Radio' | 'Image';
    options: VariationTypeOption[];
}

export type VariationTypeOption = {
    id: number;
    name: string;
    images: Image[];
    type: VariationType;
}

export type CartItem = {
    id: number;
    product_id: number;
    title: string;
    slug: string;
    price: number;
    quantity: number;
    image: string;
    option_ids: Record<string, number>;
    options: VariationTypeOption[];
}

export type Image = {
    id: number;
    thumb: string;
    small: string;
    large: string;
}
