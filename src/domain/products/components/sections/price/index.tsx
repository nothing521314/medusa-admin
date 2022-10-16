import { Product } from "@medusa-types";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import Section from "src/components/organisms/section";
import PricesForm from "src/domain/products/components/prices-form";

type Props = {
  form: UseFormReturn<Product, any>;
};

const AddVariantModal = ({ form }: Props) => {
  return (
    <Section title="Price">
      <div className="mt-3">
        <PricesForm form={form} />
      </div>
    </Section>
  );
};

export default AddVariantModal;
