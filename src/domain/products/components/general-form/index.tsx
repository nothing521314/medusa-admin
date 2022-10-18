import { Product } from "@medusa-types";
import React from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { NextSelect } from "src/components/molecules/select/next-select";
import { KEY } from "src/constants/misc";
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
                label="Category"
                isDisabled={isModeEdit && value?.value === KEY.ID_CATEGORY_HW}
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
            label="Dimension"
            {...register("dimension", {
              required: FormValidator.required("Dimension"),
            })}
            errors={errors}
          />
          <InputField
            label="Weight (Kilograms)"
            type="number"
            {...register("weight", {
              required: FormValidator.required("Weight (Kilograms)"),
              min: FormValidator.nonNegativeNumberRule("Weight"),
              valueAsNumber: true,
            })}
            errors={errors}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-large">
        <InputField
          label="Delivery Lead Time"
          {...register("delivery_lead_time", {
            required: FormValidator.required("Delivery Lead Time"),
          })}
          errors={errors}
        />
        <InputField
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
