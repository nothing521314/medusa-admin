import { Customer } from "@medusa-types";
import React, { useCallback } from "react";
import BodyCard from "src/components/organisms/body-card";
import useToggleState from "src/hooks/use-toggle-state";
import CustomerDialog from "../../modal/customer-dialog";
import CustomerLine from "../templates/customer-line";

type Props = {
  customer?: Customer;
  handleSelectCustomer: ((customer: Customer) => void) | undefined;
};

const CustomerPanel = ({ customer, handleSelectCustomer }: Props) => {
  const {
    open: handleOpenCustomerDialog,
    close: handleCloseCustomerDialog,
    state: isOpenCustomerDialog,
  } = useToggleState(false);

  const handleClickChangeButton = useCallback(() => {
    if (isOpenCustomerDialog) return;
    handleOpenCustomerDialog();
  }, [handleOpenCustomerDialog, isOpenCustomerDialog]);

  return (
    <BodyCard
      className={"w-full mb-4 min-h-0 h-auto relative"}
      title="Customer"
      actionables={[
        {
          label: "Change",
          onClick: handleClickChangeButton,
        },
      ]}
    >
      {customer && <CustomerLine customer={customer} />}
      <div className="relative w-full">
        {isOpenCustomerDialog && (
          <CustomerDialog
            open={isOpenCustomerDialog}
            onClose={handleCloseCustomerDialog}
            handleSelectCustomer={handleSelectCustomer}
          />
        )}
      </div>
    </BodyCard>
  );
};

export default CustomerPanel;
