import { RouteComponentProps, Router } from "@reach/router";
import React, { useCallback, useMemo } from "react";
import CanNotMakeQuotationModal from "src/components/organisms/can-not-make-quotation-modal";
import Button from "../../components/fundamentals/button";
import BodyCard from "../../components/organisms/body-card";
import OrderTable from "../../components/templates/order-table";
import useToggleState from "../../hooks/use-toggle-state";
import Details from "./details";

const OrderIndex: React.FC<RouteComponentProps> = () => {
  const {
    open: openCanNotMakeQuoteModal,
    close: closeCanNotMakeQuoteModal,
    state: canNotMakeQuoteModalOpen,
  } = useToggleState(false);

  const actions = useMemo(() => {
    return [
      <Button
        variant="secondary"
        size="small"
        onClick={() => openCanNotMakeQuoteModal()}
      >
        Make quotation
      </Button>,
    ];
  }, [openCanNotMakeQuoteModal]);

  const handleConfirmModal = useCallback(() => {
    closeCanNotMakeQuoteModal();
  }, [closeCanNotMakeQuoteModal]);

  return (
    <>
      <div className="flex flex-col grow h-full">
        <div className="w-full flex flex-col grow">
          <BodyCard
            customHeader={<div className="inter-large-semibold">Quotation</div>}
            customActionable={actions}
          >
            <OrderTable />
          </BodyCard>
        </div>
      </div>
      {canNotMakeQuoteModalOpen && (
        <CanNotMakeQuotationModal
          handleClose={() => closeCanNotMakeQuoteModal()}
          onSubmit={handleConfirmModal}
        />
      )}
    </>
  );
};

const Quotation = () => {
  return (
    <Router>
      <OrderIndex path="/" />
      <Details path=":id" />
    </Router>
  );
};

export default Quotation;
