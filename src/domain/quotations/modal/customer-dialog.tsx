import { useAdminCustomers } from "@medusa-react";
import { Customer } from "@medusa-types";
import * as Dialog from "@radix-ui/react-dialog";
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
  const [customerList, setCustomerList] = useState([]);
  const [query, setQuery] = useState<string>("");
  const debounceQuery = useDebounce(query, 200);
  const responseApi = useAdminCustomers({
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
    if (responseApi?.response?.status === 200) {
      setCustomerList(responseApi.customers);
    }
  }, [responseApi, responseApi.customers, responseApi.status]);

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Overlay className="z-50 block w-full">
        <Dialog.Content className="bg-grey-0 shadow-dropdown rounded-rounded p-8">
          <Dialog.Title className="inter-xlarge-semibold mb-1">
            <TableSearch
              placeholder="Search customer... "
              searchValue={query}
              onSearch={setQuery}
              className="w-full !border-violet-60 focus-within:!w-full"
            />
          </Dialog.Title>
          <Dialog.Description
            className={clsx(
              "inter-small-regular text-grey-50 mt-6",
              "max-h-[300px] overflow-y-auto scroll-smooth scrollbar-thin"
            )}
          >
            {customerList.map((item) => (
              <CustomerLine
                customer={item}
                className="cursor-pointer"
                onClick={() => handleClickCustomerLine(item)}
              />
            ))}
          </Dialog.Description>
          <div className="flex flex-col items-center gap-y-base"></div>
        </Dialog.Content>
      </Dialog.Overlay>
    </Dialog.Root>
  );
};

export default CustomerDialog;
