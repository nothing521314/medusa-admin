import { Customer } from "@medusa-types";
import { RouteComponentProps } from "@reach/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SelectComponents } from "../../../components/molecules/select/select-components";
import {
  useAdminCustomer,
  useAdminUpdateCustomer,
} from "../../../../medusa-react";
import LockIcon from "../../../components/fundamentals/icons/lock-icon";
import Breadcrumb from "../../../components/molecules/breadcrumb";
import InputField from "../../../components/molecules/input";
import Section from "../../../components/organisms/section";
import BodyCard from "../../../components/organisms/body-card";
import useNotification from "../../../hooks/use-notification";
import Button from "../../../components/fundamentals/button";
import { getErrorMessage } from "../../../utils/error-messages";
import Validator from "../../../utils/validator";
import { navigate } from "gatsby";

type CustomerDetailProps = {
  id: string;
} & RouteComponentProps;

type EditCustomerFormType = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
};

const CustomerDetail: React.FC<CustomerDetailProps> = ({ id }) => {
  const [customer, setCustomer] = useState<Customer>();
  const {
    register,
    reset,
    handleSubmit,
    formState: { isDirty, isValid },
  } = useForm<EditCustomerFormType>();
  const notification = useNotification();
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
          notification("Success", "Successfully updated customer", "success");
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
        currentPage={"Customer Details"}
        previousBreadcrumb={"Customers"}
        previousRoute="/a/customers"
      />
      {/* <div className="flex justify-end m-3">
        <Button
          variant="nuclear"
          className="min-w-[100px]"
          // onClick={() => setShowCreate(true)}
        >
          Delete Salesman
        </Button>
      </div> */}
      <BodyCard title="Customer">
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
        <div className="flex space-x-2">
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
        <div className="mt-6 w-full flex justify-center">
          <Button
            variant="danger"
            onClick={() => navigate(`/a/customers`)}
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

export default CustomerDetail;

const getDefaultValues = (customer: Customer): EditCustomerFormType => {
  return {
    first_name: customer.first_name,
    email: customer.email,
    last_name: customer.last_name,
    phone: customer.phone,
  };
};
