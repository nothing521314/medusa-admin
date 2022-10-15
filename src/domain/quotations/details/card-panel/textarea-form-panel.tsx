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
    console.log(
      quotationConditionsHeight,
      paymentTermsHeight,
      deliveryLeadTimeHeight,
      warrantyHeight,
      installationSupportHeight,
      appendixAHeight,
      appendixBHeight
    );

    setHeightState({
      quotationConditionsHeight,
      paymentTermsHeight,
      deliveryLeadTimeHeight,
      warrantyHeight,
      installationSupportHeight,
      appendixAHeight,
      appendixBHeight,
    });
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
            height: readOnly
              ? "fit-content"
              : quotationConditionsHeight
              ? `${quotationConditionsHeight}px`
              : "auto",
          }}
          id="quotationConditions"
          readOnly={readOnly}
          {...register("quotationConditions")}
        />
      </BodyCard>
      <BodyCard className="w-full mb-4 min-h-0 h-auto" title="Payment Terms">
        <textarea
          className={clsx(
            "overflow-hidden py-5 px-8 border rounded-2xl text-justify",
            "resize-none outline-none focus:outline-none"
          )}
          style={{
            height: readOnly
              ? "fit-content"
              : paymentTermsHeight
              ? `${paymentTermsHeight}px`
              : "auto",
          }}
          id="paymentTerms"
          readOnly={readOnly}
          {...register("paymentTerms")}
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
            height: readOnly
              ? "fit-content"
              : deliveryLeadTimeHeight
              ? `${deliveryLeadTimeHeight}px`
              : "auto",
          }}
          id="deliveryLeadTime"
          readOnly={readOnly}
          {...register("deliveryLeadTime")}
        />
      </BodyCard>
      <BodyCard className="w-full mb-4 min-h-0 h-auto" title="Warranty">
        <textarea
          className={clsx(
            "overflow-hidden py-5 px-8 border rounded-2xl text-justify",
            "resize-none outline-none focus:outline-none"
          )}
          style={{
            height: readOnly
              ? "fit-content"
              : warrantyHeight
              ? `${warrantyHeight}px`
              : "auto",
          }}
          readOnly={readOnly}
          id="warranty"
          {...register("warranty")}
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
            height: readOnly
              ? "fit-content"
              : installationSupportHeight
              ? `${installationSupportHeight}px`
              : "auto",
          }}
          readOnly={readOnly}
          id="installationSupport"
          {...register("installationSupport")}
        />
      </BodyCard>
      <BodyCard className="w-full mb-4 min-h-0 h-auto" title="Appendix A">
        <textarea
          className={clsx(
            "overflow-hidden py-5 px-8 border rounded-2xl text-justify",
            "resize-none outline-none focus:outline-none"
          )}
          style={{
            height: readOnly
              ? "fit-content"
              : appendixAHeight
              ? `${appendixAHeight}px`
              : "auto",
          }}
          id="appendixA"
          readOnly={readOnly}
          {...register("appendixA")}
        />
      </BodyCard>
      <BodyCard className="w-full mb-4 min-h-0 h-auto" title="Appendix B">
        <textarea
          className={clsx(
            "overflow-hidden py-5 px-8 border rounded-2xl text-justify",
            "resize-none outline-none focus:outline-none"
          )}
          style={{
            height: readOnly
              ? "fit-content"
              : appendixBHeight
              ? `${appendixBHeight}px`
              : "auto",
          }}
          readOnly={readOnly}
          id="appendixB"
          {...register("appendixB")}
        />
      </BodyCard>
    </React.Fragment>
  );
};

export default TextAreaFormPanel;
