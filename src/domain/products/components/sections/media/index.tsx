import { CartContext } from "@medusa-react";
import { Product } from "@medusa-types";
import clsx from "clsx";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import CartPlusIcon from "src/components/fundamentals/icons/cart-plus-icon";
import Section from "src/components/organisms/section";
import useToggleState from "src/hooks/use-toggle-state";
import Button from "../../../../../components/fundamentals/button";
import MediaForm from "../../media-form";
import SelectAdditionalHardwareModal from "../../select-addtional-hardware-modal";

type Props = {
  mode?: "new" | "edit";
  form: UseFormReturn<Product, any>;
};

const MediaSection = ({ mode = "new", form }: Props) => {
  // const { onUpdate, updating } = useEditProductActions(product.id!);
  const { handleAddToCart } = React.useContext(CartContext);
  const isModeEdit = mode === "edit";
  const { getValues } = form;
  const {
    open: handleOpenHardwareModal,
    close: handleCloseHardwareModal,
    state: isOpenHardwareModal,
  } = useToggleState(false);

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
              onClick={handleOpenHardwareModal}
            >
              <CartPlusIcon size={20} />
              Add To Cart
            </Button>
          </div>
        )}
      </div>
      {isOpenHardwareModal && (
        <SelectAdditionalHardwareModal
          id={getValues("id") || ""}
          isOpen={isOpenHardwareModal}
          handleClose={handleCloseHardwareModal}
          handleSubmit={(hw) => {
            if (!handleAddToCart) return;
            handleAddToCart({
              ...getValues(),
              additional_hardwares: hw,
            });
          }}
        />
      )}
    </Section>
  );
};

export default MediaSection;
