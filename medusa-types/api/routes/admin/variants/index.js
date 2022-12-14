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
exports.allowedAdminVariantRelations = exports.allowedAdminVariantFields = exports.defaultAdminVariantFields = exports.defaultAdminVariantRelations = void 0;
var express_1 = require("express");
var middlewares_1 = __importDefault(require("../../../middlewares"));
var route = (0, express_1.Router)();
exports.default = (function (app) {
    app.use("/variants", route);
    route.get("/", middlewares_1.default.wrap(require("./list-variants").default));
    return app;
});
exports.defaultAdminVariantRelations = ["product", "prices", "options"];
exports.defaultAdminVariantFields = [
    "id",
    "title",
    "product_id",
    "sku",
    "barcode",
    "ean",
    "upc",
    "inventory_quantity",
    "allow_backorder",
    "weight",
    "length",
    "height",
    "width",
    "hs_code",
    "origin_country",
    "mid_code",
    "material",
    "created_at",
    "updated_at",
    "metadata",
];
exports.allowedAdminVariantFields = [
    "id",
    "title",
    "product_id",
    "sku",
    "barcode",
    "ean",
    "upc",
    "inventory_quantity",
    "allow_backorder",
    "weight",
    "length",
    "height",
    "width",
    "hs_code",
    "origin_country",
    "mid_code",
    "material",
    "created_at",
    "updated_at",
    "metadata",
];
exports.allowedAdminVariantRelations = [
    "product",
    "prices",
    "options",
];
__exportStar(require("./list-variants"), exports);
//# sourceMappingURL=index.js.map