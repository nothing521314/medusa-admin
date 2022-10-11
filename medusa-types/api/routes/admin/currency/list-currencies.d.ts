import { Currency } from "../../../../models";
import { ExtendedRequest } from "../../../../types/global";
import { FindPaginationParams } from "../../../../types/common";
/**
 * @oas [get] /currencies
 * operationId: "GetCurrencies"
 * summary: "List Currency"
 * description: "Retrieves a list of Currency"
 * x-authenticated: true
 * parameters:
 *   - (query) code {string} Code of the currency to search for.
 *   - (query) includes_tax {boolean} Search for tax inclusive currencies.
 *   - (query) order {string} to retrieve products in.
 *   - (query) offset {string} How many products to skip in the result.
 *   - (query) limit {string} Limit the number of products returned.
 * tags:
 *   - Currency
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             count:
 *               description: The number of Currency.
 *               type: integer
 *             offset:
 *               description: The offset of the Currency query.
 *               type: integer
 *             limit:
 *               description: The limit of the currency query.
 *               type: integer
 *             currencies:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/currency"
 */
declare const _default: (req: ExtendedRequest<Currency>, res: any) => Promise<void>;
export default _default;
export declare class AdminGetCurrenciesParams extends FindPaginationParams {
    code?: string;
    includes_tax?: boolean;
    order?: string;
}
