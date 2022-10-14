import React from "react";
import { UseFormRegister } from "react-hook-form";
import BodyCard from "src/components/organisms/body-card";
import { IQuotationDetailForm } from "..";

type Props = {
  register: UseFormRegister<IQuotationDetailForm>;
  readOnly?: boolean;
};

const TextAreaFormPanel = ({ register, readOnly = false }: Props) => {
  return (
    <React.Fragment>
      <BodyCard
        className="w-full mb-4 min-h-0 h-auto"
        title="Quotation Conditions"
      >
        <textarea
          className="scrollbar-thin py-5 px-8 border rounded-2xl text-justify resize-none outline-none focus:outline-none"
          rows={15}
          readOnly={readOnly}
          {...register("quotationConditions")}
        />
      </BodyCard>
      <BodyCard className="w-full mb-4 min-h-0 h-auto" title="Payment Terms">
        <textarea
          className="scrollbar-thin py-5 px-8 border rounded-2xl text-justify resize-none outline-none focus:outline-none"
          rows={14}
          readOnly={readOnly}
          {...register("paymentTerms")}
        />
      </BodyCard>
      <BodyCard
        className="w-full mb-4 min-h-0 h-auto"
        title="Delivery Lead Time"
      >
        <textarea
          className="scrollbar-thin py-5 px-8 border rounded-2xl text-justify resize-none outline-none focus:outline-none"
          readOnly={readOnly}
          {...register("deliveryLeadTime")}
        />
      </BodyCard>
      <BodyCard className="w-full mb-4 min-h-0 h-auto" title="Warranty">
        <textarea
          className="scrollbar-thin py-5 px-8 border rounded-2xl text-justify resize-none outline-none focus:outline-none"
          readOnly={readOnly}
          rows={22}
          {...register("warranty")}
        />
      </BodyCard>
      <BodyCard
        className="w-full mb-4 min-h-0 h-auto"
        title="Installation Support"
      >
        <textarea
          className="scrollbar-thin py-5 px-8 border rounded-2xl text-justify resize-none outline-none focus:outline-none"
          readOnly={readOnly}
          rows={32}
          {...register("installationSupport")}
        />
      </BodyCard>
      <BodyCard className="w-full mb-4 min-h-0 h-auto" title="Appendix A">
        <textarea
          className="scrollbar-thin py-5 px-8 border rounded-2xl text-justify resize-none outline-none focus:outline-none"
          rows={80}
          readOnly={readOnly}
          {...register("appendixA")}
        />
      </BodyCard>
      <BodyCard className="w-full mb-4 min-h-0 h-auto" title="Appendix B">
        <textarea
          className="scrollbar-thin py-5 px-8 border rounded-2xl text-justify resize-none outline-none focus:outline-none"
          readOnly={readOnly}
          rows={14}
          {...register("appendixB")}
        />
      </BodyCard>
    </React.Fragment>
  );
};

export default TextAreaFormPanel;
