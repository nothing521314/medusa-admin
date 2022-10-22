import {
  useAdminRegions,
  useAdminUpdateUser,
  useAdminUser,
} from "@medusa-react";
import { AdminUpdateUserRequest } from "@medusa-types";
import { RouteComponentProps } from "@reach/router";
import { navigate } from "gatsby";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSalesmanActions } from "src/hooks/use-salesman-actions";
import { getErrorMessage } from "src/utils/error-messages";
import FormValidator from "src/utils/form-validator";
import ExperimentalSelect from "../../../src/components/molecules/select/next-select/select";
import Button from "../../components/fundamentals/button";
import Breadcrumb from "../../components/molecules/breadcrumb";
import InputField from "../../components/molecules/input";
import BodyCard from "../../components/organisms/body-card";
import useNotification from "../../hooks/use-notification";
import Validator from "../../utils/validator";

type CustomerDetailProps = {
  id: string;
} & RouteComponentProps;

const SalesmanDetail: React.FC<CustomerDetailProps> = ({ id }) => {
  const [user, setUser] = useState<AdminUpdateUserRequest>();
  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { isDirty, errors },
  } = useForm<AdminUpdateUserRequest>();

  const notification = useNotification();
  const { regions, isLoading: isLoadingRegions } = useAdminRegions();
  const { handleDelete } = useSalesmanActions();
  const updateUser = useAdminUpdateUser(id);
  // Fetch info
  useAdminUser(id, {
    onSuccess(data) {
      setUser(data.user);
    },
    cacheTime: 0,
  });

  useEffect(() => {
    if (user)
      reset({
        ...user,
        regions: user.regions.map((v) => ({
          ...v,
          value: v.id!,
          label: v.name,
        })) as any,
      });
  }, [reset, user]);

  const regionsData = regions?.map((v) => ({
    ...v,
    value: v.id!,
    label: v.name,
  }));

  const onSubmit = handleSubmit((data) => {
    const { name, password, phone, regions, email } = data;
    const dataPost: any = {
      name,
      email,
      phone,
      regions: regions.map((v) => v.id),
      password,
    };

    if (password?.length === 0) {
      delete dataPost.password;
    }
    updateUser.mutate(dataPost, {
      onSuccess: () => {
        notification("Success", "Successfully updated salesman", "success");
      },
      onError: (err) => {
        notification("Error", getErrorMessage(err), "error");
      },
    });
  });

  if (!user) return null;

  return (
    <div>
      <Breadcrumb
        currentPage={"Salesman Details"}
        previousBreadcrumb={"Salesman"}
        previousRoute="/a/salesman"
      />
      {/* <div className="flex justify-end m-3">
        <Button
          variant="nuclear"
          className="min-w-[100px]"
          onClick={() => handleDelete(id)}
        >
          Delete Salesman
        </Button>
      </div> */}
      <BodyCard title="Salesman">
        <div className="w-full flex mb-4 space-x-2">
          <InputField
            label="Name"
            {...register("name", {
              required: FormValidator.required("Name"),
            })}
            errors={errors}
          />
          <InputField
            label="Email"
            {...register("email", {
              validate: (value) => Validator.email(value),
            })}
            errors={errors}
          />
        </div>
        <div className="w-full flex mb-4 space-x-2">
          <InputField
            label="Password"
            type={"password"}
            {...register("password", {
              validate: (value) => (value ? Validator.pass(value) : true),
            })}
            errors={errors}
          />
          <InputField
            label="Phone number"
            {...register("phone", {
              validate: Validator.phone,
            })}
            errors={errors}
          />
        </div>
        <div className="w-full flex mb-4 space-x-2">
          <Controller
            control={control}
            name="regions"
            rules={{
              validate: (v) => {
                const hasRegion = v?.length > 0;
                return hasRegion || "Market Region is required.";
              },
            }}
            render={({
              field: { value, onChange, name },
              formState: { errors },
            }) => {
              return (
                <ExperimentalSelect
                  value={value!}
                  name={name}
                  label={`Market Region`}
                  options={regionsData as any}
                  onChange={onChange}
                  isMulti
                  errors={errors}
                  selectAll
                />
              );
            }}
          />
          <InputField className="invisible" />
        </div>
        <div className="mt-6 w-full flex justify-center">
          <Button
            variant="danger"
            onClick={() => navigate(`/a/salesman`)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            loading={updateUser.isLoading}
            disabled={!isDirty || updateUser.isLoading}
            variant="primary"
            className="min-w-[100px]"
            onClick={onSubmit}
          >
            Edit
          </Button>
        </div>
      </BodyCard>
    </div>
  );
};

export default SalesmanDetail;
