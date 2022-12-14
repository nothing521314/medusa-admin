import "reflect-metadata";
import { Cart, Order, Swap } from "../../../../";
import { DeleteResponse } from "../../../../types/common";
declare const _default: (app: any, container: any) => any;
export default _default;
export declare const defaultStoreCartFields: (keyof Cart)[];
export declare const defaultStoreCartRelations: string[];
export declare type StoreCartsRes = {
    cart: Omit<Cart, "refundable_amount" | "refunded_total">;
};
export declare type StoreCompleteCartRes = {
    type: "cart";
    data: Cart;
} | {
    type: "order";
    data: Order;
} | {
    type: "swap";
    data: Swap;
};
export declare type StoreCartsDeleteRes = DeleteResponse;
export * from "./add-shipping-method";
export * from "./create-cart";
export * from "./create-line-item";
export * from "./create-payment-sessions";
export * from "./set-payment-session";
export * from "./update-cart";
export * from "./update-line-item";
export * from "./update-payment-session";
