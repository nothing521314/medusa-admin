import { Product } from "@medusa-types";
import React, { useEffect } from "react";
import { useForm, UseFormRegister, UseFormReturn } from "react-hook-form";
import CartPlusIcon from "src/components/fundamentals/icons/cart-plus-icon";
import Section from "src/components/organisms/section";
import Button from "../../../../../components/fundamentals/button";
import useNotification from "../../../../../hooks/use-notification";
import { FormImage } from "../../../../../types/shared";
import { prepareImages } from "../../../../../utils/images";
import { nestedForm } from "../../../../../utils/nested-form";
import MediaForm from "../../media-form";
import useEditProductActions from "../../../edit/hooks/use-edit-product-actions";
import { CartContext, useAdminDeleteProduct } from "@medusa-react";
import clsx from "clsx";

type Props = {
  mode?: "new" | "edit";
  form: UseFormReturn<Product, any>;
};

const MediaSection = ({ mode = "new", form }: Props) => {
  // const { onUpdate, updating } = useEditProductActions(product.id!);
  const { handleAddToCart } = React.useContext(CartContext);
  const isModeEdit = mode === "edit";
  const { getValues } = form;

  const notification = useNotification();

  const price = getValues("prices")?.[0]?.value;

  return (
    <Section title="Media">
      <div className="grid grid-cols-12 gap-x-base">
        <div
          className={clsx(
            " flex flex-col gap-y-3",
            isModeEdit ? "col-span-7" : "col-span-12"
          )}
        >
          <MediaForm form={form} />
        </div>
        {isModeEdit && (
          <div className="flex flex-col col-span-5 gap-y-3 justify-center items-center">
            <span>
              <span className="font-bold">Price</span>:{" "}
              <span className="text-xl">{price ? `$${price}` : "-"}</span>
            </span>
            <Button
              variant="secondary"
              size="small"
              onClick={() => handleAddToCart?.(getValues())}
            >
              <CartPlusIcon size={20} />
              Add To Cart
            </Button>
          </div>
        )}
      </div>
    </Section>
  );
};

export default MediaSection;
