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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersReturnItem = exports.AdminListOrdersSelector = exports.isOrder = void 0;
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var is_type_1 = require("../utils/validators/is-type");
var common_1 = require("./common");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isOrder(object) {
    return object.object === "order";
}
exports.isOrder = isOrder;
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["pending"] = "pending";
    OrderStatus["completed"] = "completed";
    OrderStatus["archived"] = "archived";
    OrderStatus["canceled"] = "canceled";
    OrderStatus["requires_action"] = "requires_action";
})(OrderStatus || (OrderStatus = {}));
var FulfillmentStatus;
(function (FulfillmentStatus) {
    FulfillmentStatus["not_fulfilled"] = "not_fulfilled";
    FulfillmentStatus["fulfilled"] = "fulfilled";
    FulfillmentStatus["partially_fulfilled"] = "partially_fulfilled";
    FulfillmentStatus["shipped"] = "shipped";
    FulfillmentStatus["partially_shipped"] = "partially_shipped";
    FulfillmentStatus["canceled"] = "canceled";
    FulfillmentStatus["returned"] = "returned";
    FulfillmentStatus["partially_returned"] = "partially_returned";
    FulfillmentStatus["requires_action"] = "requires_action";
})(FulfillmentStatus || (FulfillmentStatus = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["captured"] = "captured";
    PaymentStatus["awaiting"] = "awaiting";
    PaymentStatus["not_paid"] = "not_paid";
    PaymentStatus["refunded"] = "refunded";
    PaymentStatus["partially_refunded"] = "partially_refunded";
    PaymentStatus["canceled"] = "canceled";
    PaymentStatus["requires_action"] = "requires_action";
})(PaymentStatus || (PaymentStatus = {}));
var AdminListOrdersSelector = /** @class */ (function () {
    function AdminListOrdersSelector() {
    }
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", String)
    ], AdminListOrdersSelector.prototype, "q", void 0);
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", String)
    ], AdminListOrdersSelector.prototype, "id", void 0);
    __decorate([
        (0, class_validator_1.IsArray)(),
        (0, class_validator_1.IsEnum)(OrderStatus, { each: true }),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", Array)
    ], AdminListOrdersSelector.prototype, "status", void 0);
    __decorate([
        (0, class_validator_1.IsArray)(),
        (0, class_validator_1.IsEnum)(FulfillmentStatus, { each: true }),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", Array)
    ], AdminListOrdersSelector.prototype, "fulfillment_status", void 0);
    __decorate([
        (0, class_validator_1.IsArray)(),
        (0, class_validator_1.IsEnum)(PaymentStatus, { each: true }),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", Array)
    ], AdminListOrdersSelector.prototype, "payment_status", void 0);
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", String)
    ], AdminListOrdersSelector.prototype, "display_id", void 0);
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", String)
    ], AdminListOrdersSelector.prototype, "cart_id", void 0);
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", String)
    ], AdminListOrdersSelector.prototype, "customer_id", void 0);
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", String)
    ], AdminListOrdersSelector.prototype, "email", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, is_type_1.IsType)([String, [String]]),
        __metadata("design:type", Object)
    ], AdminListOrdersSelector.prototype, "region_id", void 0);
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", String)
    ], AdminListOrdersSelector.prototype, "currency_code", void 0);
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", String)
    ], AdminListOrdersSelector.prototype, "tax_rate", void 0);
    __decorate([
        (0, class_validator_1.IsArray)(),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", Array)
    ], AdminListOrdersSelector.prototype, "sales_channel_id", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.ValidateNested)(),
        (0, class_transformer_1.Type)(function () { return common_1.DateComparisonOperator; }),
        __metadata("design:type", common_1.DateComparisonOperator)
    ], AdminListOrdersSelector.prototype, "canceled_at", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.ValidateNested)(),
        (0, class_transformer_1.Type)(function () { return common_1.DateComparisonOperator; }),
        __metadata("design:type", common_1.DateComparisonOperator)
    ], AdminListOrdersSelector.prototype, "created_at", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.ValidateNested)(),
        (0, class_transformer_1.Type)(function () { return common_1.DateComparisonOperator; }),
        __metadata("design:type", common_1.DateComparisonOperator)
    ], AdminListOrdersSelector.prototype, "updated_at", void 0);
    return AdminListOrdersSelector;
}());
exports.AdminListOrdersSelector = AdminListOrdersSelector;
var OrdersReturnItem = /** @class */ (function () {
    function OrdersReturnItem() {
    }
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], OrdersReturnItem.prototype, "item_id", void 0);
    __decorate([
        (0, class_validator_1.IsInt)(),
        (0, class_validator_1.IsNotEmpty)(),
        (0, class_transformer_1.Type)(function () { return Number; }),
        __metadata("design:type", Number)
    ], OrdersReturnItem.prototype, "quantity", void 0);
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", String)
    ], OrdersReturnItem.prototype, "reason_id", void 0);
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", String)
    ], OrdersReturnItem.prototype, "note", void 0);
    return OrdersReturnItem;
}());
exports.OrdersReturnItem = OrdersReturnItem;
//# sourceMappingURL=orders.js.map