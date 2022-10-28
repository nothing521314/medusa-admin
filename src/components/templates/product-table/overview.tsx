import { Product } from "@medusa-types";
import clsx from "clsx";
import { Link } from "gatsby";
import React, { useContext, useMemo } from "react";
import CartPlusIcon from "src/components/fundamentals/icons/cart-plus-icon";
import ImagePlaceholderIcon from "src/components/fundamentals/icons/image-placeholder-icon";
import { AccountContext } from "src/context/account";
import { formatAmountWithSymbol } from "src/utils/prices";
import Button from "../../fundamentals/button";
import ListIcon from "../../fundamentals/icons/list-icon";
import MoreHorizontalIcon from "../../fundamentals/icons/more-horizontal-icon";
import TileIcon from "../../fundamentals/icons/tile-icon";
import Actionables, { ActionType } from "../../molecules/actionables";
import { NoRecordTable } from "../no-record-table";

type ProductOverviewProps = {
  products?: Product[];
  toggleListView: () => void;
  getActions: (mode: string, prodId: string) => ActionType[];
  handleClickAddToCartBtn: (prodId: string) => void;
};

const ProductOverview = ({
  products,
  toggleListView,
  getActions,
  handleClickAddToCartBtn,
}: ProductOverviewProps) => {
  if (!products) {
    return null;
  }

  return (
    <>
      <div className="flex justify-end border-t border-b border-grey-20 py-2.5 pr-xlarge">
        <div className="inter-small-semibold text-grey-50 flex justify-self-end">
          <span
            onClick={toggleListView}
            className={clsx(
              "hover:bg-grey-5 cursor-pointer rounded p-0.5 text-grey-40"
            )}
          >
            <ListIcon size={20} />
          </span>
          <span
            className={clsx(
              "hover:bg-grey-5 cursor-pointer rounded p-0.5 text-grey-90"
            )}
          >
            <TileIcon size={20} />
          </span>
        </div>
      </div>
      {products.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 medium:grid-cols-3 large:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductTile
              product={product}
              getActions={getActions}
              handleClickAddToCartBtn={handleClickAddToCartBtn}
            />
          ))}
        </div>
      ) : (
        <NoRecordTable />
      )}
    </>
  );
};

const ProductTile = ({
  product,
  getActions,
  handleClickAddToCartBtn,
}: {
  product: Product;
  getActions: (mode: string, prodId: string) => ActionType[];
  handleClickAddToCartBtn: (prodId: string) => void;
}) => {
  const { selectedRegion } = useContext(AccountContext);

  const price = useMemo(() => {
    return (
      product.prices?.find((reg) => reg.region_id === selectedRegion?.id)
        ?.price || 0
    );
  }, [product.prices, selectedRegion?.id]);

  return (
    <div className="p-base group rounded-rounded hover:bg-grey-5 flex-col border border-grey-30">
      <div className="relative">
        <div
          className={clsx(
            "rounded-base inline-block absolute top-2 right-2 z-10"
          )}
        >
          <Actionables
            actions={getActions("grid", product.id!)}
            customTrigger={
              <Button
                variant="ghost"
                size="small"
                className="w-xlarge h-xlarge hidden-actions group-hover:opacity-100 focus-within:opacity-100 opacity-0 bg-grey-0"
              >
                <MoreHorizontalIcon size={20} />
              </Button>
            }
          />
        </div>
        <Link to={`${product.id}`}>
          <div
            className={clsx(
              "min-h-[230px] flex items-center justify-center bg-grey-5 rounded-rounded relative",
              "bg-cover bg-no-repeat bg-center"
            )}
            style={{ backgroundImage: `url(${product.images?.[0]?.url})` }}
          >
            {!product.images?.[0]?.url && <ImagePlaceholderIcon size={12} />}
          </div>

          <div>
            <div className="mt-base flex items-center justify-between">
              <p className="inter-small-regular text-grey-90 font-semibold line-clamp-1 mr-3 max-w-[60%]">
                {product.title}
              </p>
              <p className="inter-small-regular text-grey-90 font-semibold line-clamp-1 max-w-[40%]">
                {price
                  ? formatAmountWithSymbol({
                      amount: price,
                      currency: selectedRegion?.currency_code || "usd",
                      digits: 2,
                      tax: selectedRegion?.tax_rate || 0,
                    })
                  : "-"}
              </p>
            </div>
          </div>
        </Link>
        <div className="flex justify-center mt-4">
          <Button
            variant="secondary"
            size="small"
            onClick={() => handleClickAddToCartBtn(product.id!)}
          >
            <CartPlusIcon size={20} />
            Add To Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductOverview;
