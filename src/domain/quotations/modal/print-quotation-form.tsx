import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import Spinner from "src/components/atoms/spinner";
import Modal from "src/components/molecules/modal";
import { IQuotationDetailForm } from "../details";

type TPrintQuotationFromModal = {
  handleClose: () => void;
  formData: IQuotationDetailForm;
};

const PrintQuotationFrom = ({
  handleClose,
  formData,
}: TPrintQuotationFromModal) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [
    {
      quotationConditionsHeight,
      paymentTermHeight,
      deliveryLeadTimeHeight,
      warrantyHeight,
      appendixAHeight,
      appendixBHeight,
      installationHeight,
    },
    getHeightState,
  ] = useState({
    quotationConditionsHeight: 10,
    paymentTermHeight: 10,
    deliveryLeadTimeHeight: 10,
    warrantyHeight: 10,
    appendixAHeight: 10,
    appendixBHeight: 10,
    installationHeight: 10,
  });

  useEffect(() => {
    setIsLoading(true);
    const quotationConditionsHeight =
      document.getElementById("quotation-considers")?.scrollHeight ||
      document.getElementById("quotation-considers")?.clientHeight ||
      100;
    const paymentTermHeight =
      document.getElementById("payment-term")?.scrollHeight ||
      document.getElementById("payment-term")?.clientHeight ||
      100;
    const deliveryLeadTimeHeight =
      document.getElementById("delivery-lead-time")?.scrollHeight ||
      document.getElementById("delivery-lead-time")?.clientHeight ||
      100;
    const warrantyHeight =
      document.getElementById("warranty")?.scrollHeight ||
      document.getElementById("warranty")?.clientHeight ||
      100;
    const installationHeight =
      document.getElementById("installation-support")?.scrollHeight ||
      document.getElementById("installation-support")?.clientHeight ||
      100;
    const appendixAHeight =
      document.getElementById("appendix-a")?.scrollHeight ||
      document.getElementById("appendix-a")?.clientHeight ||
      100;
    const appendixBHeight =
      document.getElementById("appendix-b")?.scrollHeight ||
      document.getElementById("appendix-b")?.clientHeight ||
      100;
    getHeightState({
      quotationConditionsHeight,
      paymentTermHeight,
      deliveryLeadTimeHeight,
      warrantyHeight,
      appendixAHeight,
      appendixBHeight,
      installationHeight,
    });
    setIsLoading(false);
  }, []);

  const renderBody = useCallback(() => {
    if (isLoading) return <Spinner />;
    return (
      <Modal.Content className="!w-full scrollbar-thin">
        <div className="flex justify-between items-center">
          <div>Our Ref: QM-5542-2022</div>
          <div>{moment(formData.createdAt).format("DD MMMM YYYY")}</div>
        </div>
        <div className="mt-4">
          <div className="font-semibold">
            Customer Name: {formData.customer?.name}
          </div>
          <div className="">Customer Address: {formData.customer?.address}</div>
        </div>
        <div className="mt-4">
          Dear {`${formData.customer?.person_in_charge},`}
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
        <textarea
          className="mt-1 text-justify w-full resize-none overflow-hidden outline-none focus-within:outline-none"
          id="quotation-considers"
          style={{ height: `${quotationConditionsHeight}px` }}
          readOnly
          value={formData.quotationConditions}
        />

        <div className="font-semibold mt-4">Payment Terms</div>
        <textarea
          className="mt-1 text-justify w-full resize-none overflow-hidden outline-none focus-within:outline-none"
          id="payment-term"
          style={{ height: `${paymentTermHeight}px` }}
          readOnly
          value={formData.paymentTerms}
        />

        <div className="font-semibold mt-4">Delivery Lead Time</div>
        <textarea
          className="mt-1 text-justify w-full resize-none overflow-hidden outline-none focus-within:outline-none"
          id="delivery-lead-time"
          style={{ height: `${deliveryLeadTimeHeight}px` }}
          readOnly
          value={formData.deliveryLeadTime}
        />

        <div className="font-semibold mt-4">Warranty</div>
        <textarea
          className="mt-1 text-justify w-full resize-none overflow-hidden outline-none focus-within:outline-none"
          id="warranty"
          style={{ height: `${warrantyHeight}px` }}
          readOnly
          value={formData.warranty}
        />

        <div className="font-semibold mt-4">Installation Support</div>
        <textarea
          className="mt-1 text-justify w-full resize-none overflow-hidden outline-none focus-within:outline-none"
          id="installation-support"
          style={{ height: `${installationHeight}px` }}
          readOnly
          value={formData.installationSupport}
        />

        <div className="font-semibold mt-4">Appendix A</div>
        <textarea
          className="mt-1 text-justify w-full resize-none overflow-hidden outline-none focus-within:outline-none"
          id="appendix-a"
          style={{ height: `${appendixAHeight}px` }}
          readOnly
          value={formData.appendixA}
        />

        <div className="font-semibold mt-4">Appendix B</div>
        <textarea
          className="mt-1 text-justify w-full resize-none overflow-hidden outline-none focus-within:outline-none"
          id="appendix-b"
          style={{ height: `${appendixBHeight}px` }}
          readOnly
          value={formData.appendixB}
        />
      </Modal.Content>
    );
  }, [
    appendixAHeight,
    appendixBHeight,
    deliveryLeadTimeHeight,
    formData.appendixA,
    formData.appendixB,
    formData.createdAt,
    formData.customer?.address,
    formData.customer?.name,
    formData.customer?.person_in_charge,
    formData.deliveryLeadTime,
    formData.installationSupport,
    formData.paymentTerms,
    formData.quotationConditions,
    formData.warranty,
    installationHeight,
    isLoading,
    paymentTermHeight,
    quotationConditionsHeight,
    warrantyHeight,
  ]);

  return (
    <Modal handleClose={handleClose}>
      <Modal.Body className="w-[80vw]">{renderBody()}</Modal.Body>
    </Modal>
  );
};

export default PrintQuotationFrom;
