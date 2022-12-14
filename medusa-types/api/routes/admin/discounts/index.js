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
exports.defaultAdminDiscountConditionRelations = exports.defaultAdminDiscountConditionFields = exports.defaultAdminDiscountsRelations = exports.defaultAdminDiscountsFields = void 0;
var express_1 = require("express");
require("reflect-metadata");
var middlewares_1 = __importDefault(require("../../../middlewares"));
var route = (0, express_1.Router)();
exports.default = (function (app) {
    app.use("/discounts", route);
    route.get("/", middlewares_1.default.wrap(require("./list-discounts").default));
    route.post("/", middlewares_1.default.wrap(require("./create-discount").default));
    route.get("/:discount_id", middlewares_1.default.wrap(require("./get-discount").default));
    route.get("/code/:code", middlewares_1.default.wrap(require("./get-discount-by-code").default));
    route.post("/:discount_id", middlewares_1.default.wrap(require("./update-discount").default));
    route.delete("/:discount_id", middlewares_1.default.wrap(require("./delete-discount").default));
    // Dynamic codes
    route.post("/:discount_id/dynamic-codes", middlewares_1.default.wrap(require("./create-dynamic-code").default));
    route.delete("/:discount_id/dynamic-codes/:code", middlewares_1.default.wrap(require("./delete-dynamic-code").default));
    // Discount region management
    route.post("/:discount_id/regions/:region_id", middlewares_1.default.wrap(require("./add-region").default));
    route.delete("/:discount_id/regions/:region_id", middlewares_1.default.wrap(require("./remove-region").default));
    // Discount condition management
    route.get("/:discount_id/conditions/:condition_id", middlewares_1.default.wrap(require("./get-condition").default));
    route.post("/:discount_id/conditions/:condition_id", middlewares_1.default.wrap(require("./update-condition").default));
    route.post("/:discount_id/conditions", middlewares_1.default.wrap(require("./create-condition").default));
    route.delete("/:discount_id/conditions/:condition_id", middlewares_1.default.wrap(require("./delete-condition").default));
    return app;
});
exports.defaultAdminDiscountsFields = [
    "id",
    "code",
    "is_dynamic",
    "is_disabled",
    "rule_id",
    "parent_discount_id",
    "usage_limit",
    "usage_count",
    "starts_at",
    "ends_at",
    "created_at",
    "updated_at",
    "deleted_at",
    "metadata",
    "valid_duration",
];
exports.defaultAdminDiscountsRelations = [
    "rule",
    "parent_discount",
    "regions",
    "rule.conditions",
];
exports.defaultAdminDiscountConditionFields = ["id", "type", "operator", "discount_rule_id", "created_at", "updated_at"];
exports.defaultAdminDiscountConditionRelations = ["discount_rule"];
__exportStar(require("./add-region"), exports);
__exportStar(require("./create-condition"), exports);
__exportStar(require("./create-discount"), exports);
__exportStar(require("./create-dynamic-code"), exports);
__exportStar(require("./delete-condition"), exports);
__exportStar(require("./delete-discount"), exports);
__exportStar(require("./delete-dynamic-code"), exports);
__exportStar(require("./get-condition"), exports);
__exportStar(require("./get-discount"), exports);
__exportStar(require("./get-discount-by-code"), exports);
__exportStar(require("./list-discounts"), exports);
__exportStar(require("./remove-region"), exports);
__exportStar(require("./update-condition"), exports);
__exportStar(require("./update-discount"), exports);
//# sourceMappingURL=index.js.map