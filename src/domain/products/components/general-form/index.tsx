import React from "react";
import { Controller } from "react-hook-form";
import { NextSelect } from "src/components/molecules/select/next-select";
import { Option } from "src/types/shared";
import InputField from "../../../../components/molecules/input";
import TextArea from "../../../../components/molecules/textarea";
import FormValidator from "../../../../utils/form-validator";
import { NestedForm } from "../../../../utils/nested-form";
import useOrganizeData from "../organize-form/use-organize-data";

export type GeneralFormType = {
  title: string;
  collection: Option | null;
  brand: string;
  description: string | null;
  width: number | null;
  height: number | null;
  weight: number | null;
  deliveryTime: string;
  warranty: string;

  handle: string;
  material: string | null;
};

type Props = {
  form: NestedForm<GeneralFormType>;
  requireHandle?: boolean;
};

const GeneralForm = ({ form, requireHandle = true }: Props) => {
  const {
    register,
    path,
    formState: { errors },
    control,
  } = form;
  const { collectionOptions } = useOrganizeData();

  return (
    <>
      <div className="grid grid-cols-4 gap-x-large mb-small">
        <InputField
          className="col-span-2"
          label="Name"
          // required
          {...register(path("title"), {
            required: "Title is required",
            minLength: {
              value: 1,
              message: "Title must be at least 1 character",
            },
            pattern: FormValidator.whiteSpaceRule("Title"),
          })}
          errors={errors}
        />
        <Controller
          name={path("collection")}
          control={control}
          render={({ field: { value, onChange } }) => {
            return (
              <NextSelect
                label="Category"
                onChange={onChange}
                options={collectionOptions}
                value={value}
                placeholder="Choose a category"
                isClearable
              />
            );
          }}
        />
        <InputField
          label="Brand"
          // required
          {...register(path("brand"), {
            required: "Brand is required",
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
          {...register(path("description"))}
          errors={errors}
        />
        <div>
          <div className="grid grid-cols-2 gap-x-large mb-5">
            <InputField
              label="Height (cm)"
              type="number"
              {...register(path("height"), {
                min: FormValidator.nonNegativeNumberRule("Height"),
                valueAsNumber: true,
              })}
              errors={errors}
            />
            <InputField
              label="Width (cm)"
              type="number"
              {...register(path("width"), {
                min: FormValidator.nonNegativeNumberRule("Width"),
                valueAsNumber: true,
              })}
              errors={errors}
            />
          </div>
          <InputField
            label="Weight (Kilograms)"
            type="number"
            {...register(path("weight"), {
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
          {...register(path("deliveryTime"), {})}
          errors={errors}
        />
        <InputField
          label="Warranty"
          {...register(path("warranty"), {})}
          errors={errors}
        />
      </div>
    </>
  );
};

export default GeneralForm;
