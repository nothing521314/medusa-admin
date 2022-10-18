import { Customer } from "@medusa-types";
import { RouteComponentProps } from "@reach/router";
import { navigate } from "gatsby";
import { AdminCreateQuotationParams } from "medusa-types/api/routes/admin/quotations/type";
import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { useForm } from "react-hook-form";
import { useHotkeys } from "react-hotkeys-hook";
import Button from "src/components/fundamentals/button";
import { AccountContext } from "src/context/account";
import useNotification from "src/hooks/use-notification";
import useToggleState from "src/hooks/use-toggle-state";
import { SUB_TAB } from "..";
import {
  CartContext,
  IProductAdded,
  useAdminCreateQuotation,
  useAdminDeleteQuotation,
  useAdminQuotationGetOne
} from "../../../../medusa-react";
import Spinner from "../../../components/atoms/spinner";
import Breadcrumb from "../../../components/molecules/breadcrumb";
import BodyCard from "../../../components/organisms/body-card";
import CancelMakingQuotationModal from "../modal/cancel-making-quotation-modal";
import CancelTheQuotationReviseModal from "../modal/cancel-the-quotation-revision-modal";
import DeleteTheQuotationModal from "../modal/delete-the-quotation-modal";
import PrintQuotationFrom from "../modal/print-quotation-form";
import CustomerPanel from "./card-panel/customer-panel";
import QuotationHeaderPanel from "./card-panel/quotation-header-panel";
import SaleMalePanel from "./card-panel/sale-man-panel";
import SummaryPanel from "./card-panel/summary-panel";
import TextAreaFormPanel from "./card-panel/textarea-form-panel";
import {
  DEFAULT_QUOTATION_DETAIL_FORM_VALUE,
  quotationHeaderOptions
} from "./default-value-form";

type OrderDetailProps = RouteComponentProps<{ id: string; tab: string }>;

export interface IQuotationDetailForm {
  createdAt: string;
  quotationHeading: string;
  quotationConditions: string;
  paymentTerms: string;
  deliveryLeadTime: string;
  warranty: string;
  installationSupport: string;
  appendixA: string;
  appendixB: string;
  customer?: Customer;
  summary?: unknown;
  code: string;
  gameOptions: {
    [key: string]: string[];
  };
  region?: any;
}

