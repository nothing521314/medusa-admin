import { Product } from "@medusa-types";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import Section from "src/components/organisms/section";
import GeneralForm from "../../general-form";

type Props = {
  form: UseFormReturn<Product, any>;
  mode?: "new" | "edit";
};

const GeneralSection = ({ form, mode = "new" }: Props) => {
  return (
    <Section title="General">
      <div className="my-large">
        <GeneralForm mode={mode} form={form} />
      </div>
      {/* <div className="my-large">
          <h2 className="inter-base-semibold mb-base">Organize Product</h2>
          <OrganizeForm form={nestedForm(form, "organize")} />
        </div> */}
      {/* <DiscountableForm form={nestedForm(form, "discountable")} /> */}
    </Section>
  );
};

export default GeneralSection;
