import {
  AdminGetQuotationsParams,
  AdminQuotationsRes,
  TOneQuotationReturn,
} from "medusa-types/api/routes/admin/quotations/type";
import { useQuery } from "react-query";
import { Response } from "../../../../../medusa-js";
import { useMedusa } from "../../../contexts";
import { UseQueryOptionsWrapper } from "../../../types";
import { queryKeysFactory } from "../../utils/index";

const ADMIN_QUOTATIONS_QUERY_KEY = "admin_quotations" as const;

export const adminQuotationsKey = queryKeysFactory(ADMIN_QUOTATIONS_QUERY_KEY);

type TQuotationQueryKeys = typeof adminQuotationsKey;

export const useAdminQuotationGetList = (
  query?: AdminGetQuotationsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminQuotationsRes>,
    Error,
    ReturnType<TQuotationQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa();
  const { data, ...rest } = useQuery(
    adminQuotationsKey.list(query),
    () => client.admin.quotations.list(query),
    options
  );
  return { ...data, ...rest } as const;
};

export const useAdminQuotationGetOne = (
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<TOneQuotationReturn>,
    Error,
    ReturnType<TQuotationQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa();
  const { data, ...rest } = useQuery(
    adminQuotationsKey.detail(id),
    () => client.admin.quotations.retrieve(id),
    options
  );
  return { ...data, ...rest } as const;
};
