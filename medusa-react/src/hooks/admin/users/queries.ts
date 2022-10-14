import {
  AdminUsersListRes,
  AdminUserRes,
  AdminGetUserParams,
} from "@medusa-types";
import { Response } from "../../../../../medusa-js";
import { useQuery } from "react-query";
import { useMedusa } from "../../../contexts";
import { UseQueryOptionsWrapper } from "../../../types";
import { queryKeysFactory } from "../../utils/index";

const ADMIN_USERS_QUERY_KEY = `admin_users` as const;

export const adminUserKeys = queryKeysFactory(ADMIN_USERS_QUERY_KEY);

type UserQueryKeys = typeof adminUserKeys;

export const useAdminUsers = (
  query?: AdminGetUserParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminUsersListRes>,
    Error,
    ReturnType<UserQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa();
  const { data, ...rest } = useQuery(
    adminUserKeys.list(query),
    () => client.admin.users.list(query),
    options
  );
  return { ...data, ...rest };
};

export const useAdminUser = (
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminUserRes>,
    Error,
    ReturnType<UserQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa();
  const { data, ...rest } = useQuery(
    adminUserKeys.detail(id),
    () => client.admin.users.retrieve(id),
    options
  );
  return { ...data, ...rest };
};
