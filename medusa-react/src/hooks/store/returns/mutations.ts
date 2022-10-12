import { StoreReturnsRes, StorePostReturnsReq } from "@medusa-types";
import { useMutation, UseMutationOptions } from "react-query";
import { useMedusa } from "../../../contexts";

export const useCreateReturn = (
  options?: UseMutationOptions<StoreReturnsRes, Error, StorePostReturnsReq>
) => {
  const { client } = useMedusa();
  return useMutation(
    (data: StorePostReturnsReq) => client.returns.create(data),
    options
  );
};
