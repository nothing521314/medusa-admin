import { IProductAdded } from "@medusa-react";
import React, { useContext, useMemo } from "react";
import BodyCard from "src/components/organisms/body-card";
import { AccountContext } from "src/context/account";
import OrderLine from "../order-line";
import { DisplayTotal } from "../templates";

type Props = {
  summary?: IProductAdded[];
  readOnly?: boolean;
};

const SummaryPanel = ({ summary, readOnly = true }: Props) => {
  const {
    hasMovements,
    swapAmount,
  } = useMemo(() => {
    const manualRefund = 0;
    const swapRefund = 0;
    const returnRefund = 0;

    // const swapAmount = sum(summary.swaps.map((s) => s.difference_due) || [0]);

    // if (summary.refunds?.length) {
    //   summary.refunds.forEach((ref) => {
    //     if (ref.reason === "other" || ref.reason === "discount") {
    //       manualRefund += ref.amount;
    //     }
    //     if (ref.reason === "return") {
    //       returnRefund += ref.amount;
    //     }
    //     if (ref.reason === "swap") {
    //       swapRefund += ref.amount;
    //     }
    //   });
    // }
    return {
      hasMovements: swapAmount + manualRefund + swapRefund + returnRefund !== 0,
      swapAmount,
      manualRefund,
      swapRefund,
      returnRefund,
    };
  }, []);

  const { selectedRegion } = useContext(AccountContext);

  if (!summary || !selectedRegion) {
    return null;
  }

  return (
    <BodyCard className={"w-full mb-4 min-h-0 h-auto"} title="Summary">
      <div className="mt-6">
        {summary?.map((item, i) => (
          <OrderLine
            key={i}
            region={selectedRegion}
            item={item}
            readOnly={readOnly}
          />
        ))}
        <DisplayTotal
          currency={selectedRegion?.currency_code}
          totalAmount={0}
          totalTitle={"Subtotal"}
        />
        {/* {summary.discounts?.map((discount, index) => (
          <DisplayTotal
            key={index}
            currency={summary.currency_code}
            totalAmount={-1 * summary.discount_total}
            totalTitle={
              <div className="flex inter-small-regular text-grey-90 items-center">
                Discount:{" "}
                <Badge className="ml-3" variant="default">
                  {discount.code}
                </Badge>
              </div>
            }
          />
        ))} */}
        <DisplayTotal
          currency={selectedRegion?.currency_code}
          totalAmount={0}
          totalTitle={"Shipping"}
        />
        <DisplayTotal
          currency={selectedRegion?.currency_code}
          totalAmount={selectedRegion?.tax_code}
          totalTitle={"Tax"}
        />
        <DisplayTotal
          variant={"large"}
          currency={selectedRegion?.currency_code}
          totalAmount={0}
          totalTitle={hasMovements ? "Original Total" : "Total"}
        />
      </div>
    </BodyCard>
  );
};

export default SummaryPanel;
