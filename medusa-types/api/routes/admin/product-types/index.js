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
exports.defaultAdminProductTypeRelations = exports.defaultAdminProductTypeFields = exports.allowedAdminProductTypeFields = void 0;
var express_1 = require("express");
var middlewares_1 = __importDefault(require("../../../middlewares"));
require("reflect-metadata");
var route = (0, express_1.Router)();
exports.default = (function (app) {
    app.use("/product-types", route);
    route.get("/", middlewares_1.default.wrap(require("./list-product-types").default));
    return app;
});
exports.allowedAdminProductTypeFields = [
    "id",
    "value",
    "created_at",
    "updated_at",
];
exports.defaultAdminProductTypeFields = [
    "id",
    "value",
    "created_at",
    "updated_at",
];
exports.defaultAdminProductTypeRelations = [];
__exportStar(require("./list-product-types"), exports);
//# sourceMappingURL=index.js.map