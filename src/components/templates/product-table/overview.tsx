import { Product } from "@medusa-types";
import clsx from "clsx";
import { Link } from "gatsby";
import * as React from "react";
import CartPlusIcon from "src/components/fundamentals/icons/cart-plus-icon";
import ImagePlaceholderIcon from "src/components/fundamentals/icons/image-placeholder-icon";
import { getProductStatusVariant } from "../../../utils/product-status-variant";
import Button from "../../fundamentals/button";
import ListIcon from "../../fundamentals/icons/list-icon";
import MoreHorizontalIcon from "../../fundamentals/icons/more-horizontal-icon";
import TileIcon from "../../fundamentals/icons/tile-icon";
import StatusIndicator from "../../fundamentals/status-indicator";
import Actionables from "../../molecules/actionables";
import useProductActions from "./use-product-actions";

type ProductOverviewProps = {
  products?: Product[];
  toggleListView: () => void;
};

const ProductOverview = ({
  products,
  toggleListView,
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
      <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(250px,5fr))] gap-4">
        {products.map((product) => (
          <ProductTile product={product} />
        ))}
      </div>
    </>
  );
};

const ProductTile = ({ product }: { product: Product }) => {
  const { getActions } = useProductActions(product);
  const price = product.prices?.[0]?.price;

  return (
    <div className="p-base group rounded-rounded hover:bg-grey-5 flex-col border border-grey-30">
      <div className="relative">
        <div
          className={clsx(
            "rounded-base inline-block absolute top-2 right-2 z-10"
          )}
        >
          <Actionables
            actions={getActions()}
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
            style={{ backgroundImage: `url(${product.thumbnail})` }}
          >
            {/* {product.thumbnail ? (
              <div
                className={clsx(
                  "bg-grey-40/80 w-full h-full absolute top-0 flex items-center justify-center rounded-rounded",
                  "invisible group-hover:visible transition-visibility duration-75"
                )}
              >
                <Button variant="secondary" className="" size="small">
                  View Details
                </Button>
              </div>
            ) : (
              <ImagePlaceholder />
            )} */}
            {!product.thumbnail && <ImagePlaceholderIcon size={12} />}
          </div>

          <div>
            <div className="mt-base flex items-center justify-between">
              <p className="inter-small-regular text-grey-90 font-semibold line-clamp-1 mr-3">
                {product.title}
              </p>
              <p className="inter-small-regular text-grey-90 font-semibold line-clamp-1">
                {price ? `$${price}` : "-"}
              </p>
              {/* <StatusIndicator
                variant={getProductStatusVariant(product.status)}
                className="shrink-0"
              /> */}
            </div>
            <span
              className={clsx(
                "mt-3 inter-small-regular text-grey-50 line-clamp-1",
                "text-center max-w-full text-ellipsis whitespace-nowrap overflow-hidden"
              )}
            >
              {product.description ?? "-"}
            </span>
          </div>
        </Link>
        <div className="flex justify-center mt-4">
          <Button variant="secondary" size="small">
            <CartPlusIcon size={20} />
            Add To Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductOverview;
