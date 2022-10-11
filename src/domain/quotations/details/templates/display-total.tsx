import React from "react";
import clsx from "clsx";
import { formatAmountWithSymbol } from "../../../../utils/prices";

export const DisplayTotal = ({
  totalAmount,
  totalTitle,
  currency,
  variant = "regular",
  subtitle = "",
  totalColor = "text-grey-90",
}) => (
  <div className="flex justify-between mt-4 items-center">
    <div className="flex flex-col">
      <div
        className={clsx("text-grey-90", {
          "inter-small-regular": variant === "regular",
          "inter-small-semibold": variant === "large" || variant === "bold",
        })}
      >
        {totalTitle}
      </div>
      {subtitle && (
        <div className="inter-small-regular text-grey-50 mt-1">{subtitle}</div>
      )}
    </div>
    <div className="grid grid-cols-2 small:space-x-2 medium:space-x-4 large:space-x-5 justify-end">
      <div
        className={clsx("text-right inter-small-regular shrink-0", totalColor, {
          "!font-normal": variant === "regular",
          "!font-bold": variant === "bold" || variant === "large",
        })}
      >
        {formatAmountWithSymbol({
          amount: totalAmount,
          currency,
        })}
      </div>
      <div
        className={clsx("text-right inter-small-regular w-11", totalColor, {
          "!font-normal": variant === "regular",
          "!font-bold": variant === "bold" || variant === "large",
        })}
      >
        {currency.toUpperCase()}
      </div>
    </div>
  </div>
);
