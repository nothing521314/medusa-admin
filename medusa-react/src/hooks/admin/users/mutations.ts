import {
  AdminCreateUserPayload,
  AdminUpdateUserPayload,
  Response,
} from "@medusa-js";
import { adminRegionKeys } from "..";
import {
  AdminDeleteUserRes,
  AdminResetPasswordRequest,
  AdminResetPasswordTokenRequest,
  AdminUserRes,
} from "@medusa-types";
import { useMutation, UseMutationOptions, useQueryClient } from "react-query";
import { adminUserKeys } from "..";
import { useMedusa } from "../../../contexts/medusa";
import { buildOptions } from "../../utils/buildOptions";

export const useAdminCreateUser = (
  options?: UseMutationOptions<
    Response<AdminUserRes>,
    Error,
    AdminCreateUserPayload
  >
) => {
  const { client } = useMedusa();
  const queryClient = useQueryClient();

  return useMutation(
    (payload: AdminCreateUserPayload) => client.admin.users.create(payload),
    buildOptions(
      queryClient,
      [
        ...adminUserKeys.lists(),
        adminRegionKeys.list(),
        adminRegionKeys.lists(),
      ],
      options
    )
  );
};

export const useAdminUpdateUser = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminUserRes>,
    Error,
    AdminUpdateUserPayload
  >
) => {
  const { client } = useMedusa();
  const queryClient = useQueryClient();

  return useMutation(
    (payload: AdminUpdateUserPayload) => client.admin.users.update(id, payload),
    buildOptions(
      queryClient,
      [
        adminUserKeys.lists(),
        adminUserKeys.detail(id),
        adminRegionKeys.list(),
        adminRegionKeys.lists(),
      ],
      options
    )
  );
};

export const useAdminDeleteUser = (
  id?: string,
  options?: UseMutationOptions<Response<AdminDeleteUserRes>, Error, string>
) => {
  const { client } = useMedusa();
  const queryClient = useQueryClient();

  return useMutation(
    (id: string) => client.admin.users.delete(id),
    buildOptions(
      queryClient,
      id
        ? [adminUserKeys.detail(id), adminUserKeys.lists()]
        : [adminUserKeys.lists()],
      options
    )
  );
};

export const useAdminResetPassword = (
  options?: UseMutationOptions<
    Response<AdminUserRes>,
    Error,
    AdminResetPasswordRequest
  >
) => {
  const { client } = useMedusa();
  return useMutation(
    (payload: AdminResetPasswordRequest) =>
      client.admin.users.resetPassword(payload),
    options
  );
};

export const useAdminSendResetPasswordToken = (
  options?: UseMutationOptions<
    Response<void>,
    Error,
    AdminResetPasswordTokenRequest
  >
) => {
  const { client } = useMedusa();
  return useMutation(
    (payload: AdminResetPasswordTokenRequest) =>
      client.admin.users.sendResetPasswordToken(payload),
    options
  );
};
