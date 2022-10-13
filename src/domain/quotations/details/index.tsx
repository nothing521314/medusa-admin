import { Customer } from "@medusa-types";
import { RouteComponentProps } from "@reach/router";
import { navigate } from "gatsby";
import moment from "moment";
import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { useForm } from "react-hook-form";
import { useHotkeys } from "react-hotkeys-hook";
import Button from "src/components/fundamentals/button";
import useToggleState from "src/hooks/use-toggle-state";
import { SUB_TAB } from "..";
import {
  CartContext,
  IProductAdded,
  useAdminOrder,
} from "../../../../medusa-react";
import Spinner from "../../../components/atoms/spinner";
import Breadcrumb from "../../../components/molecules/breadcrumb";
import BodyCard from "../../../components/organisms/body-card";
import CancelMakingQuotationModal from "../modal/cancel-making-quotation-modal";
import CancelTheQuotationReviseModal from "../modal/cancel-the-quotation-revision-modal";
import DeleteTheQuotationModal from "../modal/delete-the-quotation-modal";
import CustomerPanel from "./card-panel/customer-panel";
import SaleMalePanel from "./card-panel/sale-man-panel";
import SummaryPanel from "./card-panel/summary-panel";
import TextAreaFormPanel from "./card-panel/textarea-form-panel";
import { DEFAULT_QUOTATION_DETAIL_FORM_VALUE } from "./default-value-form";

type OrderDetailProps = RouteComponentProps<{ id: string; tab: string }>;

export interface IQuotationDetailForm {
  updateAt: string;
  quotationHeading: string;
  quotationConditions: string;
  paymentTerms: string;
  deliveryLeadTime: string;
  warranty: string;
  installationSupport: string;
  appendixA: string;
  appendixB: string;
  customer?: unknown;
  summary?: unknown;
}

