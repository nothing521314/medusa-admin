import { OrderItemChange } from "./order-item-change";
import { SoftDeletableEntity } from "../interfaces";
import { LineItem } from "./line-item";
import { Order } from "./order";
export declare class OrderEdit extends SoftDeletableEntity {
    order_id: string;
    order: Order;
    changes: OrderItemChange[];
    internal_note?: string;
    created_by: string;
    requested_by?: string;
    requested_at?: Date;
    confirmed_by?: string;
    confirmed_at?: Date;
    declined_by?: string;
    declined_reason?: string;
    declined_at?: Date;
    canceled_by?: string;
    canceled_at?: Date;
    subtotal: number;
    discount_total?: number;
    tax_total: number;
    total: number;
    difference_due: number;
    items: LineItem[];
    removed_items: LineItem[];
    private beforeInsert;
}
/**
 * @schema order_edit
 * title: "Order Edit"
 * description: "Order edit keeps track of order items changes."
 * x-resourceId: order_edit
 * required:
 *   - order_id
 *   - order
 *   - changes
 *   - created_by
 * properties:
 *   id:
 *     type: string
 *     description: The order edit's ID
 *     example: oe_01G8TJSYT9M6AVS5N4EMNFS1EK
 *   order_id:
 *     type: string
 *     description: The ID of the order that is edited
 *     example: order_01G2SG30J8C85S4A5CHM2S1NS2
 *   order:
 *     description: Order object
 *     $ref: "#/components/schemas/order"
 *   changes:
 *     type: array
 *     description: Line item changes array.
 *     items:
 *       $ref: "#/components/schemas/order_item_change"
 *   internal_note:
 *     description: "An optional note with additional details about the order edit."
 *     type: string
 *     example: Included two more items B to the order.
 *   created_by:
 *     type: string
 *     description: "The unique identifier of the user or customer who created the order edit."
 *   requested_by:
 *     type: string
 *     description: "The unique identifier of the user or customer who requested the order edit."
 *   requested_at:
 *     type: string
 *     description: "The date with timezone at which the edit was requested."
 *     format: date-time
 *   confirmed_by:
 *     type: string
 *     description: "The unique identifier of the user or customer who confirmed the order edit."
 *   confirmed_at:
 *     type: string
 *     description: "The date with timezone at which the edit was confirmed."
 *     format: date-time
 *   declined_by:
 *     type: string
 *     description: "The unique identifier of the user or customer who declined the order edit."
 *   declined_at:
 *     type: string
 *     description: "The date with timezone at which the edit was declined."
 *     format: date-time
 *   declined_reason:
 *     description: "An optional note why  the order edit is declined."
 *     type: string
 *   subtotal:
 *     type: integer
 *     description: The subtotal for line items computed from changes.
 *     example: 8000
 *   discount_total:
 *     type: integer
 *     description: The total of discount
 *     example: 800
 *   tax_total:
 *     type: integer
 *     description: The total of tax
 *     example: 0
 *   total:
 *     type: integer
 *     description: The total amount of the edited order.
 *     example: 8200
 *   difference_due:
 *     type: integer
 *     description: The difference between the total amount of the order and total amount of edited order.
 *     example: 8200
 *   items:
 *     type: array
 *     description: Computed line items from the changes.
 *     items:
 *       $ref: "#/components/schemas/line_item"
 *   removed_items:
 *     type: array
 *     description: Computed line items from the changes that have been marked as deleted.
 *     removed_items:
 *       $ref: "#/components/schemas/line_item"
 */
