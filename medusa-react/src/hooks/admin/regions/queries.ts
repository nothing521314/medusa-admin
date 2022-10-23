import {
  AdminGetProductsParams,
  AdminGetRegionsParams,
  AdminGetRegionsRegionFulfillmentOptionsRes,
  AdminGetUserParams,
  AdminProductsListRes2,
  AdminRegionsListRes,
  AdminRegionsRes,
  AdminUsersListRes2,
} from "@medusa-types";
import { useQuery } from "react-query";
import { Response } from "../../../../../medusa-js";
import { useMedusa } from "../../../contexts";
import { UseQueryOptionsWrapper } from "../../../types";
import { queryKeysFactory } from "../../utils/index";

const ADMIN_REGIONS_QUERY_KEY = `admin_regions` as const;

export const adminRegionKeys = queryKeysFactory(ADMIN_REGIONS_QUERY_KEY);

type RegionQueryKeys = typeof adminRegionKeys;

export const useAdminRegions = (
  query?: AdminGetRegionsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminRegionsListRes>,
    Error,
    ReturnType<RegionQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa();
  const { data, ...rest } = useQuery(
    adminRegionKeys.list(query),
    () => client.admin.regions.list(query),
    options
  );
  return { ...data, ...rest };
};

export const useAdminRegionsListUser = (
  id?: string,
  query?: AdminGetUserParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminUsersListRes2>,
    Error,
    ReturnType<RegionQueryKeys["listSalesman"]>
  >
) => {
  const { client } = useMedusa();
  const { data, ...rest } = useQuery(
    "listSalesman" as any,
    () => client.admin.regions.listUser(id, query),
    options
  );
  return { ...data, ...rest };
};

export const useAdminRegionsListProduct = (
  id?: string,
  query?: AdminGetProductsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminProductsListRes2>,
    Error,
    ReturnType<RegionQueryKeys["listProduct"]>
  >
) => {
  const { client } = useMedusa();
  const { data, ...rest } = useQuery(
    "listProduct" as any,
    () => client.admin.regions.listProduct(id, query),
    options
  );
  return { ...data, ...rest };
};

export const useAdminRegion = (
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminRegionsRes>,
    Error,
    ReturnType<RegionQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa();
  const { data, ...rest } = useQuery(
    adminRegionKeys.detail(id),
    () => client.admin.regions.retrieve(id),
    options
  );
  return { ...data, ...rest } as const;
};

export const useAdminRegionFulfillmentOptions = (
  regionId: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminGetRegionsRegionFulfillmentOptionsRes>,
    Error,
    ReturnType<RegionQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa();
  const { data, ...rest } = useQuery(
    adminRegionKeys.detail(`${regionId}_fullfillment-options`),
    () => client.admin.regions.retrieveFulfillmentOptions(regionId),
    options
  );
  return { ...data, ...rest } as const;
};
