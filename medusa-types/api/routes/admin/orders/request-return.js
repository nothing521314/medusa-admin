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
exports.AdminPostOrdersOrderReturnsReq = void 0;
var class_validator_1 = require("class-validator");
var _1 = require(".");
var class_transformer_1 = require("class-transformer");
var medusa_core_utils_1 = require("medusa-core-utils");
var orders_1 = require("../../../../types/orders");
var utils_1 = require("../../../../utils");
var validator_1 = require("../../../../utils/validator");
/**
 * @oas [post] /orders/{id}/return
 * operationId: "PostOrdersOrderReturns"
 * summary: "Request a Return"
 * description: "Requests a Return. If applicable a return label will be created and other plugins notified."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Order.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - items
 *         properties:
 *           items:
 *             description: The Line Items that will be returned.
 *             type: array
 *             items:
 *               required:
 *                 - item_id
 *                 - quantity
 *               properties:
 *                 item_id:
 *                   description: The ID of the Line Item.
 *                   type: string
 *                 reason_id:
 *                   description: The ID of the Return Reason to use.
 *                   type: string
 *                 note:
 *                   description: An optional note with information about the Return.
 *                   type: string
 *                 quantity:
 *                   description: The quantity of the Line Item.
 *                   type: integer
 *           return_shipping:
 *             description: The Shipping Method to be used to handle the return shipment.
 *             type: object
 *             properties:
 *               option_id:
 *                 type: string
 *                 description: The ID of the Shipping Option to create the Shipping Method from.
 *               price:
 *                 type: integer
 *                 description: The price to charge for the Shipping Method.
 *           note:
 *             description: An optional note with information about the Return.
 *             type: string
 *           receive_now:
 *             description: A flag to indicate if the Return should be registerd as received immediately.
 *             type: boolean
 *             default: false
 *           no_notification:
 *             description: A flag to indicate if no notifications should be emitted related to the requested Return.
 *             type: boolean
 *           refund:
 *             description: The amount to refund.
 *             type: integer
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.orders.requestReturn(order_id, {
 *         items: [
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
 *       curl --location --request POST 'https://medusa-url.com/admin/orders/{id}/return' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "items": [
 *             {
 *               "item_id": "{item_id}",
 *               "quantity": 1
 *             }
 *           ]
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Return
 *   - Order
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
    var id, value, idempotencyKeyService, manager, headerKey, idempotencyKey, error_1, orderService_1, returnService_1, eventBus_1, inProgress_1, err_2, _a, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                id = req.params.id;
                return [4 /*yield*/, (0, validator_1.validator)(AdminPostOrdersOrderReturnsReq, req.body)];
            case 1:
                value = _b.sent();
                idempotencyKeyService = req.scope.resolve("idempotencyKeyService");
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
                _b.label = 6;
            case 6:
                _b.trys.push([6, 17, , 18]);
                orderService_1 = req.scope.resolve("orderService");
                returnService_1 = req.scope.resolve("returnService");
                eventBus_1 = req.scope.resolve("eventBusService");
                inProgress_1 = true;
                err_2 = false;
                _b.label = 7;
            case 7:
                if (!inProgress_1) return [3 /*break*/, 16];
                _a = idempotencyKey.recovery_point;
                switch (_a) {
                    case "started": return [3 /*break*/, 8];
                    case "return_requested": return [3 /*break*/, 10];
                    case "finished": return [3 /*break*/, 12];
                }
                return [3 /*break*/, 13];
            case 8: return [4 /*yield*/, manager.transaction(function (transactionManager) { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, key, error;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, idempotencyKeyService
                                    .withTransaction(transactionManager)
                                    .workStage(idempotencyKey.idempotency_key, function (manager) { return __awaiter(void 0, void 0, void 0, function () {
                                    var returnObj, order, evaluatedNoNotification, createdReturn;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                returnObj = {
                                                    order_id: id,
                                                    idempotency_key: idempotencyKey.idempotency_key,
                                                    items: value.items,
                                                };
                                                if (value.return_shipping) {
                                                    returnObj.shipping_method = value.return_shipping;
                                                }
                                                if ((0, utils_1.isDefined)(value.refund) && value.refund < 0) {
                                                    returnObj.refund_amount = 0;
                                                }
                                                else {
                                                    if (value.refund && value.refund >= 0) {
                                                        returnObj.refund_amount = value.refund;
                                                    }
                                                }
                                                return [4 /*yield*/, orderService_1
                                                        .withTransaction(manager)
                                                        .retrieve(id)];
                                            case 1:
                                                order = _a.sent();
                                                evaluatedNoNotification = value.no_notification !== undefined
                                                    ? value.no_notification
                                                    : order.no_notification;
                                                returnObj.no_notification = evaluatedNoNotification;
                                                return [4 /*yield*/, returnService_1
                                                        .withTransaction(manager)
                                                        .create(returnObj)];
                                            case 2:
                                                createdReturn = _a.sent();
                                                if (!value.return_shipping) return [3 /*break*/, 4];
                                                return [4 /*yield*/, returnService_1
                                                        .withTransaction(manager)
                                                        .fulfill(createdReturn.id)];
                                            case 3:
                                                _a.sent();
                                                _a.label = 4;
                                            case 4: return [4 /*yield*/, eventBus_1
                                                    .withTransaction(manager)
                                                    .emit("order.return_requested", {
                                                    id: id,
                                                    return_id: createdReturn.id,
                                                    no_notification: evaluatedNoNotification,
                                                })];
                                            case 5:
                                                _a.sent();
                                                return [2 /*return*/, {
                                                        recovery_point: "return_requested",
                                                    }];
                                        }
                                    });
                                }); })];
                            case 1:
                                _a = _b.sent(), key = _a.key, error = _a.error;
                                if (error) {
                                    inProgress_1 = false;
                                    err_2 = error;
                                }
                                else {
                                    idempotencyKey = key;
                                }
                                return [2 /*return*/];
                        }
                    });
                }); })];
            case 9:
                _b.sent();
                return [3 /*break*/, 15];
            case 10: return [4 /*yield*/, manager.transaction(function (transactionManager) { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, key, error;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, idempotencyKeyService
                                    .withTransaction(transactionManager)
                                    .workStage(idempotencyKey.idempotency_key, function (manager) { return __awaiter(void 0, void 0, void 0, function () {
                                    var order, returns, returnOrder;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, orderService_1
                                                    .withTransaction(manager)
                                                    .retrieve(id, { relations: ["returns"] })
                                                /**
                                                 * If we are ready to receive immediately, we find the newly created return
                                                 * and register it as received.
                                                 */
                                            ];
                                            case 1:
                                                order = _a.sent();
                                                if (!value.receive_now) return [3 /*break*/, 4];
                                                return [4 /*yield*/, returnService_1
                                                        .withTransaction(manager)
                                                        .list({
                                                        idempotency_key: idempotencyKey.idempotency_key,
                                                    })];
                                            case 2:
                                                returns = _a.sent();
                                                if (!returns.length) {
                                                    throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.INVALID_DATA, "Return not found");
                                                }
                                                returnOrder = returns[0];
                                                return [4 /*yield*/, returnService_1
                                                        .withTransaction(manager)
                                                        .receive(returnOrder.id, value.items, value.refund)];
                                            case 3:
                                                order = _a.sent();
                                                _a.label = 4;
                                            case 4: return [4 /*yield*/, orderService_1
                                                    .withTransaction(manager)
                                                    .retrieve(id, {
                                                    select: _1.defaultAdminOrdersFields,
                                                    relations: _1.defaultAdminOrdersRelations,
                                                })];
                                            case 5:
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
                                    inProgress_1 = false;
                                    err_2 = error;
                                }
                                else {
                                    idempotencyKey = key;
                                }
                                return [2 /*return*/];
                        }
                    });
                }); })];
            case 11:
                _b.sent();
                return [3 /*break*/, 15];
            case 12:
                {
                    inProgress_1 = false;
                    return [3 /*break*/, 15];
                }
                _b.label = 13;
            case 13: return [4 /*yield*/, manager.transaction(function (transactionManager) { return __awaiter(void 0, void 0, void 0, function () {
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
            case 14:
                _b.sent();
                return [3 /*break*/, 15];
            case 15: return [3 /*break*/, 7];
            case 16:
                if (err_2) {
                    throw err_2;
                }
                res.status(idempotencyKey.response_code).json(idempotencyKey.response_body);
                return [3 /*break*/, 18];
            case 17:
                err_1 = _b.sent();
                console.log(err_1);
                throw err_1;
            case 18: return [2 /*return*/];
        }
    });
}); });
var AdminPostOrdersOrderReturnsReq = /** @class */ (function () {
    function AdminPostOrdersOrderReturnsReq() {
        this.receive_now = false;
    }
    __decorate([
        (0, class_validator_1.IsArray)(),
        (0, class_validator_1.ValidateNested)({ each: true }),
        (0, class_transformer_1.Type)(function () { return orders_1.OrdersReturnItem; }),
        __metadata("design:type", Array)
    ], AdminPostOrdersOrderReturnsReq.prototype, "items", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.ValidateNested)(),
        (0, class_transformer_1.Type)(function () { return ReturnShipping; }),
        __metadata("design:type", ReturnShipping)
    ], AdminPostOrdersOrderReturnsReq.prototype, "return_shipping", void 0);
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", String)
    ], AdminPostOrdersOrderReturnsReq.prototype, "note", void 0);
    __decorate([
        (0, class_validator_1.IsBoolean)(),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", Boolean)
    ], AdminPostOrdersOrderReturnsReq.prototype, "receive_now", void 0);
    __decorate([
        (0, class_validator_1.IsBoolean)(),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", Boolean)
    ], AdminPostOrdersOrderReturnsReq.prototype, "no_notification", void 0);
    __decorate([
        (0, class_validator_1.IsInt)(),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", Number)
    ], AdminPostOrdersOrderReturnsReq.prototype, "refund", void 0);
    return AdminPostOrdersOrderReturnsReq;
}());
exports.AdminPostOrdersOrderReturnsReq = AdminPostOrdersOrderReturnsReq;
var ReturnShipping = /** @class */ (function () {
    function ReturnShipping() {
    }
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", String)
    ], ReturnShipping.prototype, "option_id", void 0);
    __decorate([
        (0, class_validator_1.IsInt)(),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", Number)
    ], ReturnShipping.prototype, "price", void 0);
    return ReturnShipping;
}());
//# sourceMappingURL=request-return.js.map