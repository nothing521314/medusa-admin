import { CartContext, IProductAdded } from "@medusa-react";
import { Region } from "@medusa-types";
import clsx from "clsx";
import React, { useCallback, useContext } from "react";
import MinusIcon from "src/components/fundamentals/icons/minus-icon";
import PlusIcon from "src/components/fundamentals/icons/plus-icon";
import ImagePlaceholder from "../../../../components/fundamentals/image-placeholder";
import { formatAmountWithSymbol } from "../../../../utils/prices";

type OrderLineProps = {
  item: IProductAdded;
  readOnly?: boolean;
  region?: Region;
  tab?: string;
};

const OrderLine = ({ item, readOnly, region }: OrderLineProps) => {
  const {
    handleAddToCart,
    handleDeleteFromCart,
    handleAddHarwareToCart,
    handleDeleteHarwareToCart,
    handleAddGameOption,
  } = useContext(CartContext);

  const renderNumberOfProduct = useCallback(
    (data, isChild = false) => {
      if (!readOnly) {
        return (
          <div className="flex flex-row items-center">
            <div
              className="border border-grey-50 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
              onClick={() => {
                if (!isChild) {
                  handleDeleteFromCart && handleDeleteFromCart({ ...data });
                } else {
                  handleDeleteHarwareToCart &&
                    handleDeleteHarwareToCart(item.id!, [data]);
                }
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
                if (!isChild) {
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
    [
      handleAddHarwareToCart,
      handleAddToCart,
      handleDeleteFromCart,
      handleDeleteHarwareToCart,
      item.id,
      readOnly,
    ]
  );

  const getNumberTimes = useCallback((num): string => {
    if (num === 1) return "1st";
    if (num === 2) return "2nd";
    if (num === 3) return "3rd";
    return `${num}th`;
  }, []);

  const handleOnChange = useCallback(
    (product: string, hardware: string, value: string) => {
      if (!handleAddGameOption) return;
      handleAddGameOption(product, hardware, value);
    },
    [handleAddGameOption]
  );

  const renderGameOptions = useCallback(() => {
    if (!item.child_product?.length) return;
    return (
      <div className="flex justify-between mb-1 rounded-lg">
        <div className="flex space-x-4 justify-center ml-12 inter-small-regular text-grey-90 truncate">
          Game attached (optional):
        </div>
        <div className="flex flex-col gap-y-4">
          {item.child_product.map((child, index) => (
            <input
              key={index}
              readOnly={readOnly}
              placeholder={`Enter the game for ${getNumberTimes(
                index + 1
              )} machine`}
              className={clsx(
                "outline-none focus-within:outline-none border px-2 py-1 rounded-lg w-full",
                "focus-within:shadow-input focus-within:border-violet-60 focus-within:bg-grey-5"
              )}
              maxLength={100}
              value={child?.game || ""}
              onChange={(e) =>
                handleOnChange(item.id!, child.id, e.target.value)
              }
            />
          ))}
        </div>
      </div>
    );
  }, [getNumberTimes, handleOnChange, item.child_product, item.id, readOnly]);

  const renderChildrenProduct = useCallback(() => {
    if (!item.child_product?.length) return;
    return item.child_product?.map((child, index) => {
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
              <span className="inter-small-regular text-grey-90 truncate">
                {child.title}
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
                amount: child.priceItem || 0,
                currency: region?.currency_code || "",
                digits: 2,
                showPrefix: false,
                tax: region?.tax_rate,
              })}
            </div>
            {renderNumberOfProduct(child, true)}
            <div className="inter-small-regular text-grey-90 shrink-0">
              {formatAmountWithSymbol({
                amount: (child.priceItem || 0) * (child?.quantity || 0),
                currency: region?.currency_code || "",
                digits: 2,
                showPrefix: false,
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
    item.child_product,
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
              amount: item?.priceItem || 0,
              currency: region?.currency_code || "",
              digits: 2,
              showPrefix: false,
              tax: region?.tax_rate,
            })}
          </div>
          {renderNumberOfProduct(item, false)}
          <div className="inter-small-regular text-grey-90 shrink-0">
            {formatAmountWithSymbol({
              amount: (item?.priceItem || 0) * item.quantity,
              currency: region?.currency_code || "",
              digits: 2,
              showPrefix: false,
              tax: region?.tax_rate,
            })}
          </div>
          <div className="inter-small-regular text-grey-50 text-right w-11">
            {region?.currency_code.toUpperCase()}
          </div>
        </div>
      </div>
      {renderGameOptions()}
      {renderChildrenProduct()}
    </React.Fragment>
  );
};

export default OrderLine;
