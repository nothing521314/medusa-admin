export declare class AdminGetQuotationsParams {
  offset: number;
  limit: number;
  fields?: string;
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
}

export type TQuotationReturn = {
  id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  sale_persion_id: string;
  title: string;
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
};

export declare type TOneQuotationReturn = {
  quotation: TQuotationReturn;
};

export declare type AdminQuotationsRes = {
  quotations: TQuotationReturn[];
};
