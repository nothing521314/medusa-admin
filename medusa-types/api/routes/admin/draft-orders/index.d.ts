import { Cart, DraftOrder, Order } from "../../../..";
import { DeleteResponse, PaginatedResponse } from "../../../../types/common";
declare const _default: (app: any) => any;
export default _default;
export declare const defaultAdminDraftOrdersRelations: string[];
export declare const defaultAdminDraftOrdersCartRelations: string[];
export declare const defaultAdminDraftOrdersCartFields: (keyof Cart)[];
export declare const defaultAdminDraftOrdersFields: (keyof DraftOrder)[];
export declare const allowedAdminDraftOrdersFields: string[];
export declare const allowedAdminDraftOrdersRelations: string[];
export declare type AdminPostDraftOrdersDraftOrderRegisterPaymentRes = {
    order: Order;
};
export declare type AdminDraftOrdersRes = {
    draft_order: DraftOrder;
};
export declare type AdminDraftOrdersDeleteRes = DeleteResponse;
export declare type AdminDraftOrdersListRes = PaginatedResponse & {
    draft_orders: DraftOrder[];
};
export * from "./create-draft-order";
export * from "./create-line-item";
export * from "./delete-draft-order";
export * from "./delete-line-item";
export * from "./get-draft-order";
export * from "./list-draft-orders";
export * from "./register-payment";
export * from "./update-draft-order";
export * from "./update-line-item";
