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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeOrderEditNotAllowedFields = void 0;
var express_1 = require("express");
var middlewares_1 = __importStar(require("../../../middlewares"));
var common_1 = require("../../../../types/common");
var feature_flag_enabled_1 = require("../../../middlewares/feature-flag-enabled");
var order_editing_1 = __importDefault(require("../../../../loaders/feature-flags/order-editing"));
var order_edit_1 = require("../../../../types/order-edit");
var route = (0, express_1.Router)();
exports.default = (function (app) {
    app.use("/order-edits", (0, feature_flag_enabled_1.isFeatureFlagEnabled)(order_editing_1.default.key), route);
    route.get("/:id", (0, middlewares_1.transformQuery)(common_1.EmptyQueryParams, {
        defaultRelations: order_edit_1.defaultOrderEditRelations.filter(function (field) { return !exports.storeOrderEditNotAllowedFields.includes(field); }),
        defaultFields: order_edit_1.defaultOrderEditFields.filter(function (field) { return !exports.storeOrderEditNotAllowedFields.includes(field); }),
        allowedFields: order_edit_1.defaultOrderEditFields,
        isList: false,
    }), middlewares_1.default.wrap(require("./get-order-edit").default));
    return app;
});
exports.storeOrderEditNotAllowedFields = [
    "internal_note",
    "created_by",
    "confirmed_by",
    "canceled_by",
];
//# sourceMappingURL=index.js.map