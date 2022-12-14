import { Customer } from "@medusa-types";

/**
 * @oas [post] /customers
 * operationId: "PostCustomers"
 * summary: "Create a Customer"
 * description: "Creates a Customer."
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - email
 *           - first_name
 *           - last_name
 *           - password
 *         properties:
 *           email:
 *             type: string
 *             description: The customer's email.
 *             format: email
 *           first_name:
 *             type: string
 *             description: The customer's first name.
 *           last_name:
 *             type: string
 *             description: The customer's last name.
 *           password:
 *             type: string
 *             description: The customer's password.
 *             format: password
 *           phone:
 *             type: string
 *             description: The customer's phone number.
 *           metadata:
 *             description: An optional set of key-value pairs to hold additional information.
 *             type: object
 * tags:
 *   - Customer
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.customers.create({
 *         email: 'user@example.com',
 *         first_name: 'Caterina',
 *         last_name: 'Yost',
 *         password: 'supersecret'
 *       })
 *       .then(({ customer }) => {
 *         console.log(customer.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/customers' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "email": "user@example.com",
 *           "first_name": "Caterina",
 *           "last_name": "Yost",
 *           "password": "supersecret"
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * responses:
 *   201:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             customer:
 *               $ref: "#/components/schemas/customer"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */
declare const _default: (req: any, res: any) => Promise<void>;
export default _default;
export declare class AdminPostCustomersReq extends Customer {
  // email: string;
  // name: string;
  // phone: string;
  // person_in_charge: string;
  // address: string;
  // metadata?: Record<string, unknown>;
}
