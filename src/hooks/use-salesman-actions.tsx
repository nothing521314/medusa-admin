import { useAdminDeleteCustomer } from "@medusa-react";
import { getErrorMessage } from "../utils/error-messages";
import useImperativeDialog from "./use-imperative-dialog";
import useNotification from "./use-notification";

export const useSalesmanActions = () => {
  const deleteProduct = useAdminDeleteCustomer();
  const notification = useNotification();
  const dialog = useImperativeDialog();

  return {
    handleDelete: async (id: string) => {
      const shouldDelete = await dialog({
        heading: "Delete Salesman",
        text: "Are you sure you want to delete this salesman?",
      });

      if (shouldDelete) {
        deleteProduct.mutate(id, {
          onSuccess: () => {
            notification("Deleted", "Successfully deleted salesman", "success");
          },
          onError: (err) => {
            notification("Error", getErrorMessage(err), "error");
          },
        });
      }
    },
  };
};
