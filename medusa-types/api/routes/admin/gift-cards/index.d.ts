import "reflect-metadata";
import { GiftCard } from "../../../..";
import { DeleteResponse, PaginatedResponse } from "../../../../types/common";
declare const _default: (app: any) => any;
export default _default;
export declare const defaultAdminGiftCardFields: (keyof GiftCard)[];
export declare const defaultAdminGiftCardRelations: string[];
export declare const allowedAdminGiftCardFields: string[];
export declare const allowedAdminGiftCardRelations: string[];
export declare type AdminGiftCardsRes = {
    gift_card: GiftCard;
};
export declare type AdminGiftCardsDeleteRes = DeleteResponse;
export declare type AdminGiftCardsListRes = PaginatedResponse & {
    gift_cards: GiftCard[];
};
export * from "./create-gift-card";
export * from "./list-gift-cards";
export * from "./update-gift-card";
