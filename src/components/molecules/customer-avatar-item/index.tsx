import clsx from "clsx";
import React from "react";
import Avatar from "../../atoms/avatar";

type CustomerAvatarItemProps = {
  color?: string;
  customer: {
    first_name?: string;
    last_name?: string;
    email: string;
  };
  className?: string;
};

const CustomerAvatarItem: React.FC<CustomerAvatarItemProps> = ({
  color = "bg-violet-60",
  customer,
  className = "",
}: CustomerAvatarItemProps) => {
  const identifier =
    customer.first_name || customer.last_name
      ? `${customer.first_name} ${customer.last_name}`
      : customer.email
      ? customer.email
      : "-";

  return (
    <div className={clsx("flex items-center px-2.5 py-1.5 w-full", className)}>
      <div className="w-[24px] h-[24px]">
        <Avatar user={customer} color={color} />
      </div>
      <span className="pl-2.5 w-40 truncate">{identifier}</span>
    </div>
  );
};

export default CustomerAvatarItem;
