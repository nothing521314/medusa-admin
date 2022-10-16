import { useAdminCreateUser, useAdminRegions } from "@medusa-react";
import { AdminCreateUserRequest } from "@medusa-types";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import FormValidator from "src/utils/form-validator";
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
    formState: { isDirty, errors },
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
                required: FormValidator.required("Name"),
              })}
              errors={errors}
            />
            <InputField
              label="Email"
              {...register("email", {
                validate: Validator.email,
              })}
              errors={errors}
            />
          </div>
          <div className="w-full flex mb-4 space-x-2">
            <InputField
              label="Password"
              type={"password"}
              {...register("password", {
                validate: Validator.pass,
              })}
              errors={errors}
              // prefix={<LockIcon size={16} className="text-grey-50" />}
            />
            <InputField
              label="Phone number"
              {...register("phone", {
                validate: Validator.phone,
              })}
              errors={errors}
            />
          </div>
          <div className="flex space-x-2">
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
                field: { onChange, name },
                formState: { errors },
              }) => {
                return (
                  <ExperimentalSelect
                    isLoading={isLoadingRegions}
                    label={"Market Region"}
                    name={name}
                    options={regions?.map((v) => ({
                      value: v.id!,
                      label: v.name,
                    }))}
                    onChange={(v) => {
                      onChange(v.map((e) => e.value));
                    }}
                    isMulti
                    errors={errors}
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
