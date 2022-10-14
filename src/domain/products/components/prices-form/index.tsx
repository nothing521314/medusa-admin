import React from "react";
import { Controller, FieldArrayWithId, useFieldArray } from "react-hook-form";
import MapPinIcon from "src/components/fundamentals/icons/map-pin-icon";
import { useAdminRegions, useAdminStore } from "../../../../../medusa-react";
import { NestedForm } from "../../../../utils/nested-form";
import PriceFormInput from "./price-form-input";

type PricePayload = {
  id: string | null;
  amount: number | null;
  currency_code: string;
  region_id: string | null;
  includes_tax?: boolean;
};

type PriceObject = FieldArrayWithId<
  {
    __nested__: PricesFormType;
  },
  "__nested__.prices",
  "id"
> & { index: number };

export type PricesFormType = {
  prices: PricePayload[];
};

export type NestedPriceObject = {
  currencyPrice: PriceObject;
  regionPrices: (PriceObject & { regionName: string })[];
};

type Props = {
  form: NestedForm<PricesFormType>;
  required?: boolean;
};

/**
 * Re-usable nested form used to submit pricing information for products and their variants.
 * Fetches store currencies and regions from the backend, and allows the user to specifcy both
 * currency and region specific prices.
 * @example
 * <Pricing form={nestedForm(form, "prices")} />
 */
const PricesForm = ({ form }: Props) => {
  const { store } = useAdminStore();
  const { regions } = useAdminRegions();

  const { control, path } = form;

  const { append, update, fields } = useFieldArray({
    control,
    name: path("prices"),
  });

  return (
    regions?.map((rp, index) => {
      return (
        <div
          className="grid grid-cols-[1fr_303px] p-2xsmall  hover:bg-grey-5 focus-within:bg-grey-5 transition-colors rounded-rounded justify-between"
          key={rp.id}
        >
          <div className="flex items-center gap-x-small">
            <div className="w-10 h-10 bg-grey-10 rounded-rounded text-grey-50 flex items-center justify-center">
              <MapPinIcon size={20} />
            </div>
            <div className="flex items-center gap-x-xsmall">
              <span className="inter-base-regular text-grey-50">{rp.name}</span>
              {/* <IncludesTaxTooltip includesTax={rp.includes_tax} /> */}
            </div>
          </div>
          <Controller
            name={path(`prices.${index}.amount`)}
            control={control}
            render={({ field: { value, onChange }, formState: { errors } }) => {
              return (
                <PriceFormInput
                  onChange={onChange}
                  amount={value || undefined}
                  currencyCode={rp.currency_code.toUpperCase()}
                  errors={errors}
                />
              );
            }}
          />
        </div>
      );
    }) ?? <></>
  );
};

export default PricesForm;
