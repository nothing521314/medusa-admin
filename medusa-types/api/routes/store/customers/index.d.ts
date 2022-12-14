import { Customer, Order } from "../../../..";
import { PaginatedResponse } from "../../../../types/common";
declare const _default: (app: any, container: any) => any;
export default _default;
export declare const defaultStoreCustomersRelations: string[];
export declare const defaultStoreCustomersFields: (keyof Customer)[];
export declare const allowedStoreCustomersRelations: string[];
export declare const allowedStoreCustomersFields: string[];
export declare type StoreCustomersRes = {
    customer: Omit<Customer, "password_hash">;
};
export declare type StoreCustomersListOrdersRes = PaginatedResponse & {
    orders: Order[];
};
export declare type StoreCustomersListPaymentMethodsRes = {
    payment_methods: {
        provider_id: string;
        data: object;
    }[];
};
export * from "./create-address";
export * from "./create-customer";
export * from "./list-orders";
export * from "./reset-password";
export * from "./reset-password-token";
export * from "./update-address";
export * from "./update-customer";
