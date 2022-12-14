"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminPostOrdersOrderSwapsReq = void 0;
var class_validator_1 = require("class-validator");
var _1 = require(".");
var medusa_core_utils_1 = require("medusa-core-utils");
var class_transformer_1 = require("class-transformer");
var validator_1 = require("../../../../utils/validator");
/**
 * @oas [post] /order/{id}/swaps
 * operationId: "PostOrdersOrderSwaps"
 * summary: "Create a Swap"
 * description: "Creates a Swap. Swaps are used to handle Return of previously purchased goods and Fulfillment of replacements simultaneously."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Order.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - return_items
 *         properties:
 *           return_items:
 *             description: The Line Items to return as part of the Swap.
 *             type: array
 *             items:
 *               required:
 *                 - item_id
 *                 - quantity
 *               properties:
 *                 item_id:
 *                   description: The ID of the Line Item that will be claimed.
 *                   type: string
 *                 quantity:
 *                   description: The number of items that will be returned
 *                   type: integer
 *                 reason_id:
 *                   description: The ID of the Return Reason to use.
 *                   type: string
 *                 note:
 *                   description: An optional note with information about the Return.
 *                   type: string
 *           return_shipping:
 *             description: How the Swap will be returned.
 *             type: object
 *             required:
 *               - option_id
 *             properties:
 *               option_id:
 *                 type: string
 *                 description: The ID of the Shipping Option to create the Shipping Method from.
 *               price:
 *                 type: integer
 *                 description: The price to charge for the Shipping Method.
 *           additional_items:
 *             description: The new items to send to the Customer.
 *             type: array
 *             items:
 *               required:
 *                 - variant_id
 *                 - quantity
 *               properties:
 *                 variant_id:
 *                   description: The ID of the Product Variant to ship.
 *                   type: string
 *                 quantity:
 *                   description: The quantity of the Product Variant to ship.
 *                   type: integer
 *           custom_shipping_options:
 *             description: The custom shipping options to potentially create a Shipping Method from.
 *             type: array
 *             items:
 *               required:
 *                 - option_id
 *                 - price
 *               properties:
 *                 option_id:
 *                   description: The ID of the Shipping Option to override with a custom price.
 *                   type: string
 *                 price:
 *                   description: The custom price of the Shipping Option.
 *                   type: integer
 *           no_notification:
 *             description: If set to true no notification will be send related to this Swap.
 *             type: boolean
 *           allow_backorder:
 *             description: If true, swaps can be completed with items out of stock
 *             type: boolean
 *             default: true
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.orders.createSwap(order_id, {
 *         return_items: [
 *           {
 *             item_id,
 *             quantity: 1
 *           }
 *         ]
 *       })
 *       .then(({ order }) => {
 *         console.log(order.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/orders/{id}/swaps' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "return_items": [
 *             {
 *               "item_id": "asfasf",
 *               "quantity": 1
 *             }
 *           ]
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Swap
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             order:
 *               $ref: "#/components/schemas/order"
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
exports.default = (function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, validated, idempotencyKeyService, orderService, swapService, returnService, manager, headerKey, idempotencyKey, error_1, inProgress, err, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                id = req.params.id;
                return [4 /*yield*/, (0, validator_1.validator)(AdminPostOrdersOrderSwapsReq, req.body)];
            case 1:
                validated = _b.sent();
                idempotencyKeyService = req.scope.resolve("idempotencyKeyService");
                orderService = req.scope.resolve("orderService");
                swapService = req.scope.resolve("swapService");
                returnService = req.scope.resolve("returnService");
                manager = req.scope.resolve("manager");
                headerKey = req.get("Idempotency-Key") || "";
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, , 5]);
                return [4 /*yield*/, manager.transaction(function (transactionManager) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, idempotencyKeyService
                                        .withTransaction(transactionManager)
                                        .initializeRequest(headerKey, req.method, req.params, req.path)];
                                case 1:
                                    idempotencyKey = _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 3:
                _b.sent();
                return [3 /*break*/, 5];
            case 4:
                error_1 = _b.sent();
                res.status(409).send("Failed to create idempotency key");
                return [2 /*return*/];
            case 5:
                res.setHeader("Access-Control-Expose-Headers", "Idempotency-Key");
                res.setHeader("Idempotency-Key", idempotencyKey.idempotency_key);
                inProgress = true;
                err = false;
                _b.label = 6;
            case 6:
                if (!inProgress) return [3 /*break*/, 15];
                _a = idempotencyKey.recovery_point;
                switch (_a) {
                    case "started": return [3 /*break*/, 7];
                    case "swap_created": return [3 /*break*/, 9];
                    case "finished": return [3 /*break*/, 11];
                }
                return [3 /*break*/, 12];
            case 7: return [4 /*yield*/, manager.transaction(function (transactionManager) { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, key, error;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, idempotencyKeyService
                                    .withTransaction(transactionManager)
                                    .workStage(idempotencyKey.idempotency_key, function (manager) { return __awaiter(void 0, void 0, void 0, function () {
                                    var order, swap, returnOrder;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, orderService
                                                    .withTransaction(manager)
                                                    .retrieve(id, {
                                                    select: ["refunded_total", "total"],
                                                    relations: [
                                                        "items",
                                                        "items.tax_lines",
                                                        "swaps",
                                                        "swaps.additional_items",
                                                        "swaps.additional_items.tax_lines",
                                                    ],
                                                })];
                                            case 1:
                                                order = _a.sent();
                                                return [4 /*yield*/, swapService
                                                        .withTransaction(manager)
                                                        .create(order, validated.return_items, validated.additional_items, validated.return_shipping, {
                                                        idempotency_key: idempotencyKey.idempotency_key,
                                                        no_notification: validated.no_notification,
                                                        allow_backorder: validated.allow_backorder,
                                                    })];
                                            case 2:
                                                swap = _a.sent();
                                                return [4 /*yield*/, swapService
                                                        .withTransaction(manager)
                                                        .createCart(swap.id, validated.custom_shipping_options)];
                                            case 3:
                                                _a.sent();
                                                return [4 /*yield*/, returnService
                                                        .withTransaction(manager)
                                                        .retrieveBySwap(swap.id)];
                                            case 4:
                                                returnOrder = _a.sent();
                                                return [4 /*yield*/, returnService
                                                        .withTransaction(manager)
                                                        .fulfill(returnOrder.id)];
                                            case 5:
                                                _a.sent();
                                                return [2 /*return*/, {
                                                        recovery_point: "swap_created",
                                                    }];
                                        }
                                    });
                                }); })];
                            case 1:
                                _a = _b.sent(), key = _a.key, error = _a.error;
                                if (error) {
                                    inProgress = false;
                                    err = error;
                                }
                                else {
                                    idempotencyKey = key;
                                }
                                return [2 /*return*/];
                        }
                    });
                }); })];
            case 8:
                _b.sent();
                return [3 /*break*/, 14];
            case 9: return [4 /*yield*/, manager.transaction(function (transactionManager) { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, key, error;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, idempotencyKeyService
                                    .withTransaction(transactionManager)
                                    .workStage(idempotencyKey.idempotency_key, function (transactionManager) { return __awaiter(void 0, void 0, void 0, function () {
                                    var swaps, order;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, swapService
                                                    .withTransaction(transactionManager)
                                                    .list({
                                                    idempotency_key: idempotencyKey.idempotency_key,
                                                })];
                                            case 1:
                                                swaps = _a.sent();
                                                if (!swaps.length) {
                                                    throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.INVALID_DATA, "Swap not found");
                                                }
                                                return [4 /*yield*/, orderService
                                                        .withTransaction(transactionManager)
                                                        .retrieve(id, {
                                                        select: _1.defaultAdminOrdersFields,
                                                        relations: _1.defaultAdminOrdersRelations,
                                                    })];
                                            case 2:
                                                order = _a.sent();
                                                return [2 /*return*/, {
                                                        response_code: 200,
                                                        response_body: { order: order },
                                                    }];
                                        }
                                    });
                                }); })];
                            case 1:
                                _a = _b.sent(), key = _a.key, error = _a.error;
                                if (error) {
                                    inProgress = false;
                                    err = error;
                                }
                                else {
                                    idempotencyKey = key;
                                }
                                return [2 /*return*/];
                        }
                    });
                }); })];
            case 10:
                _b.sent();
                return [3 /*break*/, 14];
            case 11:
                {
                    inProgress = false;
                    return [3 /*break*/, 14];
                }
                _b.label = 12;
            case 12: return [4 /*yield*/, manager.transaction(function (transactionManager) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, idempotencyKeyService
                                    .withTransaction(transactionManager)
                                    .update(idempotencyKey.idempotency_key, {
                                    recovery_point: "finished",
                                    response_code: 500,
                                    response_body: { message: "Unknown recovery point" },
                                })];
                            case 1:
                                idempotencyKey = _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); })];
            case 13:
                _b.sent();
                return [3 /*break*/, 14];
            case 14: return [3 /*break*/, 6];
            case 15:
                if (err) {
                    throw err;
                }
                res.status(idempotencyKey.response_code).json(idempotencyKey.response_body);
                return [2 /*return*/];
        }
    });
}); });
var AdminPostOrdersOrderSwapsReq = /** @class */ (function () {
    function AdminPostOrdersOrderSwapsReq() {
        this.custom_shipping_options = [];
        this.allow_backorder = true;
    }
    __decorate([
        (0, class_validator_1.IsArray)(),
        (0, class_validator_1.IsNotEmpty)(),
        (0, class_validator_1.ValidateNested)({ each: true }),
        (0, class_transformer_1.Type)(function () { return ReturnItem; }),
        __metadata("design:type", Array)
    ], AdminPostOrdersOrderSwapsReq.prototype, "return_items", void 0);
    __decorate([
        (0, class_validator_1.IsObject)(),
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.ValidateNested)(),
        (0, class_transformer_1.Type)(function () { return ReturnShipping; }),
        __metadata("design:type", ReturnShipping)
    ], AdminPostOrdersOrderSwapsReq.prototype, "return_shipping", void 0);
    __decorate([
        (0, class_validator_1.IsArray)(),
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.ValidateNested)({ each: true }),
        (0, class_transformer_1.Type)(function () { return AdditionalItem; }),
        __metadata("design:type", Array)
    ], AdminPostOrdersOrderSwapsReq.prototype, "additional_items", void 0);
    __decorate([
        (0, class_validator_1.IsArray)(),
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.ValidateNested)({ each: true }),
        (0, class_transformer_1.Type)(function () { return CustomShippingOption; }),
        __metadata("design:type", Array)
    ], AdminPostOrdersOrderSwapsReq.prototype, "custom_shipping_options", void 0);
    __decorate([
        (0, class_validator_1.IsBoolean)(),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", Boolean)
    ], AdminPostOrdersOrderSwapsReq.prototype, "no_notification", void 0);
    __decorate([
        (0, class_validator_1.IsBoolean)(),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", Boolean)
    ], AdminPostOrdersOrderSwapsReq.prototype, "allow_backorder", void 0);
    return AdminPostOrdersOrderSwapsReq;
}());
exports.AdminPostOrdersOrderSwapsReq = AdminPostOrdersOrderSwapsReq;
var ReturnItem = /** @class */ (function () {
    function ReturnItem() {
    }
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], ReturnItem.prototype, "item_id", void 0);
    __decorate([
        (0, class_validator_1.IsNumber)(),
        (0, class_validator_1.IsNotEmpty)(),
        (0, class_validator_1.Min)(1),
        __metadata("design:type", Number)
    ], ReturnItem.prototype, "quantity", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)(),
        __metadata("design:type", String)
    ], ReturnItem.prototype, "reason_id", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)(),
        __metadata("design:type", String)
    ], ReturnItem.prototype, "note", void 0);
    return ReturnItem;
}());
var ReturnShipping = /** @class */ (function () {
    function ReturnShipping() {
    }
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], ReturnShipping.prototype, "option_id", void 0);
    __decorate([
        (0, class_validator_1.IsInt)(),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", Number)
    ], ReturnShipping.prototype, "price", void 0);
    return ReturnShipping;
}());
var CustomShippingOption = /** @class */ (function () {
    function CustomShippingOption() {
    }
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], CustomShippingOption.prototype, "option_id", void 0);
    __decorate([
        (0, class_validator_1.IsInt)(),
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", Number)
    ], CustomShippingOption.prototype, "price", void 0);
    return CustomShippingOption;
}());
var AdditionalItem = /** @class */ (function () {
    function AdditionalItem() {
    }
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], AdditionalItem.prototype, "variant_id", void 0);
    __decorate([
        (0, class_validator_1.IsNumber)(),
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", Number)
    ], AdditionalItem.prototype, "quantity", void 0);
    return AdditionalItem;
}());
//# sourceMappingURL=create-swap.js.map