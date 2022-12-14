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
exports.defaultStoreProductsRelations = void 0;
var express_1 = require("express");
require("reflect-metadata");
var middlewares_1 = __importDefault(require("../../../middlewares"));
var route = (0, express_1.Router)();
exports.default = (function (app) {
    app.use("/products", route);
    route.get("/", middlewares_1.default.wrap(require("./list-products").default));
    route.post("/search", middlewares_1.default.wrap(require("./search").default));
    route.get("/:id", middlewares_1.default.wrap(require("./get-product").default));
    return app;
});
exports.defaultStoreProductsRelations = [
    "variants",
    "variants.prices",
    "variants.options",
    "options",
    "options.values",
    "images",
    "tags",
    "collection",
    "type",
];
__exportStar(require("./list-products"), exports);
__exportStar(require("./search"), exports);
//# sourceMappingURL=index.js.map