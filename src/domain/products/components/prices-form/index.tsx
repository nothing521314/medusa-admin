import { IPrice, Product, Region } from "@medusa-types";
import React, { useContext } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import MapPinIcon from "src/components/fundamentals/icons/map-pin-icon";
import { AccountContext } from "src/context/account";
import PriceFormInput from "./price-form-input";

type Props = {
  form: UseFormReturn<Product, any>;
  mode?: "new" | "edit";
};

const PricesForm = ({ form: { control } }: Props) => {
  const { isAdmin, regions } = useContext(AccountContext);

  return (
    <React.Fragment>
      {(regions as Region[])?.map((rp, index) => {
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
                <span className="inter-base-regular text-grey-50">
                  {rp.name}
                </span>
                {/* <IncludesTaxTooltip includesTax={rp.includes_tax} /> */}
              </div>
            </div>
            <Controller
              name={`prices.${index}`}
              control={control}
              render={({
                field: { value, onChange },
                formState: { errors },
              }) => {
                const { value: price } = value ?? {};
                return (
                  <PriceFormInput
                    readOnly={!isAdmin}
                    onChange={(v) =>
                      onChange({ value: v, region: rp.id } as IPrice)
                    }
                    amount={price || undefined}
                    currencyCode={rp.currency_code.toUpperCase()}
                    errors={errors}
                  />
                );
              }}
            />
          </div>
        );
      })}
    </React.Fragment>
  );
};

export default PricesForm;
