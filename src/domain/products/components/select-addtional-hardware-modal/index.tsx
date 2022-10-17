import { useAdminProduct } from "@medusa-react";
import { Hardware } from "@medusa-types";
import clsx from "clsx";
import React, { useCallback, useContext, useEffect, useState } from "react";
import Checkbox from "src/components/atoms/checkbox";
import Button from "src/components/fundamentals/button";
import ImagePlaceholderIcon from "src/components/fundamentals/icons/image-placeholder-icon";
import Modal from "src/components/molecules/modal";
import { AccountContext } from "src/context/account";
import { formatAmountWithSymbol } from "src/utils/prices";

type Props = {
  id: string;
  hw?: Hardware;
  isOpen: boolean;
  handleClose: () => void;
  handleSubmit: (formatListItem: Hardware[]) => void;
};

interface IHardware extends Hardware {
  isChecked?: boolean;
}

const SelectAdditionalHardwareModal = ({
  id,
  hw,
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
    handleClose();
  }, [additionalHardwaresList, handleClose, handleSubmit]);

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
          <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(210px,5fr))] gap-4">
            {additionalHardwaresList?.map((h, index) => {
              const hw = h.product_addition;
              if (!hw) return null;
              
              const item = {
                ...h,
                id: h.product_additions_id,
                title: hw.title,
                images: [hw.thumbnail],
                prices: hw.prices?.map((v) => ({
                  ...v,
                  label: v.region_id,
                  value: v.price,
                })),
              };

              const price = formatAmountWithSymbol({
                amount:
                  hw.prices.find((reg) => reg.region_id === selectedRegion?.id)
                    ?.price || 0,
                currency: "usd",
              });

              return (
                <div
                  key={index}
                  className="p-base group cursor-pointer relative rounded-rounded flex-col border border-grey-30"
                  onClick={(e) => {
                    handleSelectHardware(h.id);
                  }}
                >
                  <div className="relative  ">
                    <div
                      className={clsx(
                        "rounded-base inline-block absolute top-2 right-2 z-10 hover:bg-grey-5"
                      )}
                    ></div>
                    <div
                      className={clsx(
                        "min-h-[230px] flex items-center justify-center bg-grey-5 rounded-rounded relative",
                        "bg-cover bg-no-repeat bg-center"
                      )}
                      style={{
                        backgroundImage: `url(${item?.images?.[0]})`,
                      }}
                    >
                      {!item?.images && <ImagePlaceholderIcon size={12} />}
                    </div>
                    <div>
                      <div className="mt-base flex items-center justify-between">
                        <p className="inter-small-regular text-grey-90 font-semibold line-clamp-1 mr-3">
                          {item?.title}
                        </p>
                        <p className="inter-small-regular text-grey-90 font-semibold line-clamp-1 ">
                          {price ? price : "-"}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-center mt-4">
                      <Checkbox
                        label=""
                        checked={item.isChecked}
                        onChange={(e) => {
                          handleSelectHardware(h.id);
                        }}
                      />
                    </div>
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
