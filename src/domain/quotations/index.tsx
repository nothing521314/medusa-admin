import { CartContext } from "@medusa-react";
import { RouteComponentProps, Router } from "@reach/router";
import { navigate } from "gatsby";
import { TQuotationReturn } from "medusa-types/api/routes/admin/quotations/type";
import React, { useCallback, useContext, useMemo, useState } from "react";
import Button from "../../components/fundamentals/button";
import BodyCard from "../../components/organisms/body-card";
import QuotationTable from "../../components/templates/quotation-table";
import useToggleState from "../../hooks/use-toggle-state";
import Details, { IQuotationDetailForm } from "./details";
import { quotationHeaderOptions } from "./details/default-value-form";
import CanNotMakeQuotationModal from "./modal/can-not-make-quotation-modal";
import PrintQuotationFrom from "./modal/print-quotation-form";

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

  const { totalItems } = useContext(CartContext);
  const [printData, setPrintData] = useState<IQuotationDetailForm>();

  const handleClickMakeQuotationButton = useCallback(() => {
    if (!totalItems) {
      return openCanNotMakeQuoteModal();
    }
    return navigate(`${SUB_TAB.MAKE_QUOTATION}/new-quotation`);
  }, [openCanNotMakeQuoteModal, totalItems]);

  const actions = useMemo(() => {
    return [
      <Button
        variant="secondary"
        size="small"
        onClick={handleClickMakeQuotationButton}
        key="make-quotation"
      >
        Make quotation
      </Button>,
    ];
  }, [handleClickMakeQuotationButton]);

  const handleConfirmModal = useCallback(() => {
    closeCanNotMakeQuoteModal();
  }, [closeCanNotMakeQuoteModal]);

  const handleSetFormData = useCallback((data: TQuotationReturn) => {
    const form: IQuotationDetailForm = {
      appendixA: data.appendix_a,
      appendixB: data.appendix_b,
      code: data.code,
      createdAt: data.date,
      deliveryLeadTime: data.delivery_lead_time,
      header:
        quotationHeaderOptions.find((item) => item.title === data.header) ||
        quotationHeaderOptions[0],
      installationSupport: data.install_support,
      paymentTerms: data.payment_term,
      quotationConditions: data.condition,
      quotationHeading: data.heading,
      warranty: data.warranty,
      customer: data.customer,
      region: data.region,
      summary: data.quotation_lines.map((item: any) => {
        return {
          ...item.product,
          ...item,
          additional_hardwares: item?.child_product.map((child) => ({
            ...child?.product,
            ...child,
            priceItem: child.unit_price,
            quantity: child.volume,
          })),
          child_product: item?.child_product.map((child) => ({
            ...child?.product,
            ...child,
            priceItem: child.unit_price,
            quantity: child.volume,
          })),
          priceItem: item.unit_price,
          quantity: item.volume,
        };
      }),
    };

    setPrintData({ ...form });

    setTimeout(() => {
      window.print();
      setPrintData(undefined);
    }, 500);
  }, []);

  return (
    <>
      <div className="flex flex-col grow h-full">
        <div className="w-full flex flex-col grow">
          <BodyCard
            customHeader={<div className="inter-large-semibold">Quotation</div>}
            customActionable={actions}
          >
            <QuotationTable handleSetFormData={handleSetFormData} />
          </BodyCard>
        </div>
      </div>
      {canNotMakeQuoteModalOpen && (
        <CanNotMakeQuotationModal
          handleClose={() => closeCanNotMakeQuoteModal()}
          onSubmit={handleConfirmModal}
        />
      )}
      <div className="w-full">
        <PrintQuotationFrom
          formData={printData}
          className="hidden print:block"
        />
      </div>
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
