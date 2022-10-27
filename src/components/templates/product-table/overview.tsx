import { CartContext } from "@medusa-react";
import { Hardware, Product } from "@medusa-types";
import clsx from "clsx";
import { Link, navigate } from "gatsby";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import CartPlusIcon from "src/components/fundamentals/icons/cart-plus-icon";
import ImagePlaceholderIcon from "src/components/fundamentals/icons/image-placeholder-icon";
import { AccountContext } from "src/context/account";
import SelectAdditionalHardwareModal from "src/domain/products/components/select-addtional-hardware-modal";
import { formatAmountWithSymbol } from "src/utils/prices";
import Button from "../../fundamentals/button";
import ListIcon from "../../fundamentals/icons/list-icon";
import MoreHorizontalIcon from "../../fundamentals/icons/more-horizontal-icon";
import TileIcon from "../../fundamentals/icons/tile-icon";
import Actionables from "../../molecules/actionables";
import { NoRecordTable } from "../no-record-table";
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
      {products.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 medium:grid-cols-3 large:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductTile product={product} />
          ))}
        </div>
      ) : (
        <NoRecordTable />
      )}
    </>
  );
};

const ProductTile = ({ product }: { product: Product }) => {
  const {
    getActions,
    handleOpenHardwareModal,
    isOpenHardwareModal,
    handleCloseHardwareModal,
  } = useProductActions(product);
  const { selectedRegion } = useContext(AccountContext);
  const { handleAddToCart, handleAddHarwareToCart, productList } = useContext(
    CartContext
  );
  const [hardwares, setHardWares] = useState<Hardware[]>([]);

  const price = useMemo(() => {
    return (
      product.prices?.find((reg) => reg.region_id === selectedRegion?.id)
        ?.price || 0
    );
  }, [product.prices, selectedRegion?.id]);

  const handleClickAddToCartBtn = useCallback(() => {
    // if (product?.additional_hardwares?.length) {
    //   handleOpenHardwareModal();
    // } else {
    //   if (!product || !handleAddToCart) return;
    //   handleAddToCart({ ...product });
    // }
    navigate(`/a/products/${product?.id}`);
  }, [product]);

  const handleSubmitAdd = useCallback(
    (hw) => {
      handleAddToCart && handleAddToCart(product);
      setHardWares(hw);
    },
    [handleAddToCart, product]
  );

  useEffect(() => {
    if (!hardwares.length) return;
    try {
      handleAddHarwareToCart && handleAddHarwareToCart(product.id!, hardwares);
      setHardWares([]);
    } catch (error) {
      console.log(error);
    }
  }, [handleAddHarwareToCart, hardwares, product.id, productList.length]);

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
            onClick={handleClickAddToCartBtn}
          >
            <CartPlusIcon size={20} />
            Add To Cart
          </Button>
        </div>
      </div>
      {isOpenHardwareModal && (
        <SelectAdditionalHardwareModal
          id={product.id!}
          isOpen={isOpenHardwareModal}
          handleClose={handleCloseHardwareModal}
          handleSubmit={handleSubmitAdd}
        />
      )}
    </div>
  );
};

export default ProductOverview;
