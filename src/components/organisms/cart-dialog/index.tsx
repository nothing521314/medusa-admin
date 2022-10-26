import React, { useContext } from "react";

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
  const { productList } = useContext(CartContext);
  const { selectedRegion } = useContext(AccountContext);

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Overlay className="absolute z-10 grid top-0 left-0 right-8 place-items-end overflow-y-auto">
        <Dialog.Content className="bg-grey-0 w-[400px] shadow-dropdown rounded-rounded top-[64px] fixed flex flex-col justify-between">
          <div className="flex justify-end pt-4 px-4">
            <CrossIcon size={20} onClick={onClose} className="cursor-pointer" />
          </div>
          <div className="p-8 w-full flex flex-col gap-y-5">
            {productList?.map((prod, i) => {
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
                              )?.value || 0,
                            currency: selectedRegion?.currency_code || "",
                            digits: 2,
                            tax: selectedRegion?.tax_rate,
                          })}
                        </div>
                      </div>
                    </div>
                    <span className="cursor-pointer">
                      <BackspaceIcon
                        size={20}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      />
                    </span>
                  </div>
                  {prod?.additional_hardwares
                    ?.filter((child) => child.quantity)
                    ?.map((child, ic) => {
                      console.log(child);
                      return (
                        <div
                          className="flex justify-between items-center ml-9 mt-3"
                          key={ic}
                        >
                          <div className="flex h-10 gap-3 items-center">
                            <img
                              src={child?.thumbnail}
                              alt=""
                              className="h-12 w-6"
                            />
                            <div>
                              <div>{child?.title}</div>
                              <div className="text-xs text-grey-50">
                                {formatAmountWithSymbol({
                                  amount:
                                    child?.prices.find(
                                      (reg) =>
                                        reg.region_id === selectedRegion?.id
                                    )?.price || 0,
                                  currency: selectedRegion?.currency_code || "",
                                  digits: 2,
                                  tax: selectedRegion?.tax_rate,
                                })}
                              </div>
                            </div>
                          </div>
                          <span className="cursor-pointer">
                            <BackspaceIcon
                              size={20}
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            />
                          </span>
                        </div>
                      );
                    })}
                </div>
              );
            })}
            <Button
              variant="primary"
              onClick={onMakeQuotation}
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
