import React from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { useAdminCreateCustomer } from "../../../medusa-react"
import ExperimentalSelect from "../../../src/components/molecules/select/next-select/select"
import Button from "../../components/fundamentals/button"
import LockIcon from "../../components/fundamentals/icons/lock-icon"
import InputField from "../../components/molecules/input"

import Modal from "../../components/molecules/modal"
import useNotification from "../../hooks/use-notification"
import { countries } from "../../utils/countries"
import { getErrorMessage } from "../../utils/error-messages"
import { validateEmail } from "../../utils/validate-email"
import { validatePass } from "../../utils/validate-pass"

const countryOptions = countries.map((c) => ({
  label: c.name,
  value: c.alpha2,
}))

type CreateCustomerModalProps = {
  handleClose: () => void
}

type CreateCustomerFormType = {
  first_name: string
  last_name: string
  email: string
  phone: string | null
  password: string
  regions: {
    label: string
    value: string
  }[]
}

const CreateCustomerModal = ({ handleClose }: CreateCustomerModalProps) => {
  const {
    register,
    reset,
    handleSubmit,
    control,

    formState: { isDirty },
  } = useForm<CreateCustomerFormType>({
    mode: "onChange",
  })
  const watch = useWatch({
    control,
  })

  const notification = useNotification()

  const createCustomer = useAdminCreateCustomer({})

  const onSubmit = handleSubmit((data) => {
    createCustomer.mutate(
      {
        first_name: data.first_name,
        last_name: data.last_name,
        // @ts-ignore
        phone: data.phone,
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          handleClose()
          notification("Success", "Successfully created customer", "success")
        },
        onError: (err) => {
          handleClose()
          notification("Error", getErrorMessage(err), "error")
        },
      }
    )
  })

  return (
    <Modal handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <span className="inter-xlarge-semibold">Salesman Create</span>
        </Modal.Header>
        <Modal.Content>
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
                validate: (value) => !!validateEmail(value),
              })}
              prefix={<LockIcon size={16} className="text-grey-50" />}
            />
            <InputField
              label="Phone number"
              {...register("phone")}
              placeholder="+45 42 42 42 42"
            />
          </div>
          <div className="flex space-x-2">
            <InputField
              label="Password"
              {...register("password", {
                validate: (value) => !!validatePass(value),
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
                )
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
  )
}

export default CreateCustomerModal
