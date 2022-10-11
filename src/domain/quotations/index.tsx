import { useCart } from "@medusa-react";
import { RouteComponentProps, Router } from "@reach/router";
import { navigate } from "gatsby";
import React, { useCallback, useMemo } from "react";
import Button from "../../components/fundamentals/button";
import BodyCard from "../../components/organisms/body-card";
import OrderTable from "../../components/templates/quotation-table";
import useToggleState from "../../hooks/use-toggle-state";
import Details from "./details";
import CanNotMakeQuotationModal from "./modal/can-not-make-quotation-modal";

export enum SUB_TAB {
  MAKE_QUOTATION = "make-quotation",
  REVISE_QUOTATION = "revise-quotation",
  QUOTATION_DETAILS = "quotation-details",
}

const OrderIndex: React.FC<RouteComponentProps> = () => {
  const {
    open: openCanNotMakeQuoteModal,
    close: closeCanNotMakeQuoteModal,
    state: canNotMakeQuoteModalOpen,
  } = useToggleState(false);

  const { cart } = useCart();

  const handleClickMakeQuotationButton = useCallback(() => {
    if (!cart?.items?.length) {
      return openCanNotMakeQuoteModal();
    }
    return navigate(SUB_TAB.MAKE_QUOTATION);
  }, [cart?.items?.length, openCanNotMakeQuoteModal]);

  const actions = useMemo(() => {
    return [
      <Button
        variant="secondary"
        size="small"
        onClick={handleClickMakeQuotationButton}
      >
        Make quotation
      </Button>,
    ];
  }, [handleClickMakeQuotationButton]);

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
      <Details path=":tab/:id" />
    </Router>
  );
};

export default Quotation;
