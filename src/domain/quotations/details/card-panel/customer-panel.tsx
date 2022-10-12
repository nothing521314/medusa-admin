import { Order } from "@medusa-types";
import React from "react";
import Avatar from "src/components/atoms/avatar";
import BodyCard from "src/components/organisms/body-card";
import { isoAlpha2Countries } from "src/utils/countries";
import extractCustomerName from "src/utils/extract-customer-name";

type Props = {
  order: Order;
};
const CustomerPanel = ({ order }: Props) => {
  return (
    <BodyCard className={"w-full mb-4 min-h-0 h-auto"} title="Customer">
      <div className="flex mt-6 space-x-6 divide-x justify-between">
        <div className="flex space-x-4 items-center">
          <div className="flex w-[40px] h-[40px] ">
            <Avatar
              user={order.customer}
              font="inter-large-semibold"
              color="bg-fuschia-40"
            />
          </div>
          <div>
            <h1 className="inter-large-semibold text-grey-90">
              {extractCustomerName(order)}
            </h1>
            {order.shipping_address && (
              <span className="inter-small-regular text-grey-50">
                {order.shipping_address.city},{" "}
                {
                  isoAlpha2Countries[
                    order.shipping_address.country_code?.toUpperCase()
                  ]
                }
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col pl-6">
          <div className="inter-small-regular text-grey-50 mb-1">
            Person In Charge
          </div>
          <div className="flex flex-col inter-small-regular">
            {order.customer.first_name && order.customer.last_name
              ? `${order.customer.first_name || ""} ${
                  order.customer.last_name || ""
                }`
              : "N/A"}
          </div>
        </div>
        <div className="flex flex-col pl-6">
          <div className="inter-small-regular mb-1 grid grid-cols-2 space-x-1">
            <div className="text-grey-50 shrink-0">Contact</div>
            <div>{order.email}</div>
          </div>
          <div className="inter-small-regular mb-1 grid grid-cols-2 space-x-1">
            <div className="text-grey-50 shrink-0">Phone</div>
            <div>{order.shipping_address?.phone || ""}</div>
          </div>
        </div>
      </div>
    </BodyCard>
  );
};

export default CustomerPanel;
