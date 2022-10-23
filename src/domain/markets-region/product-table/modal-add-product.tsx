import { useAdminProducts } from "@medusa-react";
import { Product, Region } from "@medusa-types";
import clsx from "clsx";
import { AnyNode } from "postcss";
import React, { useCallback, useEffect, useState } from "react";
import Spinner from "src/components/atoms/spinner";
import Button from "src/components/fundamentals/button";
import Modal from "src/components/molecules/modal";
import TableSearch from "src/components/molecules/table/table-search";
import PriceFormInput from "src/domain/products/components/prices-form/price-form-input";
import { useDebounce } from "src/hooks/use-debounce";
import { formatAmountWithSymbol } from "src/utils/prices";

type Props = {
  onClose: () => void;
  open: boolean;
  region: Region;
  listAdded: Product[];
  onAdd?: (customer: Product, amount: number) => void;
};

const ModalAddProduct = ({
  open,
  region,
  onClose,
  listAdded,
  onAdd,
}: Props) => {
  const [productList, setProductList] = useState<Product[]>([]);
  const [query, setQuery] = useState<string>("");
  const debounceQuery = useDebounce(query, 200);
  const { products, isLoading, isSuccess } = useAdminProducts(
    {
      q: debounceQuery,
      offset: 0,
      limit: 50,
    },
    {
      cacheTime: 0,
    }
  );

  useEffect(() => {
    if (products) {
      setProductList(products as Product[]);
    }
  }, [products]);

  const renderBody = useCallback(() => {
    if (isLoading) {
      return (
        <div className="w-full h-10 flex items-center justify-center">
          <Spinner size={"large"} variant={"secondary"} />
        </div>
      );
    }
    if (!productList.length) {
      return (
        <div className="text-center mt-3 w-full">Product does not exist.</div>
      );
    }

    return (
      <div className="flex flex-col gap-y-2xsmall">
        {productList.map((item) => (
          <ProductItem
            key={item.id}
            product={item}
            region={region}
            listAdded={listAdded}
            onAdd={onAdd}
          />
        ))}
      </div>
    );
  }, [isLoading, productList, region, listAdded, onAdd]);

  return (
    <Modal handleClose={onClose}>
      <Modal.Body>
        <Modal.Header handleClose={onClose}>
          <h2 className="inter-xlarge-semibold">Product</h2>
        </Modal.Header>
        <Modal.Content>
          <TableSearch
            placeholder="Search customer... "
            searchValue={query}
            onSearch={setQuery}
            className="w-full !border-violet-60 focus-within:!w-full mb-4"
          />
          {isSuccess ? (
            renderBody()
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
              onClick={onClose}
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

export default ModalAddProduct;

const ProductItem = ({
  product,
  onAdd,
  listAdded,
  region,
}: {
  product: Product;
  listAdded: Product[];
  onAdd?: (customer: Product, amount: number) => void;
  region: Region;
}) => {
  const [value, setValue] = useState();
  const [error, setError] = useState<AnyNode>();
  const isAdded = listAdded.some((v) => {
    return v.id === product.id;
  });
  const price =
    product.prices?.find((reg) => reg?.region_id === region.id)?.price ?? 0;

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
            src={product?.images?.[0].url}
            className="max-w-[64px] max-h-[64px] rounded-rounded"
          />
        </div>
        <div className="flex flex-col inter-small-regular text-left">
          <p>{product.title}</p>
          <p className="text-grey-50">{product.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-x-base">
        <span>
          {price ? (
            formatAmountWithSymbol({
              amount: price,
              currency: region?.currency_code || "usd",
              digits: 2,
              tax: region?.tax_rate || 0,
            })
          ) : (
            <PriceFormInput
              name="amount"
              errors={error}
              className="w-[130px]"
              onChange={(amount) => {
                setValue(amount);
              }}
              amount={value}
              currencyCode={region?.currency_code || "usd"}
            />
          )}
        </span>
        <Button
          variant="primary"
          className="w-[80px]"
          size="small"
          disabled={isAdded}
          onClick={() => {
            if (!value || value === 0) {
              setError({ amount: "Error" } as any);
            } else {
              onAdd?.(product, value);
            }
          }}
        >
          {isAdded ? "Added" : "Add"}
        </Button>
      </div>
    </div>
  );
};
