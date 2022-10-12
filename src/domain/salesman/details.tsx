import { User } from "@medusa-types";
import { RouteComponentProps } from "@reach/router";
import { navigate } from "gatsby";
import React, { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useSalesmanActions } from "src/hooks/use-salesman-actions";
import
  {
    useAdminUpdateUser,
    useAdminUser
  } from "../../../medusa-react";
import ExperimentalSelect from "../../../src/components/molecules/select/next-select/select";
import Button from "../../components/fundamentals/button";
import Breadcrumb from "../../components/molecules/breadcrumb";
import InputField from "../../components/molecules/input";
import BodyCard from "../../components/organisms/body-card";
import useNotification from "../../hooks/use-notification";
import { countries } from "../../utils/countries";
import Validator from "../../utils/validator";

type CustomerDetailProps = {
  id: string;
} & RouteComponentProps;

const countryOptions = countries.map((c) => ({
  label: c.name,
  value: c.alpha2,
}));

const SalesmanDetail: React.FC<CustomerDetailProps> = ({ id }) => {
  const [user, setUser] = useState<User>();
  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { isDirty, isValid },
  } = useForm<User>();
  const watch = useWatch({
    control,
  });
  const notification = useNotification();
  const { handleDelete } = useSalesmanActions();
  const updateCustomer = useAdminUpdateUser(id);
  // Fetch info
  useAdminUser(id, {
    onSuccess(data) {
      setUser(data.user);
    },
    cacheTime: 0,
  });

  const onSubmit = handleSubmit((data) => {
    // updateCustomer.mutate(data, {
    //   onSuccess: () => {
    //     notification("Success", "Successfully updated salesman", "success");
    //   },
    //   onError: (err) => {
    //     notification("Error", getErrorMessage(err), "error");
    //   },
    // });
  });

  useEffect(() => {
    if (user) reset(user);
  }, [user]);

  console.log(
    "!isDirty || !isValid || updateCustomer.isLoading",
    !isDirty,
    !isValid,
    updateCustomer.isLoading
  );
  console.log("user", user);

  if (!user) return null;

  return (
    <div>
      <Breadcrumb
        currentPage={"Salesman Details"}
        previousBreadcrumb={"Salesman"}
        previousRoute="/a/salesman"
      />
      <div className="flex justify-end m-3">
        <Button
          variant="nuclear"
          className="min-w-[100px]"
          onClick={() => handleDelete(id)}
        >
          Delete Salesman
        </Button>
      </div>
      <BodyCard title="Salesman">
        <div className="w-full flex mb-4 space-x-2">
          <InputField label="Name" {...register("name")} />
          <InputField
            label="Email"
            {...register("email", {
              validate: (value) => Validator.email(value),
            })}
          />
        </div>
        <div className="w-full flex mb-4 space-x-2">
          <InputField
            label="Password"
            {...register("password", {
              required: true,
              validate: (value) => !!Validator.phone(value),
            })}
          />
          <InputField
            label="Phone number"
            {...register("phone", {
              validate: Validator.phone,
            })}
            placeholder="+45 42 42 42 42"
          />
        </div>
        <div className="flex space-x-2">
          <Controller
            control={control}
            name="regions"
            render={({ field: { value, onChange } }) => {
              return (
                <ExperimentalSelect
                  label={`Regions`}
                  options={countryOptions}
                  onChange={onChange}
                  isMulti
                  selectAll
                />
              );
            }}
          />
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
            loading={updateCustomer.isLoading}
            disabled={!isDirty || updateCustomer.isLoading}
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
