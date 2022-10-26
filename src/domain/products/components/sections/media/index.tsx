import { CartContext } from "@medusa-react";
import { Hardware, Product } from "@medusa-types";
import clsx from "clsx";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { UseFormReturn } from "react-hook-form";
import CartPlusIcon from "src/components/fundamentals/icons/cart-plus-icon";
import Section from "src/components/organisms/section";
import { AccountContext } from "src/context/account";
import useToggleState from "src/hooks/use-toggle-state";
import { formatAmountWithSymbol } from "src/utils/prices";
import Button from "../../../../../components/fundamentals/button";
import MediaForm from "../../media-form";
import SelectAdditionalHardwareModal from "../../select-addtional-hardware-modal";

type Props = {
  mode?: "new" | "edit";
  form: UseFormReturn<Product, any>;
};

const MediaSection = ({ mode = "new", form }: Props) => {
  // const { onUpdate, updating } = useEditProductActions(product.id!);
  const { handleAddToCart, handleAddHarwareToCart } = React.useContext(
    CartContext
  );
  const { selectedRegion } = useContext(AccountContext);
  const isModeEdit = mode === "edit";
  const { getValues } = form;
  const {
    open: handleOpenHardwareModal,
    close: handleCloseHardwareModal,
    state: isOpenHardwareModal,
  } = useToggleState(false);

  const prices = getValues("prices");
  const child_product = getValues("additional_hardwares");
  const price = useMemo(() => {
    return (
      prices?.find((reg) => reg?.region === selectedRegion?.id)?.value || 0
    );
  }, [prices, selectedRegion?.id]);

  const listHavePrice = React.useMemo(() => {
    return child_product?.filter((item) => {
      const price = item?.prices?.find(
        (reg) => (reg as { label?: string })?.label === selectedRegion?.id
      );
      return !!price;
    });
  }, [child_product, selectedRegion?.id]);

  const [hardwares, setHardWares] = useState<Hardware[]>([]);

  const handleSubmitAdd = useCallback(
    (hw) => {
      handleAddToCart && handleAddToCart(getValues());
      setHardWares(hw);
    },
    [getValues, handleAddToCart]
  );

  useEffect(() => {
    if (!hardwares.length) return;
    try {
      handleAddHarwareToCart?.(getValues("id")!, hardwares);
      setHardWares([]);
    } catch (error) {
      console.log(error);
    }
  }, [getValues, handleAddHarwareToCart, hardwares]);

  return (
    <Section title="Media">
      <div className="grid grid-cols-12 gap-x-base">
        <div
          className={clsx(
            " flex flex-col gap-y-3",
            isModeEdit ? "col-span-7" : "col-span-12"
          )}
        >
          <MediaForm mode={mode} form={form} />
        </div>
        {isModeEdit && (
          <div className="flex flex-col col-span-5 gap-y-3 justify-center items-center">
            <span>
              <span className="font-bold">Price</span>:{" "}
              <span className="text-xl">
                {price
                  ? formatAmountWithSymbol({
                      amount: price,
                      currency: selectedRegion?.currency_code || "usd",
                      digits: 2,
                      tax: selectedRegion?.tax_rate || 0,
                    })
                  : "-"}
              </span>
            </span>
            <Button
              variant="secondary"
              size="small"
              onClick={() => {
                if (listHavePrice?.length) {
                  handleOpenHardwareModal();
                } else {
                  handleAddToCart && handleAddToCart(getValues());
                }
              }}
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
          handleSubmit={handleSubmitAdd}
        />
      )}
    </Section>
  );
};

export default MediaSection;
