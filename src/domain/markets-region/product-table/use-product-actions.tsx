import { useAdminRegionDeleteProduct } from "@medusa-react";
import * as React from "react";
import useNotification from "src/hooks/use-notification";
import { getErrorMessage } from "src/utils/error-messages";
import useImperativeDialog from "../../../hooks/use-imperative-dialog";

const useProductActions = (id?: string) => {
  const dialog = useImperativeDialog();
  const notification = useNotification();
  const deleteProduct = useAdminRegionDeleteProduct(id!);

  const handleDelete = React.useCallback(
    async (id_product: string, price: number) => {
      const shouldDelete = await dialog({
        heading: "Remove Product",
        text: "Are you sure you want to remove this product?",
      });
      if (shouldDelete) {
        deleteProduct.mutate(
          {
            product_id: id_product,
            payload: {
              price,
            },
          },
          {
            onSuccess: () => {
              notification(
                "Removed",
                "Successfully removed product",
                "success"
              );
            },
            onError: (error) => {
              notification("Error", getErrorMessage(error), "error");
            },
          }
        );
      }
    },
    [deleteProduct, dialog, notification]
  );
  return {
    handleDelete,
    handleAdd: async (id_product: string, price: number) => {
      deleteProduct.mutate(
        {
          product_id: id_product,
          payload: {
            price,
          },
        },
        {
          onSuccess: () => {
            notification("Added", "Successfully added product", "success");
          },
          onError: (error) => {
            notification("Error", getErrorMessage(error), "error");
          },
        }
      );
    },
  };
};

export default useProductActions;
