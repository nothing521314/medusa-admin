"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderEdit = void 0;
var typeorm_1 = require("typeorm");
var order_editing_1 = __importDefault(require("../loaders/feature-flags/order-editing"));
var feature_flag_decorators_1 = require("../utils/feature-flag-decorators");
var db_aware_column_1 = require("../utils/db-aware-column");
var order_item_change_1 = require("./order-item-change");
var interfaces_1 = require("../interfaces");
var utils_1 = require("../utils");
var order_1 = require("./order");
var OrderEdit = /** @class */ (function (_super) {
    __extends(OrderEdit, _super);
    function OrderEdit() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OrderEdit.prototype.beforeInsert = function () {
        this.id = (0, utils_1.generateEntityId)(this.id, "oe");
    };
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], OrderEdit.prototype, "order_id", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return order_1.Order; }, function (o) { return o.edits; }),
        (0, typeorm_1.JoinColumn)({ name: "order_id" }),
        __metadata("design:type", order_1.Order)
    ], OrderEdit.prototype, "order", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return order_item_change_1.OrderItemChange; }, function (oic) { return oic.order_edit; }, {
            cascade: true,
        }),
        __metadata("design:type", Array)
    ], OrderEdit.prototype, "changes", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], OrderEdit.prototype, "internal_note", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], OrderEdit.prototype, "created_by", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], OrderEdit.prototype, "requested_by", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: (0, db_aware_column_1.resolveDbType)("timestamptz"), nullable: true }),
        __metadata("design:type", Date)
    ], OrderEdit.prototype, "requested_at", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], OrderEdit.prototype, "confirmed_by", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: (0, db_aware_column_1.resolveDbType)("timestamptz"), nullable: true }),
        __metadata("design:type", Date)
    ], OrderEdit.prototype, "confirmed_at", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], OrderEdit.prototype, "declined_by", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], OrderEdit.prototype, "declined_reason", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: (0, db_aware_column_1.resolveDbType)("timestamptz"), nullable: true }),
        __metadata("design:type", Date)
    ], OrderEdit.prototype, "declined_at", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], OrderEdit.prototype, "canceled_by", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: (0, db_aware_column_1.resolveDbType)("timestamptz"), nullable: true }),
        __metadata("design:type", Date
        // Computed
        )
    ], OrderEdit.prototype, "canceled_at", void 0);
    __decorate([
        (0, typeorm_1.BeforeInsert)(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], OrderEdit.prototype, "beforeInsert", null);
    OrderEdit = __decorate([
        (0, feature_flag_decorators_1.FeatureFlagEntity)(order_editing_1.default.key)
    ], OrderEdit);
    return OrderEdit;
}(interfaces_1.SoftDeletableEntity));
exports.OrderEdit = OrderEdit;
/**
 * @schema order_edit
 * title: "Order Edit"
 * description: "Order edit keeps track of order items changes."
 * x-resourceId: order_edit
 * required:
 *   - order_id
 *   - order
 *   - changes
 *   - created_by
 * properties:
 *   id:
 *     type: string
 *     description: The order edit's ID
 *     example: oe_01G8TJSYT9M6AVS5N4EMNFS1EK
 *   order_id:
 *     type: string
 *     description: The ID of the order that is edited
 *     example: order_01G2SG30J8C85S4A5CHM2S1NS2
 *   order:
 *     description: Order object
 *     $ref: "#/components/schemas/order"
 *   changes:
 *     type: array
 *     description: Line item changes array.
 *     items:
 *       $ref: "#/components/schemas/order_item_change"
 *   internal_note:
 *     description: "An optional note with additional details about the order edit."
 *     type: string
 *     example: Included two more items B to the order.
 *   created_by:
 *     type: string
 *     description: "The unique identifier of the user or customer who created the order edit."
 *   requested_by:
 *     type: string
 *     description: "The unique identifier of the user or customer who requested the order edit."
 *   requested_at:
 *     type: string
 *     description: "The date with timezone at which the edit was requested."
 *     format: date-time
 *   confirmed_by:
 *     type: string
 *     description: "The unique identifier of the user or customer who confirmed the order edit."
 *   confirmed_at:
 *     type: string
 *     description: "The date with timezone at which the edit was confirmed."
 *     format: date-time
 *   declined_by:
 *     type: string
 *     description: "The unique identifier of the user or customer who declined the order edit."
 *   declined_at:
 *     type: string
 *     description: "The date with timezone at which the edit was declined."
 *     format: date-time
 *   declined_reason:
 *     description: "An optional note why  the order edit is declined."
 *     type: string
 *   subtotal:
 *     type: integer
 *     description: The subtotal for line items computed from changes.
 *     example: 8000
 *   discount_total:
 *     type: integer
 *     description: The total of discount
 *     example: 800
 *   tax_total:
 *     type: integer
 *     description: The total of tax
 *     example: 0
 *   total:
 *     type: integer
 *     description: The total amount of the edited order.
 *     example: 8200
 *   difference_due:
 *     type: integer
 *     description: The difference between the total amount of the order and total amount of edited order.
 *     example: 8200
 *   items:
 *     type: array
 *     description: Computed line items from the changes.
 *     items:
 *       $ref: "#/components/schemas/line_item"
 *   removed_items:
 *     type: array
 *     description: Computed line items from the changes that have been marked as deleted.
 *     removed_items:
 *       $ref: "#/components/schemas/line_item"
 */
//# sourceMappingURL=order-edit.js.map