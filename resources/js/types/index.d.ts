import { Config } from 'ziggy-js';

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export type Product = {
    id: number;
    title : string;
    slug : string;
    price : number;
    quantity : number;
    image: string;
    user: {
        id:number;
        name:string;
    };
    department: {
        id: number;
        name: string;
    }
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
};
