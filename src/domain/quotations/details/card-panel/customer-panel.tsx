import { Customer } from "@medusa-types";
import React, { useCallback } from "react";
import Button from "src/components/fundamentals/button";
import BodyCard from "src/components/organisms/body-card";
import useToggleState from "src/hooks/use-toggle-state";
import CustomerDialog from "../../modal/customer-dialog";
import CustomerLine from "../templates/customer-line";

type Props = {
  customer?: Customer;
  handleSelectCustomer: ((customer: Customer) => void) | undefined;
  readOnly: boolean;
};

const CustomerPanel = ({ customer, handleSelectCustomer, readOnly }: Props) => {
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
      status={
        !readOnly ? (
          <Button
            variant="secondary"
            size="small"
            onClick={handleClickChangeButton}
            type="button"
          >
            Change
          </Button>
        ) : undefined
      }
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
