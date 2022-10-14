import { useAdminCreateUser, useAdminRegions } from "@medusa-react";
import { AdminCreateUserRequest } from "@medusa-types";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import ExperimentalSelect from "../../../src/components/molecules/select/next-select/select";
import Button from "../../components/fundamentals/button";
import InputField from "../../components/molecules/input";

import Modal from "../../components/molecules/modal";
import useNotification from "../../hooks/use-notification";
import { getErrorMessage } from "../../utils/error-messages";
import Validator from "../../utils/validator";

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
  } = useForm<AdminCreateUserRequest>();
  const { regions, isLoading: isLoadingRegions } = useAdminRegions();
  const createCustomer = useAdminCreateUser({});
  const notification = useNotification();

  const onSubmit = handleSubmit((data) => {
    createCustomer.mutate(
      {
        ...data,
        role: "sale_man",
      },
      {
        onSuccess: () => {
          handleClose();
          notification("Success", "Successfully created customer", "success");
        },
        onError: (err) => {
          handleClose();
          notification("Error", getErrorMessage(err), "error");
        },
      }
    );
  });

  return (
    <Modal handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <span className="inter-xlarge-semibold">Salesman Create</span>
        </Modal.Header>
        <Modal.Content>
          <div className="w-full flex mb-4 space-x-2">
            <InputField
              label="Name"
              {...register("name", {
                required: true,
              })}
            />
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
              type={"password"}
              {...register("password", {
                required: true,
                validate: (value) => Validator.pass(value),
              })}
              // prefix={<LockIcon size={16} className="text-grey-50" />}
            />
            <InputField
              label="Phone number"
              {...register("phone", {
                validate: Validator.phone,
              })}
            />
          </div>
          <div className="flex space-x-2">
            <Controller
              control={control}
              name="regions"
              rules={{
                required: true,
              }}
              render={({ field: { value, onChange } }) => {
                return (
                  <ExperimentalSelect
                    isLoading={isLoadingRegions}
                    label={"Market Region"}
                    options={regions?.map((v) => ({
                      value: v.id!,
                      label: v.name,
                    }))}
                    onChange={(v) => {
                      onChange(v.map((e) => e.value));
                    }}
                    isMulti
                    selectAll
                  />
                );
              }}
            />
            <InputField className="invisible" />
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
