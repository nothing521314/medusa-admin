import { Customer } from "@medusa-types";
import { RouteComponentProps } from "@reach/router";
import { navigate } from "gatsby";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import
  {
    useAdminCustomer,
    useAdminUpdateCustomer
  } from "../../../medusa-react";
import Button from "../../components/fundamentals/button";
import Breadcrumb from "../../components/molecules/breadcrumb";
import InputField from "../../components/molecules/input";
import BodyCard from "../../components/organisms/body-card";
import useNotification from "../../hooks/use-notification";
import { getErrorMessage } from "../../utils/error-messages";
import Validator from "../../utils/validator";

type CustomerDetailProps = {
  id: string;
} & RouteComponentProps;

const CustomerDetail: React.FC<CustomerDetailProps> = ({ id }) => {
  const [customer, setCustomer] = useState<Customer>();
  const {
    register,
    reset,
    handleSubmit,
    formState: { isDirty, isValid },
  } = useForm<Customer>();
  const notification = useNotification();
  const updateCustomer = useAdminUpdateCustomer(id);
  // Fetch info
  useAdminCustomer(id, {
    onSuccess(data) {
      const { email, name, phone, address, person_in_charge } = data.customer;
      setCustomer({
        email,
        name,
        phone,
        address,
        person_in_charge,
      });
    },
    cacheTime: 0,
  });

  const onSubmit = handleSubmit((data) => {
    updateCustomer.mutate(data, {
      onSuccess: () => {
        notification("Success", "Successfully updated customer", "success");
      },
      onError: (err) => {
        notification("Error", getErrorMessage(err), "error");
      },
    });
  });

  useEffect(() => {
    if (customer) reset(customer);
  }, [customer, reset]);

  if (!customer) {
    return null;
  }

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
          <InputField label="Name" {...register("name")} />
          <InputField
            label="Person in charge"
            {...register("person_in_charge", {
              required: true,
            })}
            placeholder=""
            prefix={"Mr/Mrs"}
          />
        </div>
        <div className="flex mb-4 space-x-2">
          <InputField
            label="Email"
            {...register("email", {
              validate: (value) => Validator.email(value),
            })}
          />
          <InputField
            label="Phone number"
            {...register("phone", {
              required: true,
              validate: (value) => !!Validator.phone(value),
            })}
          />
        </div>
        <div className="flex space-x-2">
          <InputField
            label="Address"
            {...register("address", {
              required: true,
            })}
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
