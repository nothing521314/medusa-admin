import "reflect-metadata";
import { Order } from "../../../..";
declare const _default: (app: any) => any;
export default _default;
export declare const defaultStoreOrdersRelations: string[];
export declare const defaultStoreOrdersFields: (keyof Order)[];
export declare const allowedStoreOrdersRelations: string[];
export declare const allowedStoreOrdersFields: string[];
export declare type StoreOrdersRes = {
    order: Order;
};
export * from "./lookup-order";
