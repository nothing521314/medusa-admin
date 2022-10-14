import { useAdminDeleteUser } from "@medusa-react";
import { getErrorMessage } from "../utils/error-messages";
import useImperativeDialog from "./use-imperative-dialog";
import useNotification from "./use-notification";

export const useSalesmanActions = (id?: string) => {
  const deleteUser = useAdminDeleteUser(id);
  const notification = useNotification();
  const dialog = useImperativeDialog();

  return {
    handleDelete: async (id: string) => {
      const shouldDelete = await dialog({
        heading: "Delete Salesman",
        text: "Are you sure you want to delete this salesman?",
      });

      if (shouldDelete) {
        deleteUser.mutate(id, {
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
