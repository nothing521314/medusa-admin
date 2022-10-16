"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultOrderEditFields = exports.defaultOrderEditRelations = void 0;
exports.defaultOrderEditRelations = [
    "changes",
    "changes.line_item",
    "changes.original_line_item",
];
exports.defaultOrderEditFields = [
    "id",
    "changes",
    "order_id",
    "created_by",
    "requested_by",
    "requested_at",
    "confirmed_by",
    "confirmed_at",
    "declined_by",
    "declined_reason",
    "declined_at",
    "canceled_by",
    "canceled_at",
    "internal_note",
];
//# sourceMappingURL=order-edit.js.map