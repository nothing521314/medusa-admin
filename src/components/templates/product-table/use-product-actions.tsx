import { CartContext, useAdminDeleteProduct } from "@medusa-react";
import { Product } from "@medusa-types";
import { navigate } from "gatsby";
import * as React from "react";
import CartPlusIcon from "src/components/fundamentals/icons/cart-plus-icon";
import ViewListIcon from "src/components/fundamentals/icons/view-list-icon";
import { AccountContext } from "src/context/account";
import useNotification from "src/hooks/use-notification";
import useToggleState from "src/hooks/use-toggle-state";
import { getErrorMessage } from "src/utils/error-messages";
import useImperativeDialog from "../../../hooks/use-imperative-dialog";
import TrashIcon from "../../fundamentals/icons/trash-icon";
import { ActionType } from "../../molecules/actionables";

const useProductActions = (product?: Product) => {
  const dialog = useImperativeDialog();
  const notification = useNotification();
  const { isAdmin, selectedRegion } = React.useContext(AccountContext);
  const deleteProduct = useAdminDeleteProduct(product?.id!);
  const { handleAddToCart } = React.useContext(CartContext);

  const {
    open: handleOpenHardwareModal,
    close: handleCloseHardwareModal,
    state: isOpenHardwareModal,
  } = useToggleState(false);

  const listHavePrice = React.useMemo(() => {
    return product?.additional_hardwares?.filter((item) => {
      const price = item?.prices?.find(
        (reg) => reg?.region_id === selectedRegion?.id
      );
      return !!price;
    });
  }, [product?.additional_hardwares, selectedRegion?.id]);

  const handleDelete = React.useCallback(async () => {
    const shouldDelete = await dialog({
      heading: "Delete Product",
      text: "Are you sure you want to delete this product?",
    });
    if (shouldDelete) {
      deleteProduct.mutate(undefined, {
        onSuccess: () => {
          notification("Deleted", "Successfully deleted product", "success");
        },
        onError: (error) => {
          notification("Error", getErrorMessage(error), "error");
        },
      });
    }
  }, [deleteProduct, dialog, notification]);

  const getActions = (mode: "grid" | "table" = "grid"): ActionType[] => {
    const l: ActionType[] = [
      {
        label: "Details",
        onClick: () => navigate(`/a/products/${product?.id}`),
        icon: <ViewListIcon size={20} />,
      },
    ];

    mode === "table" &&
      l.push({
        label: "Add To Cart",
        onClick: () => {
          if (listHavePrice?.length) {
            handleOpenHardwareModal();
          } else {
            if (!product || !handleAddToCart) return;
            handleAddToCart({ ...product });
          }
        },
        icon: <CartPlusIcon size={20} />,
      });

    isAdmin &&
      l.push({
        label: "Delete Product",
        variant: "danger",
        onClick: handleDelete,
        icon: <TrashIcon size={20} />,
      });

    return l;
  };

  return {
    getActions,
    isOpenHardwareModal,
    handleCloseHardwareModal,
    handleOpenHardwareModal,
  };
};

export default useProductActions;
