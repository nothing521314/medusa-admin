import { useAdminCreateCustomer } from "@medusa-react";
import { AdminPostCustomersReq } from "@medusa-types";
import React from "react";
import { useForm } from "react-hook-form";
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
    formState: { isDirty },
  } = useForm<AdminPostCustomersReq>({
    defaultValues: {},
  });

  const notification = useNotification();

  const createCustomer = useAdminCreateCustomer({});

  const onSubmit = handleSubmit((data) => {
    createCustomer.mutate(
      { ...data, person_in_charge: "Mr" },
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
          <span className="inter-xlarge-semibold">Customer Create</span>
        </Modal.Header>
        <Modal.Content>
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
