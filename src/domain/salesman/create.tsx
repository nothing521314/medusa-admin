import { AdminCreateUserRequest } from "@medusa-types";
import React from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  useAdminCreateCustomer,
  useAdminCreateUser,
} from "../../../medusa-react";
import ExperimentalSelect from "../../../src/components/molecules/select/next-select/select";
import Button from "../../components/fundamentals/button";
import LockIcon from "../../components/fundamentals/icons/lock-icon";
import InputField from "../../components/molecules/input";

import Modal from "../../components/molecules/modal";
import useNotification from "../../hooks/use-notification";
import { countries } from "../../utils/countries";
import { getErrorMessage } from "../../utils/error-messages";
import Validator from "../../utils/validator";

const countryOptions = countries.map((c) => ({
  label: c.name,
  value: c.alpha2,
}));

type CreateCustomerModalProps = {
  handleClose: () => void;
};

const CreateCustomerModal = ({ handleClose }: CreateCustomerModalProps) => {
  const {
    register,
    reset,
    handleSubmit,
    control,

    formState: { isDirty },
  } = useForm<AdminCreateUserRequest>({
    mode: "onChange",
  });
  const watch = useWatch({
    control,
  });

  const notification = useNotification();

  const createCustomer = useAdminCreateUser({});

  const onSubmit = handleSubmit((data) => {
    createCustomer.mutate(data, {
      onSuccess: () => {
        handleClose();
        notification("Success", "Successfully created customer", "success");
      },
      onError: (err) => {
        handleClose();
        notification("Error", getErrorMessage(err), "error");
      },
    });
  });

  return (
    <Modal handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <span className="inter-xlarge-semibold">Salesman Create</span>
        </Modal.Header>
        <Modal.Content>
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
            <InputField
              label="Password"
              {...register("password", {
                validate: (value) => !!Validator.pass(value),
              })}
              prefix={<LockIcon size={16} className="text-grey-50" />}
            />
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
        </Modal.Content>
        <Modal.Footer>
          <div className="w-full flex justify-end">
            <Button
              variant="ghost"
              size="small"
              onClick={handleClose}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button
              loading={createCustomer.isLoading}
              disabled={!isDirty || createCustomer.isLoading}
              variant="primary"
              className="min-w-[100px]"
              size="small"
              onClick={onSubmit}
            >
              Save
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  );
};

export default CreateCustomerModal;
