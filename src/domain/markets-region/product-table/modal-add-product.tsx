import { useAdminProducts } from "@medusa-react";
import { Product } from "@medusa-types";
import clsx from "clsx";
import React, { useCallback, useEffect, useState } from "react";
import Spinner from "src/components/atoms/spinner";
import Button from "src/components/fundamentals/button";
import Modal from "src/components/molecules/modal";
import TableSearch from "src/components/molecules/table/table-search";
import { useDebounce } from "src/hooks/use-debounce";

type Props = {
  onClose: () => void;
  open: boolean;
  listAdded: Product[];
  onAdd?: (customer: Product) => void;
};

const ModalAddProduct = ({ open, onClose, listAdded, onAdd }: Props) => {
  const [productList, setProductList] = useState<Product[]>([]);
  const [query, setQuery] = useState<string>("");
  const debounceQuery = useDebounce(query, 200);
  const { products, isLoading, isSuccess } = useAdminProducts({
    q: debounceQuery,
    offset: 0,
    limit: 50,
  });

  console.log("products", products);

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
            // regions={}
            listAdded={listAdded}
            onAdd={() => onAdd?.(item)}
          />
        ))}
      </div>
    );
  }, [productList, isLoading, listAdded, onAdd]);

  return (
    <Modal handleClose={onClose}>
      <Modal.Body>
        <Modal.Header handleClose={onClose}>
          <h2 className="inter-xlarge-semibold">Salesman</h2>
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
}: // regions,
{
  product: Product;
  listAdded: Product[];
  onAdd: (product: Product) => void;
  // regions: Region;
}) => {
  const isAdded = listAdded.some((v) => {
    return v.id === product.id;
  });
  const price = product.prices?.[0]?.price;

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
        <span> {price ? `$${price}` : "-"}</span>
        <Button
          variant="primary"
          disabled={isAdded}
          onClick={() => onAdd(product)}
        >
          {isAdded ? "Added" : "Add"}
        </Button>
      </div>
    </div>
  );
};
