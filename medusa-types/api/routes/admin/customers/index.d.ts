import { Customer } from "../../../..";
import { DeleteResponse, PaginatedResponse } from "../../../../types/common";
declare const _default: (app: any) => any;
export default _default;
export declare type AdminCustomersRes = {
    customer: Customer;
};
export declare type AdminCustomersDeleteRes = DeleteResponse;
export declare type AdminCustomersListRes = PaginatedResponse & {
    customers: Customer[];
};
export declare const defaultAdminCustomersRelations: string[];
export * from "./create-customer";
export * from "./get-customer";
export * from "./list-customers";
export * from "./update-customer";
