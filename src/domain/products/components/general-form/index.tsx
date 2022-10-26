import { Product } from "@medusa-types";
import React, { useContext } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { NextSelect } from "src/components/molecules/select/next-select";
import { KEY } from "src/constants/misc";
import { AccountContext } from "src/context/account";
import InputField from "../../../../components/molecules/input";
import TextArea from "../../../../components/molecules/textarea";
import FormValidator from "../../../../utils/form-validator";
import useOrganizeData from "../organize-form/use-organize-data";

type Props = {
  mode?: "new" | "edit";
  form: UseFormReturn<Product, any>;
};

const GeneralForm = ({ mode = "new", form }: Props) => {
  const {
    register,
    formState: { errors },
    control,
  } = form;
  const isModeEdit = mode === "edit";
  const { isAdmin } = useContext(AccountContext);

  let { collectionOptions } = useOrganizeData();

  // Mode edit : Remove option hw
  if (isModeEdit) {
    collectionOptions = collectionOptions.filter(
      (v) => v?.value !== KEY.ID_CATEGORY_HW
    );
  }

  return (
    <>
      <div className="grid grid-cols-4 gap-x-large mb-small">
        <InputField
          className="col-span-2"
          label="Name"
          readOnly={!isAdmin}
          // required
          {...register("title", {
            required: FormValidator.required("Title"),
            minLength: {
              value: 1,
              message: "Title must be at least 1 character",
            },
            pattern: FormValidator.whiteSpaceRule("Title"),
          })}
          errors={errors}
        />
        <Controller
          name={"collection"}
          control={control}
          rules={{
            required: FormValidator.required("Category"),
          }}
          render={({ field: { value, onChange, ...rest } }) => {
            return (
              <NextSelect
                readOnly={!isAdmin}
                label="Category"
                isDisabled={
                  !isAdmin ||
                  (isModeEdit && value?.value === KEY.ID_CATEGORY_HW)
                }
                onChange={onChange}
                options={collectionOptions}
                value={value}
                placeholder="Choose a category"
                // isClearable
                errors={errors}
                {...rest}
              />
            );
          }}
        />
        <InputField
          label="Brand"
          readOnly={!isAdmin}
          {...register("brand", {
            required: FormValidator.required("Brand"),
            minLength: {
              value: 1,
              message: "Brand must be at least 1 character",
            },
            pattern: FormValidator.whiteSpaceRule("Brand"),
          })}
          errors={errors}
        />
      </div>
      <div className="grid grid-cols-2  gap-x-large mb-small">
        <TextArea
          readOnly={!isAdmin}
          label="Description"
          placeholder="A warm and cozy jacket..."
          rows={4}
          {...register("description", {
            required: FormValidator.required("Description"),
          })}
          errors={errors}
        />
        <div className="grid grid-rows-2 gap-x-large ">
          <InputField
            readOnly={!isAdmin}
            label="Dimension"
            {...register("dimension", {
              required: FormValidator.required("Dimension"),
            })}
            errors={errors}
          />
          <InputField
            readOnly={!isAdmin}
            label="Weight (Kilograms)"
            {...register("weight", {
              required: FormValidator.required("Weight (Kilograms)"),
              validate: FormValidator.requiredNumber("Weight (Kilograms)"),
              valueAsNumber: true,
            })}
            errors={errors}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-large">
        <InputField
          readOnly={!isAdmin}
          label="Delivery Lead Time"
          {...register("delivery_lead_time", {
            required: FormValidator.required("Delivery Lead Time"),
          })}
          errors={errors}
        />
        <InputField
          readOnly={!isAdmin}
          label="Warranty"
          {...register("warranty", {
            required: FormValidator.required("Warranty"),
          })}
          errors={errors}
        />
      </div>
    </>
  );
};

export default GeneralForm;
