"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowedStoreOrdersFields = exports.allowedStoreOrdersRelations = exports.defaultStoreOrdersFields = exports.defaultStoreOrdersRelations = void 0;
var express_1 = require("express");
require("reflect-metadata");
var middlewares_1 = __importDefault(require("../../../middlewares"));
var route = (0, express_1.Router)();
exports.default = (function (app) {
    app.use("/orders", route);
    /**
     * Lookup
     */
    route.get("/", middlewares_1.default.wrap(require("./lookup-order").default));
    /**
     * Retrieve Order
     */
    route.get("/:id", middlewares_1.default.wrap(require("./get-order").default));
    /**
     * Retrieve by Cart Id
     */
    route.get("/cart/:cart_id", middlewares_1.default.wrap(require("./get-order-by-cart").default));
    return app;
});
exports.defaultStoreOrdersRelations = [
    "shipping_address",
    "fulfillments",
    "fulfillments.tracking_links",
    "items",
    "items.variant",
    "items.variant.product",
    "shipping_methods",
    "discounts",
    "discounts.rule",
    "customer",
    "payments",
    "region",
];
exports.defaultStoreOrdersFields = [
    "id",
    "status",
    "fulfillment_status",
    "payment_status",
    "display_id",
    "cart_id",
    "customer_id",
    "email",
    "region_id",
    "currency_code",
    "tax_rate",
    "created_at",
    "shipping_total",
    "discount_total",
    "tax_total",
    "items.refundable",
    "refunded_total",
    "gift_card_total",
    "subtotal",
    "total",
];
exports.allowedStoreOrdersRelations = [
    "shipping_address",
    "fulfillments",
    "fulfillments.tracking_links",
    "billing_address",
    "items",
    "items.variant",
    "items.variant.product",
    "shipping_methods",
    "discounts",
    "discounts.rule",
    "customer",
    "payments",
    "region",
];
exports.allowedStoreOrdersFields = [
    "id",
    "status",
    "fulfillment_status",
    "payment_status",
    "display_id",
    "cart_id",
    "customer_id",
    "email",
    "region_id",
    "currency_code",
    "items.refundable",
    "tax_rate",
    "created_at",
    "shipping_total",
    "discount_total",
    "tax_total",
    "refunded_total",
    "gift_card_total",
    "subtotal",
    "total",
];
__exportStar(require("./lookup-order"), exports);
//# sourceMappingURL=index.js.map