import "reflect-metadata";
import { Product } from "../../../..";
import { PaginatedResponse } from "../../../../types/common";
declare const _default: (app: any) => any;
export default _default;
export declare const defaultStoreProductsRelations: string[];
export * from "./list-products";
export * from "./search";
export declare type StoreProductsRes = {
    product: Product;
};
export declare type StorePostSearchRes = {
    hits: unknown[];
    [k: string]: unknown;
};
export declare type StoreProductsListRes = PaginatedResponse & {
    products: Product[];
};
