import { Request } from "express";
import { Cart } from "../../../../models";
import { EntityManager } from "typeorm";
export declare const decorateLineItemsWithTotals: (cart: Cart, req: Request, options?: {
    force_taxes: boolean;
    transactionManager?: EntityManager;
}) => Promise<Cart>;
