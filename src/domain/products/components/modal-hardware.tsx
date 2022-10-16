import { useAdminProducts } from "@medusa-react";
import { Hardware } from "@medusa-types";
import clsx from "clsx";
import React from "react";
import Spinner from "src/components/atoms/spinner";
import Button from "src/components/fundamentals/button";
import Modal from "src/components/molecules/modal";
import { KEY } from "src/constants/misc";

type ModalHardwaresProps = {
  onDismiss: () => void;
  hwAdded: Hardware[];
  onAdd: (data: Hardware) => void;
};

const ModalHardwares: React.FC<ModalHardwaresProps> = ({
  onDismiss,
  onAdd,
  hwAdded = [],
}) => {
  const { products, isSuccess } = useAdminProducts({
    collection_id: [KEY.ID_CATEGORY_HW!],
  });

  const hardwares = products?.map((v: any) => {
    return {
      ...v,
      prices: v.prices?.map((v: any) => ({
        label: v.region_id,
        value: v.price,
      })),
    };
  }) as Hardware[];

  return (
    <Modal handleClose={onDismiss}>
      <Modal.Body>
        <Modal.Header handleClose={onDismiss}>
          <h2 className="inter-xlarge-semibold">Additional hardwares</h2>
        </Modal.Header>
        <Modal.Content>
          {isSuccess ? (
            <div className="flex flex-col gap-y-2xsmall">
              {hardwares?.map((hw) => {
                const img = hw.images?.[0];
                const price = hw.prices?.[0]?.value;

                const isAdded = hwAdded.some((v) => {
                  return v.id === hw.id;
                });

                return (
                  <div
                    className={clsx(
                      "px-base  py-xsmall group hover:bg-grey-5 rounded-rounded flex items-center justify-between border border-gray-30",
                      {
                        // "bg-grey-5": value,
                      }
                    )}
                  >
                    <div className="flex items-center gap-x-large">
                      <div className="w-16 h-16 flex items-center justify-center">
                        <img
                          src={img?.url}
                          className="max-w-[64px] max-h-[64px] rounded-rounded"
                        />
                      </div>
                      <div className="flex flex-col inter-small-regular text-left">
                        <p>{hw.title}</p>
                        <p className="text-grey-50">{hw.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-x-base">
                      <span> {price ? `$${price}` : "-"}</span>
                      <Button
                        variant="primary"
                        disabled={isAdded}
                        onClick={() => onAdd(hw)}
                      >
                        {isAdded ? "Added" : "Add"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="w-full h-5 flex items-center justify-center">
              <Spinner variant="secondary" />
            </div>
          )}
        </Modal.Content>
        <Modal.Footer>
          <div className="flex w-full justify-end gap-x-xsmall">
            <Button
              variant="ghost"
              onClick={onDismiss}
              size="small"
              className="w-[112px]"
            >
              Cancel
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  );
};

export default ModalHardwares;
