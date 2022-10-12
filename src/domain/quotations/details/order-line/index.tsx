import { LineItem } from "@medusa-types";
import React, { useCallback } from "react";
import MinusIcon from "src/components/fundamentals/icons/minus-icon";
import PlusIcon from "src/components/fundamentals/icons/plus-icon";
import ImagePlaceholder from "../../../../components/fundamentals/image-placeholder";
import { formatAmountWithSymbol } from "../../../../utils/prices";

type OrderLineProps = {
  item: LineItem;
  currencyCode: string;
  readOnly?: boolean;
};

const OrderLine = ({ item, currencyCode, readOnly }: OrderLineProps) => {
  const renderNumberOfProduct = useCallback(() => {
    if (readOnly) {
      return (
        <div className="flex flex-row items-center space-x-2">
          <div className="border border-grey-50 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer">
            <MinusIcon size={10} />
          </div>
          <div className="inter-small-regular text-grey-50 w-8 text-right select-none">
            x {item.quantity}
          </div>
          <div className="border border-grey-50 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer">
            <PlusIcon size={10} />
          </div>
        </div>
      );
    }
    return (
      <div className="inter-small-regular text-grey-50 w-8 text-right select-none">
        x {item.quantity}
      </div>
    );
  }, [item.quantity, readOnly]);

  return (
    <div className="flex justify-between mb-1 h-[64px] py-2 mx-[-5px] px-[5px] hover:bg-grey-5 rounded-rounded">
      <div className="flex space-x-4 justify-center">
        <div className="flex h-[48px] w-[36px] rounded-rounded overflow-hidden">
          {item.thumbnail ? (
            <img src={item.thumbnail} className="object-cover" />
          ) : (
            <ImagePlaceholder />
          )}
        </div>
        <div className="flex flex-col justify-center max-w-[185px]">
          <span className="inter-small-regular text-grey-90 truncate">
            {item.title}
          </span>
          {item?.variant && (
            <span className="inter-small-regular text-grey-50 truncate">
              {`${item.variant.title}${
                item.variant.sku ? ` (${item.variant.sku})` : ""
              }`}
            </span>
          )}
        </div>
      </div>
      <div className="grid grid-cols-4 small:space-x-2 medium:space-x-4 large:space-x-5">
        <div className="inter-small-regular text-grey-50">
          {formatAmountWithSymbol({
            amount: item.unit_price,
            currency: currencyCode,
            digits: 2,
            tax: item.tax_lines,
          })}
        </div>
        {renderNumberOfProduct()}
        <div className="inter-small-regular text-grey-90 shrink-0">
          {formatAmountWithSymbol({
            amount: item.unit_price * item.quantity,
            currency: currencyCode,
            digits: 2,
            tax: item.tax_lines,
          })}
        </div>
        <div className="inter-small-regular text-grey-50 text-right w-11">
          {currencyCode.toUpperCase()}
        </div>
      </div>
    </div>
  );
};

export default OrderLine;
