import "reflect-metadata";
import { ProductCollection } from "../../../..";
import { DeleteResponse, PaginatedResponse } from "../../../../types/common";
declare const _default: (app: any) => any;
export default _default;
export declare const defaultAdminCollectionsFields: string[];
export declare const defaultAdminCollectionsRelations: string[];
export declare type AdminCollectionsListRes = PaginatedResponse & {
    collections: ProductCollection[];
};
export declare type AdminCollectionsDeleteRes = DeleteResponse;
export declare type AdminCollectionsRes = {
    collection: ProductCollection;
};
export * from "./add-products";
export * from "./create-collection";
export * from "./delete-collection";
export * from "./get-collection";
export * from "./list-collections";
export * from "./remove-products";
export * from "./update-collection";
