import {
  AdminGetProductsParams,
  AdminGetRegionsParams,
  AdminGetRegionsRegionFulfillmentOptionsRes,
  AdminGetUserParams,
  AdminPostRegionsRegionCountriesReq,
  AdminPostRegionsRegionFulfillmentProvidersReq,
  AdminPostRegionsRegionPaymentProvidersReq,
  AdminPostRegionsRegionReq,
  AdminPostRegionsReq,
  AdminProductsListRes2,
  AdminRegionsDeleteRes,
  AdminRegionsListRes,
  AdminRegionsRes,
  AdminUsersListRes2,
} from "@medusa-types";
import qs from "qs";
import { ResponsePromise } from "../../typings";
import BaseResource from "../base";

class AdminRegionsResource extends BaseResource {
  /**
   * @description creates a region.
   * @param payload
   * @param customHeaders
   * @returns created region.
   */
  create(
    payload: AdminPostRegionsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminRegionsRes> {
    const path = `/admin/regions`;
    return this.client.request("POST", path, payload, {}, customHeaders);
  }

  /**
   * @description updates a region
   * @param id id of the region to update.
   * @param payload update to apply to region.
   * @param customHeaders
   * @returns the updated region.
   */
  update(
    id: string,
    payload: AdminPostRegionsRegionReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminRegionsRes> {
    const path = `/admin/regions/${id}`;
    return this.client.request("POST", path, payload, {}, customHeaders);
  }

  /**
   * @description deletes a region
   * @param id id of region to delete.
   * @param customHeaders
   * @returns Deleted response
   */
  delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminRegionsDeleteRes> {
    const path = `/admin/regions/${id}`;
    return this.client.request("DELETE", path, undefined, {}, customHeaders);
  }

  /**
   * @description get a region
   * @param id id of the region to retrieve.
   * @param customHeaders
   * @returns the region with the given id
   */
  retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminRegionsRes> {
    const path = `/admin/regions/${id}`;
    return this.client.request("GET", path, undefined, {}, customHeaders);
  }

  /**
   * @description lists regions matching a query
   * @param query query for searching regions
   * @param customHeaders
   * @returns a list of regions matching the query.
   */
  list(
    query?: AdminGetRegionsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminRegionsListRes> {
    let path = `/admin/regions`;

    if (query) {
      const queryString = qs.stringify(query);
      path = `/admin/regions?${queryString}`;
    }

    return this.client.request("GET", path, undefined, {}, customHeaders);
  }

  listUser(
    id?: string,
    query?: AdminGetUserParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminUsersListRes2> {
    let path = `/admin/regions/${id}/users`;
    if (query) {
      const queryString = qs.stringify(query);
      path = `/admin/regions/${id}/users?${queryString}`;
    }

    return this.client.request("GET", path, undefined, {}, customHeaders);
  }

  listProduct(
    id?: string,
    query?: AdminGetProductsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminProductsListRes2> {
    let path = `/admin/regions/${id}/products`;
    if (query) {
      const queryString = qs.stringify(query);
      path = `/admin/regions/${id}/products?${queryString}`;
    }

    return this.client.request("GET", path, undefined, {}, customHeaders);
  }
  /**
   * @description adds a country to the list of countries in a region
   * @param id region id
   * @param payload country data
   * @param customHeaders
   * @returns updated region
   */
  addCountry(
    id: string,
    payload: AdminPostRegionsRegionCountriesReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminRegionsRes> {
    const path = `/admin/regions/${id}/countries`;
    return this.client.request("POST", path, payload, {}, customHeaders);
  }

  /**
   * @description remove a country from a region's list of coutnries
   * @param id region id
   * @param country_code the 2 character ISO code for the Country.
   * @param customHeaders
   * @returns updated region
   */
  deleteCountry(
    id: string,
    country_code: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminRegionsRes> {
    const path = `/admin/regions/${id}/countries/${country_code}`;
    return this.client.request("DELETE", path, undefined, {}, customHeaders);
  }

  /**
   * @description adds a fulfillment provider to a region
   * @param id region id
   * @param payload fulfillment provider data
   * @param customHeaders
   * @returns updated region
   */
  addFulfillmentProvider(
    id: string,
    payload: AdminPostRegionsRegionFulfillmentProvidersReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminRegionsRes> {
    const path = `/admin/regions/${id}/fulfillment-providers`;
    return this.client.request("POST", path, payload, {}, customHeaders);
  }

  /**
   * @description remove a fulfillment provider from a region
   * @param id region id
   * @param provider_id the if of the fulfillment provider
   * @param customHeaders
   * @returns updated region
   */
  deleteFulfillmentProvider(
    id: string,
    provider_id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminRegionsRes> {
    const path = `/admin/regions/${id}/fulfillment-providers/${provider_id}`;
    return this.client.request("DELETE", path, undefined, {}, customHeaders);
  }

  /**
   * @description retrieves the list of fulfillment options available in a region
   * @param id region id
   * @param customHeaders
   * @returns list of fulfillment options
   */
  retrieveFulfillmentOptions(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminGetRegionsRegionFulfillmentOptionsRes> {
    const path = `/admin/regions/${id}/fulfillment-options`;
    return this.client.request("GET", path, undefined, {}, customHeaders);
  }

  /**
   * @description adds a payment provider to a region
   * @param id region id
   * @param payload payment provider data
   * @param customHeaders
   * @returns updated region
   */
  addPaymentProvider(
    id: string,
    payload: AdminPostRegionsRegionPaymentProvidersReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminRegionsRes> {
    const path = `/admin/regions/${id}/payment-providers`;
    return this.client.request("POST", path, payload, {}, customHeaders);
  }

  /**
   * @description removes a payment provider from a region
   * @param id region id
   * @param provider_id the id of the payment provider
   * @param customHeaders
   * @returns updated region
   */
  deletePaymentProvider(
    id: string,
    provider_id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminRegionsRes> {
    const path = `/admin/regions/${id}/payment-providers/${provider_id}`;
    return this.client.request("DELETE", path, undefined, {}, customHeaders);
  }

  addUser(
    id: string,
    user_id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminRegionsRes> {
    const path = `/admin/regions/${id}/region-user/${user_id}`;
    return this.client.request("POST", path, undefined, {}, customHeaders);
  }

  addProduct(
    id: string,
    product_id: string,
    payload: IAdminRegionUpdateProductReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminRegionsRes> {
    const path = `/admin/regions/${id}/product/${product_id}`;
    return this.client.request("POST", path, payload, {}, customHeaders);
  }

  deleteUser(
    id: string,
    user_id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminRegionsRes> {
    const path = `/admin/regions/${id}/region-user/${user_id}`;
    return this.client.request("DELETE", path, undefined, {}, customHeaders);
  }

  deleteProduct(
    id: string,
    product_id: string,
    payload: IAdminRegionUpdateProductReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminRegionsRes> {
    const path = `/admin/regions/${id}/product/${product_id}`;
    return this.client.request("POST", path, payload, {}, customHeaders);
  }
}

export interface IAdminRegionUpdateProductReq {
  price: number;
}

export default AdminRegionsResource;
