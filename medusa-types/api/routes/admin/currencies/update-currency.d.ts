import { Currency } from "../../../../models";
import { ExtendedRequest } from "../../../../types/global";
/**
 * @oas [post] /currencies/{code}
 * operationId: "PostCurrenciesCurrency"
 * summary: "Update a Currency"
 * description: "Update a Currency"
 * x-authenticated: true
 * parameters:
 *   - (path) code=* {string} The code of the Currency.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           includes_tax:
 *             type: boolean
 *             description: "[EXPERIMENTAL] Tax included in prices of currency."
 * tags:
 *   - Currency
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             currency:
 *                 $ref: "#/components/schemas/currency"
 */
declare const _default: (req: ExtendedRequest<Currency>, res: any) => Promise<void>;
export default _default;
export declare class AdminPostCurrenciesCurrencyReq {
    includes_tax?: boolean;
}
