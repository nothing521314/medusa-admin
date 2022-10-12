import { Address } from "./address";
import { Cart } from "./cart";
import { Fulfillment } from "./fulfillment";
import { LineItem } from "./line-item";
import { Order } from "./order";
import { Payment } from "./payment";
import { Return } from "./return";
import { ShippingMethod } from "./shipping-method";
import { SoftDeletableEntity } from "./interfaces";
export declare enum SwapFulfillmentStatus {
    NOT_FULFILLED = "not_fulfilled",
    FULFILLED = "fulfilled",
    SHIPPED = "shipped",
    PARTIALLY_SHIPPED = "partially_shipped",
    CANCELED = "canceled",
    REQUIRES_ACTION = "requires_action"
}
export declare enum SwapPaymentStatus {
    NOT_PAID = "not_paid",
    AWAITING = "awaiting",
    CAPTURED = "captured",
    CONFIRMED = "confirmed",
    CANCELED = "canceled",
    DIFFERENCE_REFUNDED = "difference_refunded",
    PARTIALLY_REFUNDED = "partially_refunded",
    REFUNDED = "refunded",
    REQUIRES_ACTION = "requires_action"
}
export declare class Swap extends SoftDeletableEntity {
    fulfillment_status: SwapFulfillmentStatus;
    payment_status: SwapPaymentStatus;
    order_id: string;
    order: Order;
    additional_items: LineItem[];
    return_order: Return;
    fulfillments: Fulfillment[];
    payment: Payment;
    difference_due: number;
    shipping_address_id: string;
    shipping_address: Address;
    shipping_methods: ShippingMethod[];
    cart_id: string;
    cart: Cart;
    confirmed_at: Date;
    canceled_at: Date;
    no_notification: boolean;
    allow_backorder: boolean;
    idempotency_key: string;
    metadata: Record<string, unknown>;
    private beforeInsert;
}
/**
 * @schema swap
 * title: "Swap"
 * description: "Swaps can be created when a Customer wishes to exchange Products that they have purchased to different Products. Swaps consist of a Return of previously purchased Products and a Fulfillment of new Products, the amount paid for the Products being returned will be used towards payment for the new Products. In the case where the amount paid for the the Products being returned exceed the amount to be paid for the new Products, a Refund will be issued for the difference."
 * x-resourceId: swap
 * required:
 *   - fulfillment_status
 *   - payment_status
 *   - order_id
 * properties:
 *   id:
 *     type: string
 *     description: The swap's ID
 *     example: swap_01F0YET86Y9G92D3YDR9Y6V676
 *   fulfillment_status:
 *     description: "The status of the Fulfillment of the Swap."
 *     type: string
 *     enum:
 *       - not_fulfilled
 *       - fulfilled
 *       - shipped
 *       - canceled
 *       - requires_action
 *     example: not_fulfilled
 *   payment_status:
 *     description: "The status of the Payment of the Swap. The payment may either refer to the refund of an amount or the authorization of a new amount."
 *     type: string
 *     enum:
 *       - not_paid
 *       - awaiting
 *       - captured
 *       - confirmed
 *       - canceled
 *       - difference_refunded
 *       - partially_refunded
 *       - refunded
 *       - requires_action
 *     example: not_paid
 *   order_id:
 *     description: "The ID of the Order where the Line Items to be returned where purchased."
 *     type: string
 *     example: order_01G8TJSYT9M6AVS5N4EMNFS1EK
 *   order:
 *     description: An order object. Available if the relation `order` is expanded.
 *     type: object
 *   additional_items:
 *     description: The new Line Items to ship to the Customer. Available if the relation `additional_items` is expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/line_item"
 *   return_order:
 *     description: A return order object. The Return that is issued for the return part of the Swap. Available if the relation `return_order` is expanded.
 *     type: object
 *   fulfillments:
 *     description: The Fulfillments used to send the new Line Items. Available if the relation `fulfillments` is expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/fulfillment"
 *   payment:
 *     description: The Payment authorized when the Swap requires an additional amount to be charged from the Customer. Available if the relation `payment` is expanded.
 *     $ref: "#/components/schemas/payment"
 *   difference_due:
 *     description: "The difference that is paid or refunded as a result of the Swap. May be negative when the amount paid for the returned items exceed the total of the new Products."
 *     type: integer
 *     example: 0
 *   shipping_address_id:
 *     description: The Address to send the new Line Items to - in most cases this will be the same as the shipping address on the Order.
 *     type: string
 *     example: addr_01G8ZH853YPY9B94857DY91YGW
 *   shipping_address:
 *     description: Available if the relation `shipping_address` is expanded.
 *     $ref: "#/components/schemas/address"
 *   shipping_methods:
 *     description: The Shipping Methods used to fulfill the additional items purchased. Available if the relation `shipping_methods` is expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/shipping_method"
 *   cart_id:
 *     description: "The id of the Cart that the Customer will use to confirm the Swap."
 *     type: string
 *     example: cart_01G8ZH853Y6TFXWPG5EYE81X63
 *   cart:
 *     description: A cart object. Available if the relation `cart` is expanded.
 *     type: object
 *   allow_backorder:
 *     description: "If true, swaps can be completed with items out of stock"
 *     type: boolean
 *     default: false
 *   idempotency_key:
 *     type: string
 *     description: Randomly generated key used to continue the completion of the swap in case of failure.
 *     externalDocs:
 *       url: https://docs.medusajs.com/advanced/backend/payment/overview#idempotency-key
 *       description: Learn more how to use the idempotency key.
 *   confirmed_at:
 *     description: "The date with timezone at which the Swap was confirmed by the Customer."
 *     type: string
 *     format: date-time
 *   canceled_at:
 *     description: "The date with timezone at which the Swap was canceled."
 *     type: string
 *     format: date-time
 *   no_notification:
 *     description: "If set to true, no notification will be sent related to this swap"
 *     type: boolean
 *     example: false
 *   created_at:
 *     type: string
 *     description: "The date with timezone at which the resource was created."
 *     format: date-time
 *   updated_at:
 *     type: string
 *     description: "The date with timezone at which the resource was updated."
 *     format: date-time
 *   deleted_at:
 *     type: string
 *     description: "The date with timezone at which the resource was deleted."
 *     format: date-time
 *   metadata:
 *     type: object
 *     description: An optional key-value map with additional details
 *     example: {car: "white"}
 */