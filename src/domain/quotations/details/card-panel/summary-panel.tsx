import { Order } from "@medusa-types";
import { sum } from "lodash";
import React, { useMemo } from "react";
import CopyToClipboard from "src/components/atoms/copy-to-clipboard";
import Badge from "src/components/fundamentals/badge";
import BodyCard from "src/components/organisms/body-card";
import OrderLine from "../order-line";
import { DisplayTotal, PaymentDetails } from "../templates";

type Props = {
  order: Order;
};

const SummaryPanel = ({ order }: Props) => {
  const {
    hasMovements,
    swapAmount,
    manualRefund,
    swapRefund,
    returnRefund,
  } = useMemo(() => {
    let manualRefund = 0;
    let swapRefund = 0;
    let returnRefund = 0;

    const swapAmount = sum(order?.swaps.map((s) => s.difference_due) || [0]);

    if (order?.refunds?.length) {
      order.refunds.forEach((ref) => {
        if (ref.reason === "other" || ref.reason === "discount") {
          manualRefund += ref.amount;
        }
        if (ref.reason === "return") {
          returnRefund += ref.amount;
        }
        if (ref.reason === "swap") {
          swapRefund += ref.amount;
        }
      });
    }
    return {
      hasMovements: swapAmount + manualRefund + swapRefund + returnRefund !== 0,
      swapAmount,
      manualRefund,
      swapRefund,
      returnRefund,
    };
  }, [order]);

  return (
    <BodyCard className={"w-full mb-4 min-h-0 h-auto"} title="Summary">
      <div className="mt-6">
        {order.items?.map((item, i) => (
          <OrderLine key={i} item={item} currencyCode={order.currency_code} />
        ))}
        <DisplayTotal
          currency={order.currency_code}
          totalAmount={order.subtotal}
          totalTitle={"Subtotal"}
        />
        {order?.discounts?.map((discount, index) => (
          <DisplayTotal
            key={index}
            currency={order.currency_code}
            totalAmount={-1 * order.discount_total}
            totalTitle={
              <div className="flex inter-small-regular text-grey-90 items-center">
                Discount:{" "}
                <Badge className="ml-3" variant="default">
                  {discount.code}
                </Badge>
              </div>
            }
          />
        ))}
        {order?.gift_cards?.map((giftCard, index) => (
          <DisplayTotal
            key={index}
            currency={order.currency_code}
            totalAmount={-1 * order.gift_card_total}
            totalTitle={
              <div className="flex inter-small-regular text-grey-90 items-center">
                Gift card:{" "}
                <Badge className="ml-3" variant="default">
                  {giftCard.code}
                </Badge>
                <div className="ml-2">
                  <CopyToClipboard
                    value={giftCard.code}
                    showValue={false}
                    iconSize={16}
                  />
                </div>
              </div>
            }
          />
        ))}
        <DisplayTotal
          currency={order.currency_code}
          totalAmount={order.shipping_total}
          totalTitle={"Shipping"}
        />
        <DisplayTotal
          currency={order.currency_code}
          totalAmount={order.tax_total}
          totalTitle={"Tax"}
        />
        <DisplayTotal
          variant={"large"}
          currency={order.currency_code}
          totalAmount={order.total}
          totalTitle={hasMovements ? "Original Total" : "Total"}
        />
        <PaymentDetails
          manualRefund={manualRefund}
          swapAmount={swapAmount}
          swapRefund={swapRefund}
          returnRefund={returnRefund}
          paidTotal={order.paid_total}
          refundedTotal={order.refunded_total}
          currency={order.currency_code}
        />
      </div>
    </BodyCard>
  );
};

export default SummaryPanel;
