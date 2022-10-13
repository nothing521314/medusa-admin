import { Customer } from "@medusa-types";
import clsx from "clsx";
import React, { useMemo } from "react";
import Avatar from "src/components/atoms/avatar";

type Props = {
  customer: Customer;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

const CustomerLine = ({ customer, className, onClick }: Props) => {
  const customerFullname = useMemo(() => {
    if (customer.first_name || customer.last_name) {
      return `${customer.first_name || ""} ${customer.last_name || ""}`;
    }
    if (customer.name) {
      return customer.name;
    }
    return "N/A";
  }, [customer.first_name, customer.last_name, customer.name]);

  return (
    <div
      className={clsx(
        "grid grid-cols-3 mt-6 space-x-6 divide-x justify-between",
        className
      )}
      onClick={onClick}
    >
      <div className="flex space-x-4 items-center">
        <div className="flex w-[40px] h-[40px] ">
          <Avatar
            user={customer}
            font="inter-large-semibold"
            color="bg-fuschia-40"
          />
        </div>
        <div>
          <h1 className="inter-large-semibold text-grey-90">
            {customerFullname}
          </h1>
          <span className="inter-small-regular text-grey-50">
            {customer.address}
          </span>
        </div>
      </div>
      <div className="flex flex-col pl-6">
        <div className="inter-small-regular text-grey-50 mb-1">
          Person In Charge
        </div>
        <div className="flex flex-col inter-small-regular text-grey-90">
          {customer.person_in_charge}
        </div>
      </div>
      <div className="flex flex-col pl-6 ">
        <div className="inter-small-regular mb-1 flex space-x-1">
          <div className="text-grey-50 min-w-[25%] shrink-0">Contact</div>
          <div className="text-grey-90 text-ellipsis overflow-hidden whitespace-nowrap">{customer.email}</div>
        </div>
        <div className="inter-small-regular mb-1 flex space-x-1">
          <div className="text-grey-50 min-w-[25%] shrink-0">Phone</div>
          <div className="text-grey-90">{customer.phone || ""}</div>
        </div>
      </div>
    </div>
  );
};

export default CustomerLine;
