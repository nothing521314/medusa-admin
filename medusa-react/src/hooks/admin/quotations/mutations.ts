import { Response } from "@medusa-js";
import { useMedusa } from "../../../contexts";
import { AdminCreateQuotationParams, AdminQuotationsRes } from "medusa-types/api/routes/admin/quotations/type";
import { useMutation, UseMutationOptions, useQueryClient } from "react-query";
import { buildOptions } from "../../utils/buildOptions";
import { adminQuotationsKey } from "./queries";

export const useAdminCreateQuotation = (
  options?: UseMutationOptions<
    Response<AdminQuotationsRes>,
    Error,
    AdminCreateQuotationParams
  >
) => {
  const { client } = useMedusa();
  const queryClient = useQueryClient();

  return useMutation(
    (payload: AdminCreateQuotationParams) =>
      client.admin.quotations.create(payload),
    buildOptions(queryClient, adminQuotationsKey.lists(), options)
  );
};
