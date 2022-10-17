import { useAdminProduct } from "@medusa-react";
import { Hardware } from "@medusa-types";
import clsx from "clsx";
import React, { useCallback, useContext, useEffect, useState } from "react";
import Button from "src/components/fundamentals/button";
import CheckIcon from "src/components/fundamentals/icons/check-icon";
import Modal from "src/components/molecules/modal";
import { AccountContext } from "src/context/account";
import { formatAmountWithSymbol } from "src/utils/prices";

type Props = {
  id: string;
  isOpen: boolean;
  handleClose: () => void;
  handleSubmit: (formatListItem: Hardware[]) => void;
};

interface IHardware extends Hardware {
  isChecked?: boolean;
}

const SelectAdditionalHardwareModal = ({
  id,
  isOpen,
  handleClose,
  handleSubmit,
}: Props) => {
  const { product, isLoading } = useAdminProduct(id);
  const { selectedRegion } = useContext(AccountContext);

  const [additionalHardwaresList, setAdditionalHardwaresList] = useState<
    IHardware[]
  >([]);

  const handleSelectHardware = useCallback(
    (id: string) => {
      const index = additionalHardwaresList.findIndex((item) => item.id === id);
      const cloneArr = [...additionalHardwaresList];
      cloneArr[index] = {
        ...cloneArr[index],
        isChecked: !cloneArr[index]?.isChecked,
      };
      setAdditionalHardwaresList(cloneArr);
    },
    [additionalHardwaresList]
  );

  const handleClickAddToCartBtn = useCallback(() => {
    const selectedList = additionalHardwaresList.filter(
      (item) => item.isChecked
    );

    const formatListItem = selectedList?.map((item) => {
      return {
        ...item.product_addition,
        id: item.id,
      };
    });

    handleSubmit((formatListItem as unknown) as Hardware[]);
  }, [additionalHardwaresList, handleSubmit]);

  useEffect(() => {
    if (!isLoading && product?.additional_hardwares?.length) {
      setAdditionalHardwaresList(product?.additional_hardwares);
    }
  }, [isLoading, product?.additional_hardwares]);

  return (
    <Modal open={isOpen} handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <h2 className="inter-xlarge-semibold">Select Additional Hardware</h2>
        </Modal.Header>
        <Modal.Content>
          <div className="overflow-y-auto scrollbar-thin min-h-fit max-h-[60vh]">
            {additionalHardwaresList?.map((item, index) => {
              return (
                <div
                  key={index}
                  className={clsx(
                    "w-32 flex flex-col items-center cursor-pointer",
                    "grid grid-cols-[repeat(auto-fill,minmax(128px,5fr) gap-4"
                  )}
                  onClick={() => handleSelectHardware(item.id)}
                >
                  <div
                    className={clsx(
                      "h-44 w-full bg-red-500 rounded-lg border",
                      "bg-cover bg-center bg-no-repeat"
                    )}
                    style={{
                      backgroundImage: `url(${item?.product_addition?.thumbnail})`,
                    }}
                  ></div>
                  <div className="mt-2 flex flex-row justify-between w-full">
                    <div>{item?.product_addition.title}</div>
                    <div>
                      {
                        item?.product_addition?.prices.find(
                          (reg) => reg.region_id === selectedRegion?.id
                        )?.price
                      }
                      {formatAmountWithSymbol({
                        amount:
                          item?.product_addition?.prices.find(
                            (reg) => reg.region_id === selectedRegion?.id
                          )?.price || 0,
                        currency: "usd",
                        digits: 2,
                      })}
                    </div>
                  </div>
                  <div
                    className={clsx(
                      "w-5 h-5 m-auto border-[2px] rounded-base transition-colors duration-100",
                      "flex items-center justify-center box-border",
                      item.isChecked ? "border-violet-60" : "border-grey-30",
                      {
                        "bg-violet-60": item.isChecked,
                      }
                    )}
                  >
                    {item.isChecked && (
                      <CheckIcon size="14" color="white" strokeWidth="2" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <Button
            variant="primary"
            className="m-auto mt-4"
            onClick={handleClickAddToCartBtn}
          >
            Add To Cart
          </Button>
        </Modal.Content>
      </Modal.Body>
    </Modal>
  );
};

export default SelectAdditionalHardwareModal;
