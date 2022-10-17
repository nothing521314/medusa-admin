import { CartContext, IProductAdded } from "@medusa-react";
import { Region } from "@medusa-types";
import clsx from "clsx";
import React, { useCallback, useContext, useMemo } from "react";
import MinusIcon from "src/components/fundamentals/icons/minus-icon";
import PlusIcon from "src/components/fundamentals/icons/plus-icon";
import { SUB_TAB } from "../..";
import ImagePlaceholder from "../../../../components/fundamentals/image-placeholder";
import { formatAmountWithSymbol } from "../../../../utils/prices";

type OrderLineProps = {
  item: IProductAdded;
  readOnly?: boolean;
  region?: Region;
  tab?: string;
};

const OrderLine = ({ item, readOnly, region, tab }: OrderLineProps) => {
  // const { priceItem, quantity } = useMemo(() => {
  //   if ((item as any).unit_price) {
  //     return {
  //       priceItem: (item as any).unit_price,
  //       quantity: (item as any).volume,
  //     };
  //   }
  //   if (!region) {
  //     return {
  //       priceItem: 0,
  //       quantity: 0,
  //     };
  //   }

  //   const priceRegion = item?.prices.find(
  //     (item) => item.region_id === region?.id
  //   );
  //   if (!priceRegion) {
  //     return {
  //       priceItem: 0,
  //       quantity: 0,
  //     };
  //   }

  //   return {
  //     priceItem: priceRegion.price,
  //   };
  // }, [item, region]);

  const lineData = useMemo(() => {
    console.log(item);
    if (tab === SUB_TAB.MAKE_QUOTATION) {
      return {
        // priceItem:
        //   item?.prices.find((item) => item.region_id === region?.id)?.price ||
        //   0,
        priceItem: 0,
        quantity: item.quantity,
        thumbnail: item.thumbnail,
        id: item.id,
        quotation_lines: item.quotation_lines,
        title: item.title,
      };
    }
    return {
      priceItem: item.quantity,
      quantity: item.quantity,
      thumbnail: item.thumbnail,
      id: item.id,
      quotation_lines: item.quotation_lines,
      title: item.title,
    };
  }, [item, tab]);

  const {
    handleAddToCart,
    handleDeleteFromCart,
    handleAddHarwareToCart,
  } = useContext(CartContext);

  const renderNumberOfProduct = useCallback(
    (data) => {
      if (!readOnly) {
        return (
          <div className="flex flex-row items-center">
            <div
              className="border border-grey-50 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
              onClick={() => {
                if (!handleDeleteFromCart) return;
                handleDeleteFromCart(data);
              }}
            >
              <MinusIcon size={10} />
            </div>
            <div className="inter-small-regular text-grey-50 w-11 text-center select-none">
              x {data.quantity}
            </div>
            <div
              className="border border-grey-50 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
              onClick={() => {
                if (data.quotation_lines) {
                  handleAddToCart && handleAddToCart(data);
                } else {
                  handleAddHarwareToCart &&
                    handleAddHarwareToCart(item.id!, [data]);
                }
              }}
            >
              <PlusIcon size={10} />
            </div>
          </div>
        );
      }
      return (
        <div className="inter-small-regular text-grey-50 w-16 select-none text-center shrink-0">
          x {data.quantity}
        </div>
      );
    },
    [handleAddHarwareToCart, handleAddToCart, handleDeleteFromCart, item.id, readOnly]
  );

  const renderChildrenProduct = useCallback(() => {
    if (!lineData.quotation_lines?.length) return;

    return lineData.quotation_lines?.map((child, index) => {
      return (
        <div
          className="flex items-center justify-between mb-1 h-[64px] rounded-lg"
          key={index}
        >
          <div className="flex space-x-4 justify-center ml-12">
            <div className="flex h-12 w-9 rounded-rounded overflow-hidden">
              {child.thumbnail ? (
                <img src={child.thumbnail} className="object-cover" />
              ) : (
                <ImagePlaceholder />
              )}
            </div>
            <div className="flex flex-col justify-center max-w-[185px]">
              <span className="inter-small-regular text-grey-90 truncate"></span>
            </div>
          </div>
          <div
            className={clsx(
              "grid grid-cols-4 small:space-x-2 medium:space-x-4 large:space-x-5",
              "items-center justify-items-end w-1/3"
            )}
          >
            <div className="inter-small-regular text-grey-50">
              {formatAmountWithSymbol({
                amount: 0,
                currency: region?.currency_code || "",
                digits: 2,
                tax: region?.tax_rate,
              })}
            </div>
            {renderNumberOfProduct(child)}
            <div className="inter-small-regular text-grey-90 shrink-0">
              {formatAmountWithSymbol({
                amount: 0,
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
    });
  }, [
    lineData.quotation_lines,
    region?.currency_code,
    region?.tax_rate,
    renderNumberOfProduct,
  ]);

  return (
    <React.Fragment>
      <div className="flex items-center justify-between mb-1 h-[64px] rounded-lg">
        <div className="flex space-x-4 justify-center">
          <div className="flex h-12 w-9 rounded-rounded overflow-hidden">
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
          </div>
        </div>
        <div
          className={clsx(
            "grid grid-cols-4 small:space-x-2 medium:space-x-4 large:space-x-5",
            "items-center justify-items-end w-1/3"
          )}
        >
          <div className="inter-small-regular text-grey-50">
            {formatAmountWithSymbol({
              amount: lineData.priceItem,
              currency: region?.currency_code || "",
              digits: 2,
              tax: region?.tax_rate,
            })}
          </div>
          {renderNumberOfProduct(lineData)}
          <div className="inter-small-regular text-grey-90 shrink-0">
            {formatAmountWithSymbol({
              amount: lineData.priceItem * lineData.quantity,
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
      {renderChildrenProduct()}
    </React.Fragment>
  );
};

export default OrderLine;
