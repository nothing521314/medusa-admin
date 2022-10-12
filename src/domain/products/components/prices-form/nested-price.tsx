import clsx from "clsx";
import React from "react";
import { Controller } from "react-hook-form";
import { NestedPriceObject, PricesFormType } from ".";
import IncludesTaxTooltip from "../../../../components/atoms/includes-tax-tooltip";
import CoinsIcon from "../../../../components/fundamentals/icons/coins-icon";
import MapPinIcon from "../../../../components/fundamentals/icons/map-pin-icon";
import TriangleRightIcon from "../../../../components/fundamentals/icons/triangle-right-icon";
import useToggleState from "../../../../hooks/use-toggle-state";
import { currencies } from "../../../../utils/currencies";
import { NestedForm } from "../../../../utils/nested-form";
import PriceFormInput from "./price-form-input";

type Props = {
  form: NestedForm<PricesFormType>;
  nestedPrice: NestedPriceObject;
};

const NestedPrice = ({ form, nestedPrice }: Props) => {
  const { state, toggle } = useToggleState();

  const { control, path } = form;
  const { regionPrices } = nestedPrice;
  return regionPrices.map((rp) => {
    console.log("regionPrices", rp.currency_code.toUpperCase());
    return (
      <div
        className="grid grid-cols-[1fr_223px] p-2xsmall  hover:bg-grey-5 focus-within:bg-grey-5 transition-colors rounded-rounded justify-between"
        key={rp.id}
      >
        <div className="flex items-center gap-x-small">
          <div className="w-10 h-10 bg-grey-10 rounded-rounded text-grey-50 flex items-center justify-center">
            <MapPinIcon size={20} />
          </div>
          <div className="flex items-center gap-x-xsmall">
            <span className="inter-base-regular text-grey-50">
              {rp.regionName}
            </span>
            <IncludesTaxTooltip includesTax={rp.includes_tax} />
          </div>
        </div>
        <Controller
          name={path(`prices.${rp.index}.amount`)}
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
  });
};

export default NestedPrice;
