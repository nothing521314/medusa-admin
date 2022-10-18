import { IProductAdded } from "@medusa-react";
import React, { useContext, useMemo } from "react";
import BodyCard from "src/components/organisms/body-card";
import { AccountContext } from "src/context/account";
import OrderLine from "../order-line";
import { DisplayTotal } from "../templates";

type Props = {
  summary?: IProductAdded[];
  readOnly?: boolean;
  tab?: string;
};

const SummaryPanel = ({ summary, readOnly = true, tab }: Props) => {
  const { selectedRegion } = useContext(AccountContext);

  const list = useMemo(() => {
    return summary?.map((item) => {
      const child_product = item?.child_product?.map((child) => {
        return {
          ...child,
          total: (child?.priceItem || 0) * (child?.quantity || 0),
        };
      });
      return {
        total: (item?.priceItem || 0) * (item?.quantity || 0),
        subTotal:
          (item?.priceItem || 0) * item.quantity +
          (child_product?.reduce((pre, cur) => pre + cur.total, 0) || 0),
        child_product,
      };
    });
  }, [summary]);

  const { subtotal, shipping, tax, originalTotal } = useMemo(() => {
    const subtotal =
      list?.reduce((pre, cur) => pre + ((cur as any)?.subTotal || 0), 0) || 0;
    const shipping = 0;
    const tax = selectedRegion?.tax_rate || 0;
    return {
      subtotal,
      shipping,
      tax,
      originalTotal: subtotal + shipping + tax,
    };
  }, [list, selectedRegion?.tax_rate]);

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
            tab={tab}
          />
        ))}
        <DisplayTotal
          currency={selectedRegion?.currency_code}
          totalAmount={subtotal}
          totalTitle={"Subtotal"}
        />
        <DisplayTotal
          currency={selectedRegion?.currency_code}
          totalAmount={shipping}
          totalTitle={"Shipping"}
        />
        <DisplayTotal
          currency={selectedRegion?.currency_code}
          totalAmount={tax}
          totalTitle={"Tax"}
        />
        <DisplayTotal
          variant={"large"}
          currency={selectedRegion?.currency_code}
          totalAmount={originalTotal}
          totalTitle={"Total"}
        />
      </div>
    </BodyCard>
  );
};

export default SummaryPanel;
