import { Customer } from "medusa-types/customer";
import { Product } from "medusa-types/product";
import { Region } from "medusa-types/region";
import { PaginatedResponse } from "medusa-types/types/common";
import { User } from "medusa-types/user";

export declare class AdminGetQuotationsParams {
  offset: number;
  limit: number;
  fields?: string;
  sale_persion_id: string;
}

export declare class AdminCreateQuotationParams {
  title: string;
  code: string;
  heading: string;
  condition: string;
  payment_term: string;
  delivery_lead_time: string;
  date: string;
  warranty: string;
  install_support: string;
  appendix_a: string;
  appendix_b: string;
  sale_persion_id: string;
  customer_id: string;
  region_id: string;
  quotation_lines: Array<{
    product_id: string;
    volume: number;
  }>;
  metadata: any;
  header: string;
}

export type TQuotationLines = {
  id: string;
  product_id: string;
  quotation_id: string;
  volume: number;
  unit_price: number;
  parent_product_id: Product | null;
  product: Product;
  child_product: TQuotationLines[];
};

export type TQuotationReturn = {
  id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  sale_persion_id: string;
  tital: string;
  code: string;
  date: string;
  customer_id: string;
  region_id: string;
  heading: string;
  condition: string;
  payment_term: string;
  delivery_lead_time: string;
  warranty: string;
  install_support: string;
  appendix_a: string;
  appendix_b: string;
  customer: Customer;
  sale_persion: User;
  region: Region;
  quotation_lines: TQuotationLines[];
  header: string;
};

export declare type TOneQuotationReturn = {
  quotation: TQuotationReturn;
};

export declare type AdminQuotationsRes = PaginatedResponse & {
  quotations: TQuotationReturn[];
};
