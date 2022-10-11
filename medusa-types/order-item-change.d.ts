import { SoftDeletableEntity } from "../interfaces";
import { OrderEdit } from "./order-edit";
import { LineItem } from "./line-item";
export declare enum OrderEditItemChangeType {
    ITEM_ADD = "item_add",
    ITEM_REMOVE = "item_remove",
    ITEM_UPDATE = "item_update"
}
export declare class OrderItemChange extends SoftDeletableEntity {
    type: OrderEditItemChangeType;
    order_edit_id: string;
    order_edit: OrderEdit;
    original_line_item_id?: string;
    original_line_item?: LineItem;
    line_item_id?: string;
    line_item?: LineItem;
    private beforeInsert;
}
/**
 * @schema order_item_change
 * title: "Order Item Change"
 * description: "Represents an order edit item change"
 * x-resourceId: order_item_change
 * required:
 *   - type
 *   - order_edit_id
 * properties:
 *   id:
 *     type: string
 *     description: The order item change's ID
 *     example: oic_01G8TJSYT9M6AVS5N4EMNFS1EK
 *   type:
 *     type: string
 *     description: The order's status
 *     enum:
 *       - item_add
 *       - item_remove
 *       - item_update
 *   order_edit_id:
 *     type: string
 *     description: The ID of the order edit
 *     example: oe_01G2SG30J8C85S4A5CHM2S1NS2
 *   order_edit:
 *     description: Order edit object
 *     $ref: "#/components/schemas/order_edit"
 *   original_line_item_id:
 *      type: string
 *      description: The ID of the original line item in the order
 *      example: item_01G8ZC9GWT6B2GP5FSXRXNFNGN
 *   original_line_item:
 *      description: Original line item object.
 *      $ref: "#/components/schemas/line_item"
 *   line_item_id:
 *      type: string
 *      description: The ID of the cloned line item.
 *      example: item_01G8ZC9GWT6B2GP5FSXRXNFNGN
 *   line_item:
 *      description: Line item object.
 *      $ref: "#/components/schemas/line_item"
 */
