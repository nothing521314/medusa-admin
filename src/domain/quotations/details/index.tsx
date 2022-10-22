import { Customer } from "@medusa-types";
import { RouteComponentProps } from "@reach/router";
import clsx from "clsx";
import { navigate } from "gatsby";
import { AdminCreateQuotationParams } from "medusa-types/api/routes/admin/quotations/type";
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
import InfoIcon from "src/components/fundamentals/icons/info-icon";
import { AccountContext } from "src/context/account";
import useNotification from "src/hooks/use-notification";
import useToggleState from "src/hooks/use-toggle-state";
import { SUB_TAB } from "..";
import {
  CartContext,
  useAdminCreateQuotation,
  useAdminDeleteQuotation,
  useAdminQuotationGetOne,
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
  quotationHeaderOptions,
  THeaderPrint,
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
  region?: any;
  header: THeaderPrint;
}

const OrderDetails = ({ id, tab }: OrderDetailProps) => {
  const { quotation, isLoading } = useAdminQuotationGetOne(id!);
  const { mutateAsync } = useAdminCreateQuotation();
  const { mutateAsync: handleDeleteQuotation } = useAdminDeleteQuotation();
  const readOnlyPage = useMemo(() => tab === SUB_TAB.QUOTATION_DETAILS, [tab]);

  const { selectedRegion, sale_man_state } = useContext(AccountContext);
  const { productList, handleSetListProduct, handleSetAction } = useContext(
    CartContext
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
      header: quotationHeaderOptions[0],
      region: {},
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
            product_id: i.product_additions_id || i.product_id,
            volume: i.quantity || i.volume,
            game: i.game,
          })),
        };
      });

      const params: AdminCreateQuotationParams = {
        appendix_a: data.appendixA,
        appendix_b: data.appendixB,
        code: data.code,
        condition: data.quotationConditions,
        customer_id: data.customer?.id!,
        date: data.createdAt || new Date().toString(),
        delivery_lead_time: data.deliveryLeadTime,
        heading: data.quotationHeading,
        install_support: data.installationSupport,
        metadata: {},
        payment_term: data.paymentTerms,
        quotation_lines,
        region_id: data.region.id,
        sale_persion_id: sale_man_state?.id!,
        warranty: data.warranty,
        header: data.header.title,
        title: "QUOTATIONS",
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

  const handleSetHeader = useCallback(
    (header: THeaderPrint) => {
      setValue("header", header);
    },
    [setValue]
  );

  const getCodeRevise = useCallback((code: string) => {
    const split = code.split("_REV");
    return `${split[0]}_REV${Number(split[1] || 0) + 1}`;
  }, []);

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
        : getCodeRevise(quotation.code)
    );
    setValue(
      "header",
      quotationHeaderOptions.find((head) => head.title === quotation.header) ||
        quotationHeaderOptions[0]
    );
  }, [getCodeRevise, quotation, setValue, tab]);

  const handleClickCancelMakeQuotationButton = useCallback(() => {
    handleOpenCancelMakingQuotationModal();
    handleSetListProduct && handleSetListProduct([]);
    navigate("/a/quotations");
  }, [handleOpenCancelMakingQuotationModal, handleSetListProduct]);

  const handleConfirmCancelReviseQuotation = useCallback(() => {
    navigate(`/a/quotations/${SUB_TAB.QUOTATION_DETAILS}/${id}`);
    handleSetValueFromApi();
    handleCloseCancelReviseModal();
    handleSetListProduct && handleSetListProduct([]);
  }, [
    handleCloseCancelReviseModal,
    handleSetListProduct,
    handleSetValueFromApi,
    id,
  ]);

  const handleConfirmDeleteQuotation = useCallback(async () => {
    try {
      const res = await handleDeleteQuotation(id!);
      if (res.response.status === 200) {
        notification(
          "Success",
          "Deleted the quotations successfully",
          "success"
        );
        navigate("/a/quotations");
      }
    } catch (error) {
      return;
    }
  }, [handleDeleteQuotation, id, notification]);

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
        {tab === SUB_TAB.QUOTATION_DETAILS && (
          <React.Fragment>
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
          </React.Fragment>
        )}
        {renderBottomButton()}
      </div>
    );
  }, [handleSendMail, renderBottomButton, tab]);

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
          ...item.product,
          ...item,
          additional_hardwares: item?.child_product?.map((child) => ({
            ...child?.product,
            ...child,
          })),
          priceItem: item.unit_price,
          quantity: item.volume,
        };
      });
      handleSetListProduct && handleSetListProduct(arr);
    }
  }, [handleSetListProduct, quotation?.quotation_lines, tab]);

  useEffect(() => {
    if (tab === SUB_TAB.MAKE_QUOTATION) {
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
      setValue("createdAt", new Date().toString());
      setValue("region", selectedRegion);
    } else {
      handleSetValueFromApi();
    }

    return () => {
      reset();
    };
  }, [
    handleSetValueFromApi,
    reset,
    sale_man?.name,
    selectedRegion,
    setValue,
    tab,
    watch,
  ]);

  const isDeletedProduct = useMemo(() => {
    if (quotation?.quotation_lines) {
      const parentDeleted = quotation.quotation_lines.every(
        (item) => !item.product
      );

      if (parentDeleted) return true;
      quotation?.quotation_lines.every((item) => {
        const childDeleted = item.child_product.every((item) => !item.product);
        if (childDeleted) return true;
      });
    }

    return false;
  }, [quotation?.quotation_lines]);

  useEffect(() => {
    if (tab !== SUB_TAB.QUOTATION_DETAILS) {
      const summary = productList
        ?.map((product) => {
          return {
            ...product,
            priceItem:
              product?.priceItem ||
              product?.prices.find(
                (region) => region?.region_id === watch("region")?.id
              )?.price ||
              0,
            child_product: product.additional_hardwares?.map((child: any) => {
              return {
                ...child,
                priceItem:
                  child.priceItem ||
                  child?.prices?.find(
                    (reg) => reg?.region_id === watch("region")?.id
                  )?.price ||
                  0,
              };
            }),
          };
        })
        ?.map((item) => {
          return {
            ...item,
            child_product: item?.child_product?.filter((child) => child?.title),
          };
        })
        .filter((item) => item.title);
      setValue("summary", summary);

      if (tab === SUB_TAB.MAKE_QUOTATION) {
        setValue(
          "code",
          `${sale_man?.name || ""}_${Date.now()} Quotation Code ${
            watch("summary")?.[0]?.collection?.title?.split(" - ")?.[1] || ""
          }`
        );
      }
    } else {
      const summary = quotation?.quotation_lines.map((item: any) => {
        return {
          ...item.product,
          ...item,
          additional_hardwares: item?.child_product.map((child) => ({
            ...child?.product,
            ...child,
          })),
          child_product: item?.child_product.map((child) => ({
            ...child?.product,
            ...child,
          })),
          priceItem: item.unit_price,
          quantity: item.volume,
        };
      });

      setValue("summary", summary);
    }
  }, [
    productList,
    quotation?.quotation_lines,
    sale_man?.name,
    setValue,
    tab,
    watch,
  ]);

  useEffect(() => {
    if (!handleSetAction) return;
    handleSetAction(tab as SUB_TAB);

    return () => {
      handleSetAction(SUB_TAB.MAKE_QUOTATION);
      if (tab === SUB_TAB.REVISE_QUOTATION) {
        handleSetListProduct && handleSetListProduct([]);
      }
    };
  }, [handleSetAction, handleSetListProduct, tab]);

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
        <React.Fragment>
          <form
            onSubmit={handleSubmit(handleSubmitMakeQuotationForm)}
            className="print:hidden"
          >
            {isDeletedProduct && (
              <div
                className={clsx(
                  "text-red-500 font-semibold text-center mb-5 flex items-center gap-2 justify-center",
                  "rounded-lg border bg-grey-0 border-grey-20 py-4"
                )}
              >
                <InfoIcon color="red" size={24} />
                This quote contains products that have been deleted
              </div>
            )}
            <div className="flex flex-col h-full">
              <SaleMalePanel
                register={register}
                readOnly={readOnlyPage}
                state={watch()}
                saleMan={sale_man}
                date={watch("createdAt")}
                onDateChange={(date) => setValue("createdAt", date.toString())}
                company={watch("header").company}
                minDate={
                  tab !== SUB_TAB.REVISE_QUOTATION ? new Date() : undefined
                }
              />
              <QuotationHeaderPanel
                onChange={handleSetHeader}
                headerSelected={watch("header")}
                readOnly={readOnlyPage}
              />
              <CustomerPanel
                customer={watch("customer")}
                readOnly={readOnlyPage}
                handleSelectCustomer={(customer) => {
                  setValue("customer", customer);
                }}
              />
              <SummaryPanel
                formData={watch()}
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
          {tab === SUB_TAB.QUOTATION_DETAILS && (
            <PrintQuotationFrom
              className="hidden print:block"
              formData={watch()}
            />
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default OrderDetails;
