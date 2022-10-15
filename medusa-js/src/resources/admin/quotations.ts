import {
  AdminCreateQuotationParams,
  AdminGetQuotationsParams,
  AdminQuotationsRes,
  TOneQuotationReturn,
} from "medusa-types/api/routes/admin/quotations/type";
import qs from "qs";
import { ResponsePromise } from "../../typings";
import BaseResource from "../base";

class AdminQuotationsResource extends BaseResource {
  // update(
  //   id: string,
  //   payload: AdminPostOrdersOrderReq,
  //   customHeaders: Record<string, any> = {}
  // ): ResponsePromise<AdminOrdersRes> {
  //   const path = `/admin/orders/${id}`;
  //   return this.client.request("POST", path, payload, {}, customHeaders);
  // }

  retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<TOneQuotationReturn> {
    const path = `/admin/quotations/${id}`;
    return this.client.request("GET", path, undefined, {}, customHeaders);
  }

  list(
    query?: AdminGetQuotationsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminQuotationsRes> {
    let path = "/admin/quotations";

    if (query) {
      const queryString = qs.stringify(query);
      path = `/admin/quotations?${queryString}`;
    }

    return this.client.request("GET", path, undefined, {}, customHeaders);
  }

  create(
    payload: AdminCreateQuotationParams,
    customHeaders: Record<string, AdminCreateQuotationParams> = {}
  ): ResponsePromise<AdminQuotationsRes> {
    const path = "/admin/quotations/";
    return this.client.request("POST", path, payload, {}, customHeaders);
  }

  delete(id: string): ResponsePromise<AdminQuotationsRes> {
    const path = `/admin/quotations/${id}`;
    return this.client.request("DELETE", path, {}, {}, {});
  }
}

export default AdminQuotationsResource;