const OrderDetails = ({ id, tab }: OrderDetailProps) => {
  const { order, isLoading } = useAdminOrder(id!);
  const { productList } = useContext(CartContext);

  const {
    open: handleOpenDeleteQuotationModal,
    close: handleCloseDeleteQuotationModal,
    state: isVisibleDeleteQuotationModal,
  } = useToggleState(false);

  const {
    open: handleOpenCancelMakingQuotationModal,
    close: handleCloseCancelMakingQuotationModal,
    state: isVisibleCancelMakingQuotationModal,
  } = useToggleState(false);

  const {
    open: handleOpenCancelReviseModal,
    close: handleCloseCancelReviseModal,
    state: isVisibleCancelReviseModal,
  } = useToggleState(false);

  // @ts-ignore
  useHotkeys("esc", () => navigate("/a/quotations"));

  const { register, handleSubmit, setValue, watch } = useForm<
    IQuotationDetailForm
  >({
    defaultValues: {
      quotationConditions:
        DEFAULT_QUOTATION_DETAIL_FORM_VALUE.quotationConditions,
      paymentTerms: DEFAULT_QUOTATION_DETAIL_FORM_VALUE.paymentTerms,
      deliveryLeadTime: DEFAULT_QUOTATION_DETAIL_FORM_VALUE.deliveryLeadTime,
      warranty: DEFAULT_QUOTATION_DETAIL_FORM_VALUE.warranty,
      installationSupport:
        DEFAULT_QUOTATION_DETAIL_FORM_VALUE.installationSupport,
      appendixA: DEFAULT_QUOTATION_DETAIL_FORM_VALUE.appendixA,
      appendixB: DEFAULT_QUOTATION_DETAIL_FORM_VALUE.appendixB,
      updateAt: moment(Date.now()).format("DD MMM YYYY HH:ss"),
      customer: order?.customer,
      summary: order?.cart || productList,
    },
  });

  const handleSubmitMakeQuotationForm = useCallback(
    (data: IQuotationDetailForm) => {
      console.log(data);
    },
    []
  );

  useEffect(() => {
    setValue("summary", productList);
  }, [productList, setValue]);

  const handleClickReviseButton = useCallback(() => {
    navigate(`/a/quotations/${SUB_TAB.REVISE_QUOTATION}/${id}`);
  }, [id]);

  const handleClickCancelMakeQuotationButton = useCallback(() => {
    handleOpenCancelMakingQuotationModal();
    navigate("/a/quotations");
  }, [handleOpenCancelMakingQuotationModal]);

  const subTabName = useMemo(() => {
    switch (tab) {
      case SUB_TAB.MAKE_QUOTATION:
        return "Make Quotation";
      case SUB_TAB.QUOTATION_DETAILS:
        return "Quotation Details";
      case SUB_TAB.REVISE_QUOTATION:
        return "Revise Quotation";
      default:
        return "";
    }
  }, [tab]);

  const renderTopButton = useCallback((): ReactNode => {
    switch (tab) {
      case SUB_TAB.MAKE_QUOTATION:
        return (
          <Button
            variant="danger"
            size="small"
            className="px-12"
            onClick={handleOpenCancelMakingQuotationModal}
          >
            Cancel
          </Button>
        );
      case SUB_TAB.QUOTATION_DETAILS:
        return (
          <Button
            variant="secondary"
            size="small"
            className="px-12"
            onClick={handleClickReviseButton}
          >
            Revise
          </Button>
        );
      default:
        return null;
    }
  }, [handleClickReviseButton, handleOpenCancelMakingQuotationModal, tab]);

  const renderBottomButton = useCallback((): ReactNode => {
    switch (tab) {
      case SUB_TAB.MAKE_QUOTATION:
        return (
          <Button variant="primary" size="medium" className="w-[300px] mt-5">
            Make quotation
          </Button>
        );
      case SUB_TAB.QUOTATION_DETAILS:
        return (
          <Button
            variant="danger"
            size="medium"
            className="w-[300px] mt-5"
            onClick={handleOpenDeleteQuotationModal}
            type="button"
          >
            Delete
          </Button>
        );
      case SUB_TAB.REVISE_QUOTATION:
        return (
          <div className="flex flex-row items-center justify-center space-x-10 mt-5">
            <Button
              variant="secondary"
              size="medium"
              className="w-[200px]"
              onClick={handleOpenCancelReviseModal}
              type="button"
            >
              Cancel
            </Button>
            <Button variant="primary" size="medium" className="w-[200px]">
              Save
            </Button>
          </div>
        );
      default:
        return null;
    }
  }, [handleOpenCancelReviseModal, handleOpenDeleteQuotationModal, tab]);

  const renderFooterDetails = useCallback(() => {
    return (
      <div className="flex flex-col items-center py-6">
        <div className="text italic text-blue-50 cursor-pointer">
          Show preview
        </div>
        <div className="text italic mt-4">Or</div>
        <div className="text italic text-blue-50 flex mt-4">
          <div className="mr-1 cursor-pointer">Download/</div>
          <div className="cursor-pointer">Email</div>
        </div>
        {renderBottomButton()}
      </div>
    );
  }, [renderBottomButton]);

  const renderModal = useCallback(() => {
    if (isVisibleCancelMakingQuotationModal) {
      return (
        <CancelMakingQuotationModal
          handleClickCancelButton={handleCloseCancelMakingQuotationModal}
          handleClickConfirmButton={handleClickCancelMakeQuotationButton}
        />
      );
    }

    if (isVisibleCancelReviseModal) {
      return (
        <CancelTheQuotationReviseModal
          handleClickCancelButton={handleCloseCancelReviseModal}
          handleClickConfirmButton={handleCloseCancelReviseModal}
        />
      );
    }

    if (isVisibleDeleteQuotationModal) {
      return (
        <DeleteTheQuotationModal
          handleClickCancelButton={handleCloseDeleteQuotationModal}
          handleClickConfirmButton={handleCloseDeleteQuotationModal}
        />
      );
    }
  }, [
    handleClickCancelMakeQuotationButton,
    handleCloseCancelMakingQuotationModal,
    handleCloseCancelReviseModal,
    handleCloseDeleteQuotationModal,
    isVisibleCancelMakingQuotationModal,
    isVisibleCancelReviseModal,
    isVisibleDeleteQuotationModal,
  ]);

  return (
    <React.Fragment>
      <div className="flex flex-row justify-between items-center mb-4">
        <Breadcrumb
          currentPage={subTabName}
          previousBreadcrumb={"Quotation"}
          previousRoute="/a/quotations"
          className="!m-0"
        />
        {renderTopButton()}
      </div>
      {isLoading ? (
        <BodyCard className="w-full pt-2xlarge flex items-center justify-center">
          <Spinner size={"large"} variant={"secondary"} />
        </BodyCard>
      ) : (
        <form onSubmit={handleSubmit(handleSubmitMakeQuotationForm)}>
          <div className="flex flex-col h-full">
            <SaleMalePanel
              order={order}
              date={watch("updateAt")}
              onDateChange={(date) => setValue("updateAt", date)}
            />
            <CustomerPanel
              customer={watch("customer") as Customer}
              handleSelectCustomer={(customer) =>
                setValue("customer", customer)
              }
            />
            <BodyCard
              title="Quotation Heading"
              className="min-h-fit h-auto mb-4"
            >
              <textarea
                className="py-5 px-8 border rounded-2xl text-justify resize-none outline-none focus:outline-none"
                readOnly={tab === SUB_TAB.QUOTATION_DETAILS}
                {...register("quotationHeading")}
              />
            </BodyCard>
            <SummaryPanel
              summary={watch("summary") as IProductAdded[]}
              readOnly={tab === SUB_TAB.QUOTATION_DETAILS}
            />
            <TextAreaFormPanel
              register={register}
              readOnly={tab === SUB_TAB.QUOTATION_DETAILS}
            />
          </div>
          {renderFooterDetails()}
          {renderModal()}
        </form>
      )}
    </React.Fragment>
  );
};

export default OrderDetails;
