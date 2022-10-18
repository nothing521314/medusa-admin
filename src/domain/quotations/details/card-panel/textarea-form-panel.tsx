import clsx from "clsx";
import React, { useCallback, useEffect, useState } from "react";
import { UseFormRegister, UseFormWatch } from "react-hook-form";
import BodyCard from "src/components/organisms/body-card";
import { IQuotationDetailForm } from "..";

type Props = {
  register: UseFormRegister<IQuotationDetailForm>;
  readOnly?: boolean;
  watch: UseFormWatch<IQuotationDetailForm>;
};

type THeightTextArea = {
  quotationConditionsHeight: number | null;
  paymentTermsHeight: number | null;
  deliveryLeadTimeHeight: number | null;
  warrantyHeight: number | null;
  installationSupportHeight: number | null;
  appendixAHeight: number | null;
  appendixBHeight: number | null;
};

const TextAreaFormPanel = ({ register, readOnly = false }: Props) => {
  const [
    {
      quotationConditionsHeight,
      paymentTermsHeight,
      deliveryLeadTimeHeight,
      warrantyHeight,
      installationSupportHeight,
      appendixAHeight,
      appendixBHeight,
    },
    setHeightState,
  ] = useState<THeightTextArea>({
    quotationConditionsHeight: 96,
    paymentTermsHeight: 96,
    deliveryLeadTimeHeight: 96,
    warrantyHeight: 96,
    installationSupportHeight: 96,
    appendixAHeight: 96,
    appendixBHeight: 96,
  });

  const handleCalcHeightTextBox = useCallback(() => {
    setTimeout(() => {
      const quotationConditionsHeight =
        document.getElementById("quotationConditions")?.scrollHeight || null;
      const paymentTermsHeight =
        document.getElementById("paymentTerms")?.scrollHeight || null;
      const deliveryLeadTimeHeight =
        document.getElementById("deliveryLeadTime")?.scrollHeight || null;
      const warrantyHeight =
        document.getElementById("warranty")?.scrollHeight || null;
      const installationSupportHeight =
        document.getElementById("installationSupport")?.scrollHeight || null;
      const appendixAHeight =
        document.getElementById("appendixA")?.scrollHeight || null;
      const appendixBHeight =
        document.getElementById("appendixB")?.scrollHeight || null;

      setHeightState({
        quotationConditionsHeight,
        paymentTermsHeight,
        deliveryLeadTimeHeight,
        warrantyHeight,
        installationSupportHeight,
        appendixAHeight,
        appendixBHeight,
      });
    }, 500);
  }, []);

  useEffect(handleCalcHeightTextBox, [handleCalcHeightTextBox, readOnly]);

  useEffect(() => {
    document.addEventListener("input", handleCalcHeightTextBox);

    return () => {
      document.removeEventListener("input", handleCalcHeightTextBox);
    };
  }, [handleCalcHeightTextBox]);

  return (
    <React.Fragment>
      <BodyCard
        className="w-full mb-4 min-h-0 h-auto"
        title="Quotation Conditions"
      >
        <textarea
          className={clsx(
            "overflow-hidden py-5 px-8 border rounded-2xl text-justify",
            "resize-none outline-none focus:outline-none"
          )}
          style={{
            height: quotationConditionsHeight
              ? `${quotationConditionsHeight}px`
              : "auto",
          }}
          id="quotationConditions"
          readOnly={readOnly}
          {...register("quotationConditions", { required: true })}
        />
      </BodyCard>
      <BodyCard className="w-full mb-4 min-h-0 h-auto" title="Payment Terms">
        <textarea
          className={clsx(
            "overflow-hidden py-5 px-8 border rounded-2xl text-justify",
            "resize-none outline-none focus:outline-none"
          )}
          style={{
            height: paymentTermsHeight ? `${paymentTermsHeight}px` : "auto",
          }}
          id="paymentTerms"
          readOnly={readOnly}
          {...register("paymentTerms", { required: true })}
        />
      </BodyCard>
      <BodyCard
        className="w-full mb-4 min-h-0 h-auto"
        title="Delivery Lead Time"
      >
        <textarea
          className={clsx(
            "overflow-hidden py-5 px-8 border rounded-2xl text-justify",
            "resize-none outline-none focus:outline-none"
          )}
          style={{
            height: deliveryLeadTimeHeight
              ? `${deliveryLeadTimeHeight}px`
              : "auto",
          }}
          id="deliveryLeadTime"
          readOnly={readOnly}
          {...register("deliveryLeadTime", { required: true })}
        />
      </BodyCard>
      <BodyCard className="w-full mb-4 min-h-0 h-auto" title="Warranty">
        <textarea
          className={clsx(
            "overflow-hidden py-5 px-8 border rounded-2xl text-justify",
            "resize-none outline-none focus:outline-none"
          )}
          style={{
            height: warrantyHeight ? `${warrantyHeight}px` : "auto",
          }}
          readOnly={readOnly}
          id="warranty"
          {...register("warranty", { required: true })}
        />
      </BodyCard>
      <BodyCard
        className="w-full mb-4 min-h-0 h-auto"
        title="Installation Support"
      >
        <textarea
          className={clsx(
            "overflow-hidden py-5 px-8 border rounded-2xl text-justify",
            "resize-none outline-none focus:outline-none"
          )}
          style={{
            height: installationSupportHeight
              ? `${installationSupportHeight}px`
              : "auto",
          }}
          readOnly={readOnly}
          id="installationSupport"
          {...register("installationSupport", { required: true })}
        />
      </BodyCard>
      <BodyCard className="w-full mb-4 min-h-0 h-auto" title="Appendix A">
        <textarea
          className={clsx(
            "overflow-hidden py-5 px-8 border rounded-2xl text-justify",
            "resize-none outline-none focus:outline-none"
          )}
          style={{
            height: appendixAHeight ? `${appendixAHeight}px` : "auto",
          }}
          id="appendixA"
          readOnly={readOnly}
          {...register("appendixA", { required: true })}
        />
      </BodyCard>
      <BodyCard className="w-full mb-4 min-h-0 h-auto" title="Appendix B">
        <textarea
          className={clsx(
            "overflow-hidden py-5 px-8 border rounded-2xl text-justify",
            "resize-none outline-none focus:outline-none"
          )}
          style={{
            height: appendixBHeight ? `${appendixBHeight}px` : "auto",
          }}
          readOnly={readOnly}
          id="appendixB"
          {...register("appendixB", { required: true })}
        />
      </BodyCard>
    </React.Fragment>
  );
};

export default TextAreaFormPanel;
