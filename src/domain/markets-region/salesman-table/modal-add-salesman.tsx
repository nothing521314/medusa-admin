import { useAdminUsers } from "@medusa-react";
import { User } from "@medusa-types";
import clsx from "clsx";
import React, { useCallback, useEffect, useState } from "react";
import Spinner from "src/components/atoms/spinner";
import Button from "src/components/fundamentals/button";
import CustomerAvatarItem from "src/components/molecules/customer-avatar-item";
import Modal from "src/components/molecules/modal";
import TableSearch from "src/components/molecules/table/table-search";
import { useDebounce } from "src/hooks/use-debounce";

type Props = {
  onClose: () => void;
  open: boolean;
  listAdded: User[];
  onAdd?: (customer: User) => void;
};

const ModalAddSalesman = ({ open, onClose, listAdded, onAdd }: Props) => {
  const [customerList, setCustomerList] = useState<User[]>([]);
  const [query, setQuery] = useState<string>("");
  const debounceQuery = useDebounce(query, 200);
  const { users, isLoading, isSuccess } = useAdminUsers({
    q: debounceQuery,
    offset: 0,
    limit: 50,
  });

  useEffect(() => {
    if (users) {
      setCustomerList(users);
    }
  }, [users]);

  const renderBody = useCallback(() => {
    if (isLoading) {
      return (
        <div className="w-full h-10 flex items-center justify-center">
          <Spinner size={"large"} variant={"secondary"} />
        </div>
      );
    }
    if (!customerList.length) {
      return (
        <div className="text-center mt-3 w-full">Salesman does not exist.</div>
      );
    }

    return customerList.map((item) => (
      <SalesmanRow
        key={item.id}
        user={item}
        listAdded={listAdded}
        onClick={() => onAdd?.(item)}
      />
    ));
  }, [customerList, isLoading, listAdded, onAdd]);

  return (
    <Modal handleClose={onClose}>
      <Modal.Body>
        <Modal.Header handleClose={onClose}>
          <h2 className="inter-xlarge-semibold">Salesman</h2>
        </Modal.Header>
        <Modal.Content>
          <TableSearch
            placeholder="Search customer... "
            searchValue={query}
            onSearch={setQuery}
            className="w-full !border-violet-60 focus-within:!w-full"
          />
          {isSuccess ? (
            renderBody()
          ) : (
            <div className="w-full h-5 flex items-center justify-center">
              <Spinner variant="secondary" />
            </div>
          )}
        </Modal.Content>
        <Modal.Footer>
          <div className="flex w-full justify-end gap-x-xsmall">
            <Button
              variant="ghost"
              onClick={onClose}
              size="small"
              className="w-[112px]"
            >
              Cancel
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  );
};

export default ModalAddSalesman;

type SalesmanRowProps = {
  user: User;
  className?: string;
  onClick?: any;
  listAdded: User[];
};

const SalesmanRow = ({
  user,
  listAdded,
  className,
  onClick,
}: SalesmanRowProps) => {
  const isAdded = listAdded.some((v) => {
    return v.id === user.id;
  });

  return (
    <div
      className={clsx(
        "grid grid-cols-[auto_1fr_130px] mt-6 space-x-6 divide-x justify-between",
        className
      )}
    >
      <div className="flex space-x-4 items-center">
        <CustomerAvatarItem customer={user} />
      </div>
      <div className="flex flex-col pl-6 ">
        <div className="inter-small-regular mb-1 flex space-x-1">
          <div className="text-grey-50 min-w-[25%] shrink-0">Contact</div>
          <div className="text-grey-90 text-ellipsis overflow-hidden whitespace-nowrap">
            {user.email}
          </div>
        </div>
        <div className="inter-small-regular mb-1 flex space-x-1">
          <div className="text-grey-50 min-w-[25%] shrink-0">Phone</div>
          <div className="text-grey-90">{user.phone || ""}</div>
        </div>
      </div>
      <div className="flex flex-col pl-6 ">
        <Button variant="primary" disabled={isAdded} onClick={onClick}>
          {isAdded ? "Added" : "Add"}
        </Button>
      </div>
    </div>
  );
};
