import { Customer } from "@medusajs/medusa";
import { RouteComponentProps } from "@reach/router";
import { navigate } from "gatsby";
import React, { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useSalesmanActions } from "src/hooks/use-salesman-actions";
import {
  useAdminCustomer,
  useAdminUpdateCustomer,
} from "../../../medusa-react";
import ExperimentalSelect from "../../../src/components/molecules/select/next-select/select";
import Button from "../../components/fundamentals/button";
import LockIcon from "../../components/fundamentals/icons/lock-icon";
import Breadcrumb from "../../components/molecules/breadcrumb";
import InputField from "../../components/molecules/input";
import BodyCard from "../../components/organisms/body-card";
import useNotification from "../../hooks/use-notification";
import { countries } from "../../utils/countries";
import { getErrorMessage } from "../../utils/error-messages";
import Validator from "../../utils/validator";

type CustomerDetailProps = {
  id: string;
} & RouteComponentProps;

type EditCustomerFormType = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  regions?: {
    label: string;
    value: string;
  }[];
};

const countryOptions = countries.map((c) => ({
  label: c.name,
  value: c.alpha2,
}));

const SalesmanDetail: React.FC<CustomerDetailProps> = ({ id }) => {
  const [customer, setCustomer] = useState<Customer>();
  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { isDirty, isValid },
  } = useForm<EditCustomerFormType>();
  const watch = useWatch({
    control,
  });
  const notification = useNotification();
  const { handleDelete } = useSalesmanActions();
  const updateCustomer = useAdminUpdateCustomer(id);
  // Fetch info
  useAdminCustomer(id, {
    onSuccess(data) {
      setCustomer(data.customer);
    },
    cacheTime: 0,
  });

  const onSubmit = handleSubmit((data) => {
    updateCustomer.mutate(
      {
        first_name: data.first_name,
        last_name: data.last_name,
        // @ts-ignore
        phone: data.phone,
        email: data.email,
      },
      {
        onSuccess: () => {
          notification("Success", "Successfully updated salesman", "success");
        },
        onError: (err) => {
          notification("Error", getErrorMessage(err), "error");
        },
      }
    );
  });

  useEffect(() => {
    if (customer) reset(getDefaultValues(customer));
  }, [customer]);

  const customerName = () => {
    if (customer?.first_name && customer?.last_name) {
      return `${customer.first_name} ${customer.last_name}`;
    } else {
      return customer?.email;
    }
  };
  console.log(
    "!isDirty || !isValid || updateCustomer.isLoading",
    !isDirty,
    !isValid,
    updateCustomer.isLoading
  );

  if (!customer) return null;

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
          <InputField
            label="First Name"
            {...register("first_name")}
            placeholder="Lebron"
          />
          <InputField
            label="Last Name"
            {...register("last_name")}
            placeholder="James"
          />
        </div>
        <div className="w-full flex mb-4 space-x-2">
          <InputField
            label="Email"
            {...register("email", {
              validate: Validator.email,
              disabled: customer.has_account,
            })}
            prefix={
              customer.has_account && (
                <LockIcon size={16} className="text-grey-50" />
              )
            }
            disabled={customer.has_account}
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

const getDefaultValues = (customer: Customer): EditCustomerFormType => {
  return {
    first_name: customer.first_name,
    email: customer.email,
    last_name: customer.last_name,
    phone: customer.phone,
    regions: undefined,
  };
};
