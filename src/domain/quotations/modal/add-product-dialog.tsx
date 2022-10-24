import { useAdminProducts } from "@medusa-react";
import { Product } from "@medusa-types";
import { Region } from "@medusajs/medusa";
import * as RadixPopover from "@radix-ui/react-popover";
import clsx from "clsx";
import React, { useCallback, useEffect, useState } from "react";
import Spinner from "src/components/atoms/spinner";
import Button from "src/components/fundamentals/button";
import TableSearch from "src/components/molecules/table/table-search";
import { useDebounce } from "src/hooks/use-debounce";
import { formatAmountWithSymbol } from "src/utils/prices";

type Props = {
  onClose: () => void;
  open: boolean;
  handleSetProduct: (product: Product) => void;
  region: Region;
};

interface IProduct extends Product {
  price: number;
}

const AddProductDialog = ({
  open,
  onClose,
  handleSetProduct,
  region,
}: Props) => {
  const [productList, setProductList] = useState<IProduct[]>([]);
  const [query, setQuery] = useState<string>("");
  const debounceQuery = useDebounce(query, 200);
  const { products, isLoading } = useAdminProducts({
    q: debounceQuery,
    offset: 0,
    limit: 50,
    fields: "id,title,type,thumbnail,status,handle,description,updated_at",
  });

  const handleAdd = useCallback(
    (product: Product) => {
      handleSetProduct(product);
    },
    [handleSetProduct]
  );

  useEffect(() => {
    if (products) {
      const list = [...products]
        .map((item) => {
          return {
            ...item,
            price:
              (item as Product).prices.find(
                (item) => item?.region_id === region?.id
              )?.price || 0,
          };
        })
        .filter((item) => item.price);

      setProductList(list as IProduct[]);
    }
  }, [products, region?.id]);

  const renderBody = useCallback(() => {
    if (isLoading) {
      return (
        <div className="w-full h-10 flex items-center justify-center">
          <Spinner size={"large"} variant={"secondary"} />
        </div>
      );
    }

    if (!productList?.length) {
      return <div className="text-center w-full">Product does not exist</div>;
    }

    return productList?.map((item) => (
      <div
        className={clsx(
          "px-base py-xsmall group hover:bg-grey-5 rounded-rounded flex items-center justify-between border border-gray-30 mt-4",
          "min-w-[500px]"
        )}
      >
        <div className="flex items-center gap-x-large">
          <div className="w-16 h-16 flex items-center justify-center">
            <img
              src={item.thumbnail}
              className="max-w-[64px] max-h-[64px] rounded-rounded"
            />
          </div>
          <div className="flex flex-col inter-small-regular text-left">
            <p>{item.title}</p>
            <p className="text-grey-50">{item.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-x-base">
          <span>
            {formatAmountWithSymbol({
              amount: item.price,
              currency: region?.currency_code || "",
              digits: 2,
              tax: region?.tax_rate,
            })}
          </span>
          <Button variant="primary" onClick={() => handleAdd(item)}>
            Add
          </Button>
        </div>
      </div>
    ));
  }, [
    handleAdd,
    isLoading,
    productList,
    region?.currency_code,
    region?.tax_rate,
  ]);

  return (
    <RadixPopover.Root open={open} onOpenChange={onClose}>
      <RadixPopover.Trigger className="w-full visible"></RadixPopover.Trigger>
      <RadixPopover.Content
        side="bottom"
        align="center"
        alignOffset={-8}
        sideOffset={20}
        className="w-full bg-grey-0 shadow-dropdown rounded-rounded p-8"
      >
        <TableSearch
          placeholder="Search product... "
          searchValue={query}
          onSearch={setQuery}
          className="w-full !border-violet-60 focus-within:!w-full"
        />
        <div
          className={clsx(
            "inter-small-regular text-grey-50 mt-6 w-full",
            "max-h-[300px] overflow-y-auto scroll-smooth scrollbar-thin overflow-x-hidden"
          )}
        >
          {renderBody()}
        </div>
        <div className="flex flex-col items-center gap-y-base"></div>
      </RadixPopover.Content>
    </RadixPopover.Root>
  );
};

export default AddProductDialog;
