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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminGetDiscountsParams = void 0;
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var lodash_1 = __importStar(require("lodash"));
var _1 = require(".");
var discount_1 = require("../../../../types/discount");
var validator_1 = require("../../../../utils/validator");
var utils_1 = require("../../../../utils");
/**
 * @oas [get] /discounts
 * operationId: "GetDiscounts"
 * summary: "List Discounts"
 * x-authenticated: true
 * description: "Retrieves a list of Discounts"
 * parameters:
 *   - (query) q {string} Search query applied on the code field.
 *   - in: query
 *     name: rule
 *     description: Discount Rules filters to apply on the search
 *     schema:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           enum: [fixed, percentage, free_shipping]
 *           description: "The type of the Discount, can be `fixed` for discounts that reduce the price by a fixed amount, `percentage` for percentage reductions or `free_shipping` for shipping vouchers."
 *         allocation:
 *           type: string
 *           enum: [total, item]
 *           description: "The value that the discount represents; this will depend on the type of the discount"
 *   - (query) is_dynamic {boolean} Return only dynamic discounts.
 *   - (query) is_disabled {boolean} Return only disabled discounts.
 *   - (query) limit=20 {number} The number of items in the response
 *   - (query) offset=0 {number} The offset of items in response
 *   - (query) expand {string} Comma separated list of relations to include in the results.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.discounts.list()
 *       .then(({ discounts, limit, offset, count }) => {
 *         console.log(discounts.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/discounts' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Discount
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             discounts:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/discount"
 *             count:
 *               type: integer
 *               description: The total number of items available
 *             offset:
 *               type: integer
 *               description: The number of items skipped before these items
 *             limit:
 *               type: integer
 *               description: The number of items per page
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
    var validated, discountService, relations, listConfig, filterableFields, _a, discounts, count;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, (0, validator_1.validator)(AdminGetDiscountsParams, req.query)];
            case 1:
                validated = _d.sent();
                discountService = req.scope.resolve("discountService");
                relations = (_c = (_b = validated.expand) === null || _b === void 0 ? void 0 : _b.split(",")) !== null && _c !== void 0 ? _c : _1.defaultAdminDiscountsRelations;
                listConfig = {
                    select: _1.defaultAdminDiscountsFields,
                    relations: relations,
                    skip: validated.offset,
                    take: validated.limit,
                    order: { created_at: "DESC" },
                };
                filterableFields = lodash_1.default.omit(validated, ["limit", "offset", "expand"]);
                return [4 /*yield*/, discountService.listAndCount((0, lodash_1.pickBy)(filterableFields, function (val) { return (0, utils_1.isDefined)(val); }), listConfig)];
            case 2:
                _a = __read.apply(void 0, [_d.sent(), 2]), discounts = _a[0], count = _a[1];
                res.status(200).json({
                    discounts: discounts,
                    count: count,
                    offset: validated.offset,
                    limit: validated.limit,
                });
                return [2 /*return*/];
        }
    });
}); });
var AdminGetDiscountsParams = /** @class */ (function () {
    function AdminGetDiscountsParams() {
        this.limit = 20;
        this.offset = 0;
    }
    __decorate([
        (0, class_validator_1.ValidateNested)(),
        (0, class_validator_1.IsOptional)(),
        (0, class_transformer_1.Type)(function () { return discount_1.AdminGetDiscountsDiscountRuleParams; }),
        __metadata("design:type", discount_1.AdminGetDiscountsDiscountRuleParams)
    ], AdminGetDiscountsParams.prototype, "rule", void 0);
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", String)
    ], AdminGetDiscountsParams.prototype, "q", void 0);
    __decorate([
        (0, class_validator_1.IsBoolean)(),
        (0, class_validator_1.IsOptional)(),
        (0, class_transformer_1.Transform)(function (_a) {
            var value = _a.value;
            return value === "true";
        }),
        __metadata("design:type", Boolean)
    ], AdminGetDiscountsParams.prototype, "is_dynamic", void 0);
    __decorate([
        (0, class_validator_1.IsBoolean)(),
        (0, class_validator_1.IsOptional)(),
        (0, class_transformer_1.Transform)(function (_a) {
            var value = _a.value;
            return value === "true";
        }),
        __metadata("design:type", Boolean)
    ], AdminGetDiscountsParams.prototype, "is_disabled", void 0);
    __decorate([
        (0, class_validator_1.IsInt)(),
        (0, class_validator_1.IsOptional)(),
        (0, class_transformer_1.Type)(function () { return Number; }),
        __metadata("design:type", Object)
    ], AdminGetDiscountsParams.prototype, "limit", void 0);
    __decorate([
        (0, class_validator_1.IsInt)(),
        (0, class_validator_1.IsOptional)(),
        (0, class_transformer_1.Type)(function () { return Number; }),
        __metadata("design:type", Object)
    ], AdminGetDiscountsParams.prototype, "offset", void 0);
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", String)
    ], AdminGetDiscountsParams.prototype, "expand", void 0);
    return AdminGetDiscountsParams;
}());
exports.AdminGetDiscountsParams = AdminGetDiscountsParams;
//# sourceMappingURL=list-discounts.js.map