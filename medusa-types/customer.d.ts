import { Address } from "./address";
import { CustomerGroup } from "./customer-group";
import { SoftDeletableEntity } from "./interfaces";
import { Order } from "./order";
export declare class Customer extends SoftDeletableEntity {
  id?: string;
  email: string;
  phone: string;
  person_in_charge: string;
  name: string;
  address: string;

  orders?: Order[];
  billing_address_id?: string | null;
  metadata?: Record<string, unknown>;
  groups?: CustomerGroup[];
  has_account?: boolean;
  billing_address?: Address;
  shipping_addresses?: Address[];
  password_hash?: string;

  // private beforeInsert;
}
/**
 * @schema customer
 * title: "Customer"
 * description: "Represents a customer"
 * x-resourceId: customer
 * required:
 *   - email
 * properties:
 *   id:
 *     type: string
 *     description: The customer's ID
 *     example: cus_01G2SG30J8C85S4A5CHM2S1NS2
 *   email:
 *     type: string
 *     description: The customer's email
 *     format: email
 *   first_name:
 *     type: string
 *     description: The customer's first name
 *     example: Arno
 *   last_name:
 *     type: string
 *     description: The customer's first name
 *     example: Willms
 *   billing_address_id:
 *     type: string
 *     description: The customer's billing address ID
 *     example: addr_01G8ZH853YPY9B94857DY91YGW
 *   billing_address:
 *     description: Available if the relation `billing_address` is expanded.
 *     $ref: "#/components/schemas/address"
 *   shipping_addresses:
 *     description: Available if the relation `shipping_addresses` is expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/address"
 *   phone:
 *     type: string
 *     description: The customer's phone number
 *     example: 16128234334802
 *   has_account:
 *     type: boolean
 *     description: Whether the customer has an account or not
 *     default: false
 *   orders:
 *     description: Available if the relation `orders` is expanded.
 *     type: array
 *     items:
 *       type: object
 *       description: An order object.
 *   groups:
 *     description: The customer groups the customer belongs to. Available if the relation `groups` is expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/customer_group"
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
