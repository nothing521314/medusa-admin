import { RouteComponentProps } from "@reach/router";
import clsx from "clsx";
import moment from "moment";
import React, { useCallback } from "react";
import { IQuotationDetailForm } from "../details";

interface TPrintQuotationFromModal
  extends RouteComponentProps<{ id: string; tab: string }> {
  formData?: IQuotationDetailForm;
  className?: string;
}

const PrintQuotationFrom = ({
  formData,
  className,
}: TPrintQuotationFromModal) => {

  const renderText = useCallback((text?: string): string => {
    if (!text) return "";
    return text.replace(/\r?\n/g, "<br />");
  }, []);

  return (
    <div className={clsx(className)}>
      <div className="flex justify-between items-center">
        <div>Our Ref: QM-5542-2022</div>
        <div>{moment(formData?.createdAt).format("DD MMMM YYYY")}</div>
      </div>
      <div className="mt-4">
        <div className="font-semibold">
          Customer Name: {formData?.customer?.name}
        </div>
        <div className="">Customer Address: {formData?.customer?.address}</div>
      </div>
      <div className="mt-4">
        Dear {`${formData?.customer?.person_in_charge},`}
      </div>
      <div className="mt-3 border-y-4 border-black font-semibold py-2">
        {"Quotation for SG EGMs - 26x DUALS X (Link Machines)"}
      </div>
      <div className="mt-3 text-justify">
        We are pleased to submit our quotation for your consideration. Please
        see details of the proposal as below:
      </div>
      {/* Table Price */}

      <div className="font-semibold mt-4">Quotation Conditions</div>
      <div
        className="mt-1 text-justify w-full"
        dangerouslySetInnerHTML={{
          __html: renderText(formData?.quotationConditions),
        }}
      />

      <div className="font-semibold mt-4">Payment Terms</div>
      <div
        className="mt-1 text-justify w-full"
        dangerouslySetInnerHTML={{
          __html: renderText(formData?.paymentTerms),
        }}
      />

      <div className="font-semibold mt-4">Delivery Lead Time</div>
      <div
        className="mt-1 text-justify w-full"
        dangerouslySetInnerHTML={{
          __html: renderText(formData?.deliveryLeadTime),
        }}
      />

      <div className="font-semibold mt-4">Warranty</div>
      <div
        className="mt-1 text-justify w-full"
        dangerouslySetInnerHTML={{
          __html: renderText(formData?.warranty),
        }}
      />

      <div className="font-semibold mt-4">Installation Support</div>
      <div
        className="mt-1 text-justify w-full"
        dangerouslySetInnerHTML={{
          __html: renderText(formData?.installationSupport),
        }}
      />

      <div className="font-semibold mt-4">Appendix A</div>
      <div
        className="mt-1 text-justify w-full"
        dangerouslySetInnerHTML={{
          __html: renderText(formData?.appendixA),
        }}
      />

      <div className="font-semibold mt-4">Appendix B</div>
      <div
        className="mt-1 text-justify w-full"
        dangerouslySetInnerHTML={{
          __html: renderText(formData?.appendixB),
        }}
      />
    </div>
  );
};

export default PrintQuotationFrom;
