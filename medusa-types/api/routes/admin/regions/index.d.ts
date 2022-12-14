import { Region } from "../../../..";
import { DeleteResponse, PaginatedResponse } from "../../../../types/common";
import "reflect-metadata";
import { FlagRouter } from "../../../../utils/flag-router";
declare const _default: (app: any, featureFlagRouter: FlagRouter) => any;
export default _default;
export declare const defaultAdminRegionFields: (keyof Region)[];
export declare const defaultAdminRegionRelations: string[];
export declare class AdminRegionsRes {
    region: Region;
}
export declare type AdminRegionsListRes = PaginatedResponse & {
    regions: Region[];
};
export declare type AdminRegionsDeleteRes = DeleteResponse;
export declare class FulfillmentOption {
    provider_id: string;
    options: unknown[];
}
export declare class AdminGetRegionsRegionFulfillmentOptionsRes {
    fulfillment_options: FulfillmentOption[];
}
export * from "./list-regions";
export * from "./update-region";
export * from "./create-region";
export * from "./add-country";
export * from "./add-payment-provider";
export * from "./add-fulfillment-provider";
