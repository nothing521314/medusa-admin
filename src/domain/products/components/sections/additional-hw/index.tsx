import { useAdminRegions } from "@medusa-react";
import { Hardware, Product, Region } from "@medusa-types";
import clsx from "clsx";
import React from "react";
import { useFieldArray, UseFormReturn, useWatch } from "react-hook-form";
import Button from "src/components/fundamentals/button";
import CrossIcon from "src/components/fundamentals/icons/cross-icon";
import ImagePlaceholderIcon from "src/components/fundamentals/icons/image-placeholder-icon";
import Section from "src/components/organisms/section";
import { KEY } from "src/constants/misc";
import useToggleState from "src/hooks/use-toggle-state";
import ModalHardwares from "../../modal-add-hardware";

type Props = {
  form: UseFormReturn<Product, any>;
};

function AdditionalHardwares({ form: { control } }: Props) {
  const { regions } = useAdminRegions();
  const { collection } = useWatch({
    control,
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "additional_hardwares",
    keyName: "keyName",
  });
  const [showAdd, open, close] = useToggleState();

  const handleAddHardware = (hw: Hardware) => {
    append(hw);
  };

  if (collection?.value === KEY.ID_CATEGORY_HW) return null;

  return (
    <>
      <Section
        title="Additional hardwares"
        customActions={
          <Button variant="secondary" onClick={open}>
            Add
          </Button>
        }
      >
        <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(210px,5fr))] gap-4">
          {fields.map((p, index) => {
            return (
              <HardwareItem
                key={p.id}
                product={p}
                regions={regions}
                remove={() => remove(index)}
              />
            );
          })}
        </div>
      </Section>
      {showAdd && (
        <ModalHardwares
          hwAdded={fields}
          onAdd={handleAddHardware}
          onDismiss={close}
        />
      )}
    </>
  );
}
const HardwareItem = ({
  product,
  remove,
  regions,
}: {
  product: Hardware;
  remove: () => void;
  regions: Region[];
}) => {
  const price = product.prices?.[0]?.value;

  return (
    <div className="p-base group relative rounded-rounded flex-col border border-grey-30">
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
          style={{ backgroundImage: `url(${product?.images?.[0].url})` }}
        >
          {!product?.images?.[0].url && <ImagePlaceholderIcon size={12} />}
        </div>
        <div>
          <div className="mt-base flex items-center justify-between">
            <p className="inter-small-regular text-grey-90 font-semibold line-clamp-1 mr-3">
              {product?.title}
            </p>
            <p className="inter-small-regular text-grey-90 font-semibold line-clamp-1">
              {price ? `$${price}` : "-"}
            </p>
          </div>
        </div>
        {/* <div className="flex justify-center mt-4">
          
        </div> */}
      </div>
      <div className="absolute top-[-15px] right-[-15px]">
        <Button variant="nuclear" size="small" onClick={remove}>
          <CrossIcon size={18} />
        </Button>
      </div>
    </div>
  );
};

export default AdditionalHardwares;
