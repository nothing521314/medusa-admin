import { Address, ClaimOrder, Discount, LineItem, Payment, Region, ShippingMethod } from "../models";
export declare type FulFillmentItemType = {
    item_id: string;
    quantity: number;
};
export declare type FulfillmentItemPartition = {
    shipping_method: ShippingMethod;
    items: LineItem[];
};
export declare type CreateShipmentConfig = {
    metadata?: Record<string, unknown>;
    no_notification?: boolean;
};
export declare type CreateFulfillmentOrder = Omit<ClaimOrder, "beforeInsert"> & {
    is_claim?: boolean;
    email?: string;
    payments: Payment[];
    discounts: Discount[];
    currency_code: string;
    tax_rate: number | null;
    region_id: string;
    region?: Region;
    is_swap?: boolean;
    display_id: number;
    billing_address: Address;
    items: LineItem[];
    shipping_methods: ShippingMethod[];
    no_notification: boolean;
};
