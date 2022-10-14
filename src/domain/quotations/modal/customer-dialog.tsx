import { useAdminCustomers } from "@medusa-react";
import { Customer } from "@medusa-types";
import * as RadixPopover from "@radix-ui/react-popover";
import clsx from "clsx";
import React, { useCallback, useEffect, useState } from "react";
import TableSearch from "src/components/molecules/table/table-search";
import { useDebounce } from "src/hooks/use-debounce";
import CustomerLine from "../details/templates/customer-line";

type Props = {
  onClose: () => void;
  open: boolean;
  handleSelectCustomer?: (customer: Customer) => void;
};

const CustomerDialog = ({ open, onClose, handleSelectCustomer }: Props) => {
  const [customerList, setCustomerList] = useState<Customer[]>([]);
  const [query, setQuery] = useState<string>("");
  const debounceQuery = useDebounce(query, 200);
  const { customers } = useAdminCustomers({
    q: debounceQuery,
    offset: 0,
    limit: 50,
  });

  const handleClickCustomerLine = useCallback(
    (customer: Customer) => {
      if (!handleSelectCustomer) {
        return;
      }
      handleSelectCustomer(customer);
      onClose();
    },
    [handleSelectCustomer, onClose]
  );

  useEffect(() => {
    if (customers) {
      setCustomerList(customers);
    }
  }, [customers]);

  return (
    <RadixPopover.Root open={open} onOpenChange={onClose}>
      <RadixPopover.Trigger className="w-full visible"></RadixPopover.Trigger>
      <RadixPopover.Content
        side="bottom"
        align="center"
        alignOffset={-8}
        sideOffset={20}
        className="w-full bg-grey-0 shadow-dropdown rounded-rounded p-8"
      >
        <TableSearch
          placeholder="Search customer... "
          searchValue={query}
          onSearch={setQuery}
          className="w-full !border-violet-60 focus-within:!w-full"
        />
        <div
          className={clsx(
            "inter-small-regular text-grey-50 mt-6 w-max",
            "max-h-[300px] overflow-y-auto scroll-smooth scrollbar-thin overflow-x-hidden"
          )}
        >
          {customerList.map((item) => (
            <CustomerLine
              customer={item}
              className="cursor-pointer"
              onClick={() => handleClickCustomerLine(item)}
            />
          ))}
        </div>
        <div className="flex flex-col items-center gap-y-base"></div>
      </RadixPopover.Content>
    </RadixPopover.Root>
  );
};

export default CustomerDialog;