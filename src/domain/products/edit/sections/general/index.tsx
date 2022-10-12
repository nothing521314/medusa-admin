import { Product } from "@medusa-types";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Section from "src/components/organisms/section";
import Button from "../../../../../components/fundamentals/button";
import Modal from "../../../../../components/molecules/modal";
import { nestedForm } from "../../../../../utils/nested-form";
import DiscountableForm, {
  DiscountableFormType,
} from "../../../components/discountable-form";
import GeneralForm, { GeneralFormType } from "../../../components/general-form";
import OrganizeForm, {
  OrganizeFormType,
} from "../../../components/organize-form";
import useEditProductActions from "../../hooks/use-edit-product-actions";

type Props = {
  product: Product;
};

type GeneralForm = {
  general: GeneralFormType;
  organize: OrganizeFormType;
  discountable: DiscountableFormType;
};

const GeneralModal = ({ product }: Props) => {
  const { onUpdate, updating } = useEditProductActions(product.id);
  const form = useForm<GeneralForm>({
    defaultValues: getDefaultValues(product),
  });

  const {
    formState: { isDirty },
    handleSubmit,
    reset,
  } = form;

  useEffect(() => {
    reset(getDefaultValues(product));
  }, [product]);

  const onReset = () => {
    reset(getDefaultValues(product));
  };

  const onSubmit = handleSubmit((data) => {
    onUpdate(
      {
        title: data.general.title,
        handle: data.general.handle,
        // @ts-ignore
        material: data.general.material,
        // @ts-ignore
        subtitle: data.general.subtitle,
        // @ts-ignore
        description: data.general.description,
        // @ts-ignore
        type: data.organize.type
          ? {
              id: data.organize.type.value,
              value: data.organize.type.label,
            }
          : null,
        // @ts-ignore
        collection_id: data.organize.collection
          ? data.organize.collection.value
          : null,
        // @ts-ignore
        tags: data.organize.tags
          ? data.organize.tags.map((t) => ({ value: t }))
          : null,
        discountable: data.discountable.value,
      },
      onReset
    );
  });

  return (
    <Section title="General">
      <form onSubmit={onSubmit}>
        <div className="my-large">
          <GeneralForm form={nestedForm(form, "general")} />
        </div>
        {/* <div className="my-large">
          <h2 className="inter-base-semibold mb-base">Organize Product</h2>
          <OrganizeForm form={nestedForm(form, "organize")} />
        </div> */}
        {/* <DiscountableForm form={nestedForm(form, "discountable")} /> */}
      </form>
    </Section>
  );
};

const getDefaultValues = (product: Product): GeneralForm => {
  return {
    general: {
      ...product,
      title: product.title,
      subtitle: product.subtitle,
      material: product.material,
      handle: product.handle!,
      description: product.description || null,
      collection: product.collection
        ? { label: product.collection.title, value: product.collection.id }
        : null,
      weight: product.weight ?? 100,
      width: product.width ?? 200,
      height: product.height ?? 500,
      deliveryTime: '12-16 days'
    },
    organize: {
      collection: product.collection
        ? { label: product.collection.title, value: product.collection.id }
        : null,
      type: product.type
        ? { label: product.type.value, value: product.type.id }
        : null,
      tags: product.tags ? product.tags.map((t) => t.value) : null,
    },
    discountable: {
      value: product.discountable,
    },
  };
};

export default GeneralModal;
