"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require(".");
var price_selection_1 = require("../../../../types/price-selection");
var validator_1 = require("../../../../utils/validator");
/**
 * @oas [get] /products/{id}
 * operationId: GetProductsProduct
 * summary: Get a Product
 * description: "Retrieves a Product."
 * parameters:
 *   - (path) id=* {string} The id of the Product.
 *   - (query) cart_id {string} The ID of the customer's cart.
 *   - (query) region_id {string} The ID of the region the customer is using. This is helpful to ensure correct prices are retrieved for a region.
 *   - in: query
 *     name: currency_code
 *     style: form
 *     explode: false
 *     description: The 3 character ISO currency code to set prices based on. This is helpful to ensure correct prices are retrieved for a currency.
 *     schema:
 *       type: string
 *       externalDocs:
 *         url: https://en.wikipedia.org/wiki/ISO_4217#Active_codes
 *         description: See a list of codes.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.products.retrieve(product_id)
 *       .then(({ product }) => {
 *         console.log(product.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/store/products/{id}'
 * tags:
 *   - Product
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             product:
 *               $ref: "#/components/schemas/product"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */
exports.default = (function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, validated, customer_id, productService, pricingService, cartService, regionService, rawProduct, regionId, currencyCode, cart, region, _a, product;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                id = req.params.id;
                return [4 /*yield*/, (0, validator_1.validator)(price_selection_1.PriceSelectionParams, req.query)];
            case 1:
                validated = _c.sent();
                customer_id = (_b = req.user) === null || _b === void 0 ? void 0 : _b.customer_id;
                productService = req.scope.resolve("productService");
                pricingService = req.scope.resolve("pricingService");
                cartService = req.scope.resolve("cartService");
                regionService = req.scope.resolve("regionService");
                return [4 /*yield*/, productService.retrieve(id, {
                        relations: _1.defaultStoreProductsRelations,
                    })];
            case 2:
                rawProduct = _c.sent();
                regionId = validated.region_id;
                currencyCode = validated.currency_code;
                if (!validated.cart_id) return [3 /*break*/, 5];
                return [4 /*yield*/, cartService.retrieve(validated.cart_id, {
                        select: ["id", "region_id"],
                    })];
            case 3:
                cart = _c.sent();
                return [4 /*yield*/, regionService.retrieve(cart.region_id, {
                        select: ["id", "currency_code"],
                    })];
            case 4:
                region = _c.sent();
                regionId = region.id;
                currencyCode = region.currency_code;
                _c.label = 5;
            case 5: return [4 /*yield*/, pricingService.setProductPrices([rawProduct], {
                    cart_id: validated.cart_id,
                    customer_id: customer_id,
                    region_id: regionId,
                    currency_code: currencyCode,
                    include_discount_prices: true,
                })];
            case 6:
                _a = __read.apply(void 0, [_c.sent(), 1]), product = _a[0];
                res.json({ product: product });
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=get-product.js.map