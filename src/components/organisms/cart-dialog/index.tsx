import React, { useCallback, useContext } from "react";

import { CartContext } from "@medusa-react";
import * as Dialog from "@radix-ui/react-dialog";
import BackspaceIcon from "src/components/fundamentals/icons/backspace-icon";
import { AccountContext } from "src/context/account";
import { formatAmountWithSymbol } from "src/utils/prices";
import Button from "src/components/fundamentals/button";
import CrossIcon from "src/components/fundamentals/icons/cross-icon";

type CartDialogProps = {
  onClose: () => void;
  open: boolean;
  onMakeQuotation: () => void;
};

const CartDialog = ({ open, onClose, onMakeQuotation }: CartDialogProps) => {
  const { productList, handleSetListProduct } = useContext(CartContext);
  const { selectedRegion } = useContext(AccountContext);

  const handleDeleteProduct = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>, prodId: string) => {
      event.stopPropagation();
      const clone = [...productList];
      const i = clone.findIndex((prod) => prod.id === prodId);
      clone.splice(i, 1);
      handleSetListProduct && handleSetListProduct([...clone]);
    },
    [handleSetListProduct, productList]
  );

  const handleDeleteAdditionalHardware = useCallback(
    (
      event: React.MouseEvent<HTMLDivElement, MouseEvent>,
      prodId: string,
      hardwareId: string
    ) => {
      event.stopPropagation();
      const clone = [...productList];
      const i = clone.findIndex((prod) => prod.id === prodId);
      const childList = [...clone[i].additional_hardwares!];

      const iChild = childList.findIndex((item) => item.id === hardwareId);
      childList.splice(iChild, 1);
      clone[i].additional_hardwares = [...childList];
      handleSetListProduct && handleSetListProduct([...clone]);
    },
    [handleSetListProduct, productList]
  );

  const renderBody = useCallback(() => {
    if (!productList.length) {
      return <div className="text-center text-grey-50">No product added</div>;
    }

    return productList?.map((prod, i) => {
      return (
        <div key={i}>
          <div className="flex justify-between items-center">
            <div className="flex h-10 gap-3 items-center">
              <img src={prod?.thumbnail} alt="" className="h-12 w-6" />
              <div>
                <div>{prod?.title}</div>
                <div className="text-xs text-grey-50">
                  {formatAmountWithSymbol({
                    amount:
                      prod?.prices.find(
                        (reg) => reg.region === selectedRegion?.id
                      )?.value ||
                      prod?.prices.find(
                        (reg) => reg.region_id === selectedRegion?.id
                      )?.price ||
                      0,
                    currency: selectedRegion?.currency_code || "",
                    digits: 2,
                    tax: selectedRegion?.tax_rate,
                  })}
                </div>
              </div>
            </div>
            <div
              className="cursor-pointer"
              onClick={(e) => handleDeleteProduct(e, prod.id!)}
            >
              <BackspaceIcon size={20} />
            </div>
          </div>
          {prod?.additional_hardwares
            ?.filter((child) => child.quantity)
            ?.map((child, ic) => {
              return (
                <div
                  className="flex justify-between items-center ml-9 mt-3"
                  key={ic}
                >
                  <div className="flex h-10 gap-3 items-center">
                    <img src={child?.thumbnail} alt="" className="h-12 w-6" />
                    <div>
                      <div>{child?.title}</div>
                      <div className="text-xs text-grey-50">
                        {formatAmountWithSymbol({
                          amount:
                            child?.prices.find(
                              (reg) => reg.region_id === selectedRegion?.id
                            )?.price || 0,
                          currency: selectedRegion?.currency_code || "",
                          digits: 2,
                          tax: selectedRegion?.tax_rate,
                        })}
                      </div>
                    </div>
                  </div>
                  <div
                    className="cursor-pointer"
                    onClick={(e) =>
                      handleDeleteAdditionalHardware(e, prod.id!, child.id)
                    }
                  >
                    <BackspaceIcon size={20} />
                  </div>
                </div>
              );
            })}
        </div>
      );
    });
  }, [
    handleDeleteAdditionalHardware,
    handleDeleteProduct,
    productList,
    selectedRegion?.currency_code,
    selectedRegion?.id,
    selectedRegion?.tax_rate,
  ]);

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Overlay className="absolute z-10 grid top-0 left-0 right-8 place-items-end overflow-y-auto">
        <Dialog.Content className="bg-grey-0 w-[400px] shadow-dropdown rounded-rounded top-[64px] fixed flex flex-col justify-between">
          <div className="flex justify-end pt-4 px-4">
            <CrossIcon size={20} onClick={onClose} className="cursor-pointer" />
          </div>
          <div className="p-8 w-full flex flex-col gap-y-5">
            {renderBody()}
            <Button
              variant="primary"
              onClick={onMakeQuotation}
              disabled={!productList?.length}
              className="w-full"
            >
              Make Quotation
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Overlay>
    </Dialog.Root>
  );
};

export default CartDialog;