const OrderDetails = ({ id, tab }: OrderDetailProps) => {
  const { quotation, isLoading } = useAdminQuotationGetOne(id!);
  const { mutateAsync } = useAdminCreateQuotation();
  const { mutateAsync: handleDeleteQuotation } = useAdminDeleteQuotation();
  const readOnlyPage = useMemo(() => tab === SUB_TAB.QUOTATION_DETAILS, [tab]);

  const { selectedRegion, sale_man_state } = useContext(AccountContext);
  const { productList, handleSetListProduct } = useContext(CartContext);
  const [headerSelected, setHeaderSelected] = useState(
    quotationHeaderOptions[0]
  );
  const notification = useNotification();

  const {
    open: handleOpenDeleteQuotationModal,
    close: handleCloseDeleteQuotationModal,
    state: isVisibleDeleteQuotationModal,
  } = useToggleState(false);

  const {
    open: handleOpenCancelReviseModal,
    close: handleCloseCancelReviseModal,
    state: isVisibleCancelReviseModal,
  } = useToggleState(false);

  const sale_man = useMemo(() => {
    if (quotation) {
      return quotation.sale_persion;
    }
    return sale_man_state;
  }, [quotation, sale_man_state]);

  const {
    open: handleOpenCancelMakingQuotationModal,
    close: handleCloseCancelMakingQuotationModal,
    state: isVisibleCancelMakingQuotationModal,
  } = useToggleState(false);

  // @ts-ignore
  useHotkeys("esc", () => navigate("/a/quotations"));

  const { register, handleSubmit, setValue, watch, reset } = useForm<
    IQuotationDetailForm
  >({
    defaultValues: {
      quotationConditions: "",
      paymentTerms: "",
      deliveryLeadTime: "",
      warranty: "",
      installationSupport: "",
      appendixA: "",
      appendixB: "",
      createdAt: quotation?.date,
      summary: [],
      customer: undefined,
      code: "",
      region: {}
    },
  });
  
  const handleSubmitMakeQuotationForm = useCallback(
    async (data: IQuotationDetailForm) => {
      if (!data.customer) {
        return notification("Error", "Please select customer", "error");
      }

      const quotation_lines: Array<{
        product_id: string;
        volume: number;
        child_product: any;
      }> = (data.summary as Array<{
        id: string;
        quantity: number;
        child_product: any;
        product_id?: string;
      }>).map((item) => {
        return {
          product_id: item?.product_id || item.id,
          volume: item.quantity,
          child_product: item.child_product.map((i) => ({
            product_id: i.product_additions_id,
            volume: i.quantity,
          })),
        };
      });

      const params: AdminCreateQuotationParams = {
        appendix_a: data.appendixA,
        appendix_b: data.appendixB,
        code: data.code,
        condition: data.quotationConditions,
        customer_id: data.customer?.id!,
        date: data.createdAt || new Date().toUTCString(),
        delivery_lead_time: data.deliveryLeadTime,
        heading: data.quotationHeading,
        install_support: data.installationSupport,
        metadata: {},
        payment_term: data.paymentTerms,
        quotation_lines,
        region_id: data.region.id,
        sale_persion_id: sale_man_state?.id!,
        warranty: data.warranty,
        header: "company",
        title: "11",
      };

      try {
        const res = await mutateAsync({ ...params });
        if (res.response.status === 200) {
          navigate("/a/quotations");
          handleSetListProduct && handleSetListProduct([]);
        }
      } catch (error) {
        console.log({ error });
      }
    },
    [handleSetListProduct, mutateAsync, notification, sale_man_state?.id]
  );

  const handleClickReviseButton = useCallback(() => {
    navigate(`/a/quotations/${SUB_TAB.REVISE_QUOTATION}/${id}`);
  }, [id]);

  const handleSetValueFromApi = useCallback(() => {
    if (!quotation) return;
    setValue("appendixA", quotation.appendix_a);
    setValue("appendixB", quotation.appendix_b);
    setValue("createdAt", quotation.date);
    setValue("customer", quotation.customer);
    setValue("deliveryLeadTime", quotation.delivery_lead_time);
    setValue("installationSupport", quotation.install_support);
    setValue("paymentTerms", quotation.payment_term);
    setValue("quotationConditions", quotation.condition);
    setValue("quotationHeading", quotation.heading);
    setValue("warranty", quotation.warranty);
    setValue("region", quotation.region);
    setValue(
      "code",
      tab === SUB_TAB.QUOTATION_DETAILS
        ? quotation.code
        : `${quotation.code}_REV1`
    );
  }, [quotation, setValue, tab]);

  const handleClickCancelMakeQuotationButton = useCallback(() => {
    handleOpenCancelMakingQuotationModal();
    navigate("/a/quotations");
  }, [handleOpenCancelMakingQuotationModal]);

  const handleConfirmCancelReviseQuotation = useCallback(() => {
    navigate(`/a/quotations/${SUB_TAB.QUOTATION_DETAILS}/${id}`);
    handleSetValueFromApi();
    handleCloseCancelReviseModal();
  }, [handleCloseCancelReviseModal, handleSetValueFromApi, id]);

  const handleConfirmDeleteQuotation = useCallback(async () => {
    try {
      const res = await handleDeleteQuotation(id!);
      if (res.response.status === 200) {
        navigate("/a/quotations");
      }
    } catch (error) {
      return;
    }
  }, [handleDeleteQuotation, id]);

  const handleSendMail = useCallback(
    (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e?.preventDefault();
      if (!watch("customer")?.email) {
        return notification("Error", "Please select customer", "error");
      }
      window.location.href = `mailto:${watch("customer")?.email}`;
    },
    [notification, watch]
  );

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
        <div
          className="text italic text-blue-50 cursor-pointer"
          onClick={() => window.print()}
        >
          Preview/ Download
        </div>
        <div className="text italic mt-2">Or</div>
        <div className="text italic text-blue-50 flex mt-2">
          <div className="cursor-pointer" onClick={handleSendMail}>
            Email
          </div>
        </div>
        {renderBottomButton()}
      </div>
    );
  }, [handleSendMail, renderBottomButton]);

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
          handleClickConfirmButton={handleConfirmCancelReviseQuotation}
        />
      );
    }

    if (isVisibleDeleteQuotationModal) {
      return (
        <DeleteTheQuotationModal
          handleClickCancelButton={handleCloseDeleteQuotationModal}
          handleClickConfirmButton={handleConfirmDeleteQuotation}
        />
      );
    }
  }, [
    handleClickCancelMakeQuotationButton,
    handleCloseCancelMakingQuotationModal,
    handleCloseCancelReviseModal,
    handleCloseDeleteQuotationModal,
    handleConfirmCancelReviseQuotation,
    handleConfirmDeleteQuotation,
    isVisibleCancelMakingQuotationModal,
    isVisibleCancelReviseModal,
    isVisibleDeleteQuotationModal,
  ]);

  useEffect(() => {
    if (quotation?.quotation_lines.length && tab === SUB_TAB.REVISE_QUOTATION) {
      const arr = quotation?.quotation_lines.map((item: any) => {
        return {
          ...item,
          additional_hardwares: item?.child_product,
          priceItem: item.unit_price,
          quantity: item.volume,
        };
      });
      handleSetListProduct && handleSetListProduct(arr);
    }
  }, [handleSetListProduct, quotation?.quotation_lines, tab]);

  useEffect(() => {
    if (tab === SUB_TAB.MAKE_QUOTATION) {
      setValue("code", `${sale_man?.name}_${Date.now()} Quotation Code`);
      setValue("appendixA", DEFAULT_QUOTATION_DETAIL_FORM_VALUE.appendixA);
      setValue("appendixB", DEFAULT_QUOTATION_DETAIL_FORM_VALUE.appendixB);
      setValue(
        "deliveryLeadTime",
        DEFAULT_QUOTATION_DETAIL_FORM_VALUE.deliveryLeadTime
      );
      setValue(
        "installationSupport",
        DEFAULT_QUOTATION_DETAIL_FORM_VALUE.installationSupport
      );
      setValue(
        "paymentTerms",
        DEFAULT_QUOTATION_DETAIL_FORM_VALUE.paymentTerms
      );
      setValue(
        "quotationConditions",
        DEFAULT_QUOTATION_DETAIL_FORM_VALUE.quotationConditions
      );
      setValue("warranty", DEFAULT_QUOTATION_DETAIL_FORM_VALUE.warranty);
      setValue("region", selectedRegion);
    } else {
      handleSetValueFromApi();
    }

    if (tab !== SUB_TAB.QUOTATION_DETAILS) {
      const summary = productList?.map((product) => {
        return {
          ...product,
          priceItem:
            product?.priceItem ||
            product?.prices.find(
              (region) => region?.region_id === watch("region")
            )?.price ||
            0,
          child_product: product.additional_hardwares?.map((child: any) => {
            return {
              ...child,
              priceItem:
                child.priceItem ||
                child?.prices?.find((reg) => reg?.region_id === watch("region"))
                  ?.price ||
                0,
            };
          }),
        };
      });
      setValue("summary", summary);
    } else {
      const summary = quotation?.quotation_lines.map((item: any) => {
        return {
          ...item,
          additional_hardwares: item?.child_product,
          priceItem: item.unit_price,
          quantity: item.volume,
        };
      });
      setValue("summary", summary);
    }
    return () => {
      reset();
    };
  }, [
    handleSetValueFromApi,
    productList,
    quotation?.quotation_lines,
    reset,
    sale_man?.name,
    selectedRegion,
    watch,
    setValue,
    tab,
  ]);

  return (
    <React.Fragment>
      <div className="flex flex-row justify-between items-center mb-4 print:hidden">
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
        <form
          onSubmit={handleSubmit(handleSubmitMakeQuotationForm)}
          className="print:hidden"
        >
          <div className="flex flex-col h-full">
            <SaleMalePanel
              register={register}
              readOnly={readOnlyPage}
              state={watch()}
              saleMan={sale_man}
              date={watch("createdAt") || new Date().toDateString()}
              onDateChange={(date) => setValue("createdAt", date)}
              company={headerSelected.company}
            />
            <QuotationHeaderPanel
              onChange={setHeaderSelected}
              headerSelected={headerSelected}
            />
            <CustomerPanel
              customer={watch("customer")}
              readOnly={readOnlyPage}
              handleSelectCustomer={(customer) => {
                setValue("customer", customer);
              }}
            />
            <SummaryPanel
              summary={watch("summary") as IProductAdded[]}
              readOnly={readOnlyPage}
              tab={tab}
            />
            <TextAreaFormPanel
              register={register}
              readOnly={readOnlyPage}
              watch={watch}
            />
          </div>
          {renderFooterDetails()}
          {renderModal()}
        </form>
      )}
      <PrintQuotationFrom
        className="hidden print:block"
        formData={watch()}
        headerSelected={headerSelected}
      />
    </React.Fragment>
  );
};

export default OrderDetails;
