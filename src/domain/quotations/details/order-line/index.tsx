import { CartContext, IProductAdded } from "@medusa-react";
import { Region } from "@medusa-types";
import React, { useCallback, useContext, useMemo } from "react";
import MinusIcon from "src/components/fundamentals/icons/minus-icon";
import PlusIcon from "src/components/fundamentals/icons/plus-icon";
import ImagePlaceholder from "../../../../components/fundamentals/image-placeholder";
import { formatAmountWithSymbol } from "../../../../utils/prices";

type OrderLineProps = {
  item: IProductAdded;
  readOnly?: boolean;
  region?: Region;
};

const OrderLine = ({ item, readOnly, region }: OrderLineProps) => {
  const { priceItem } = useMemo(() => {
    if (!region)
      return {
        priceItem: 0,
      };
    const priceRegion = item?.prices.find(
      (item) => item.region_id === region?.id
    );
    if (!priceRegion) {
      return {
        priceItem: 0,
      };
    }

    return {
      priceItem: priceRegion.price,
    };
  }, [item?.prices, region]);
  
  const { handleAddToCart, handleDeleteFromCart } = useContext(CartContext);

  const renderNumberOfProduct = useCallback(() => {
    if (!readOnly) {
      return (
        <div className="flex flex-row items-center">
          <div
            className="border border-grey-50 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
            onClick={() => {
              if (!handleDeleteFromCart) return;
              handleDeleteFromCart(item);
            }}
          >
            <MinusIcon size={10} />
          </div>
          <div className="inter-small-regular text-grey-50 w-8 text-center select-none">
            x {item.quantity}
          </div>
          <div
            className="border border-grey-50 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
            onClick={() => {
              if (!handleAddToCart) return;
              handleAddToCart(item);
            }}
          >
            <PlusIcon size={10} />
          </div>
        </div>
      );
    }
    return (
      <div className="inter-small-regular text-grey-50 w-16 select-none text-center shrink-0">
        x {item.quantity}
      </div>
    );
  }, [handleAddToCart, handleDeleteFromCart, item, readOnly]);

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
          {/* {item?.variant && (
            <span className="inter-small-regular text-grey-50 truncate">
              {`${item.variant.title}${
                item.variant.sku ? ` (${item.variant.sku})` : ""
              }`}
            </span>
          )} */}
        </div>
      </div>
      <div className="flex small:space-x-2 medium:space-x-4 large:space-x-5 items-center justify-end">
        <div className="inter-small-regular text-grey-50">
          {formatAmountWithSymbol({
            amount: priceItem,
            currency: region?.currency_code || "",
            digits: 2,
            tax: region?.tax_rate,
          })}
        </div>
        {renderNumberOfProduct()}
        <div className="inter-small-regular text-grey-90 shrink-0">
          {formatAmountWithSymbol({
            amount: priceItem * item.quantity,
            currency: region?.currency_code || "",
            digits: 2,
            tax: region?.tax_rate,
          })}
        </div>
        <div className="inter-small-regular text-grey-50 text-right w-11">
          {region?.currency_code.toUpperCase()}
        </div>
      </div>
    </div>
  );
};

export default OrderLine;
