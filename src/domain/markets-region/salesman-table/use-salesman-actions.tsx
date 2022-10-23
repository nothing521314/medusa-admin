import {
  useAdminDeleteUser,
  useAdminRegionAddSalesman,
  useAdminRegionDeleteSalesman,
} from "@medusa-react";
import useImperativeDialog from "src/hooks/use-imperative-dialog";
import useNotification from "src/hooks/use-notification";
import { getErrorMessage } from "src/utils/error-messages";

export const useSalesmanActions = (id?: string) => {
  const addUser = useAdminRegionAddSalesman(id!);
  const deleteUser = useAdminRegionDeleteSalesman(id!);
  const notification = useNotification();
  const dialog = useImperativeDialog();

  return {
    handleAdd: async (user_id: string) => {
      addUser.mutate(user_id, {
        onSuccess: () => {
          notification("Added", "Successfully added salesman", "success");
        },
        onError: (err) => {
          notification("Error", getErrorMessage(err), "error");
        },
      });
    },
    handleDelete: async (user_id: string) => {
      const shouldDelete = await dialog({
        heading: "Remove Salesman",
        text: "Are you sure you want to remove this salesman?",
      });

      if (shouldDelete) {
        deleteUser.mutate(user_id, {
          onSuccess: () => {
            notification("Removed", "Successfully removed salesman", "success");
          },
          onError: (err) => {
            notification("Error", getErrorMessage(err), "error");
          },
        });
      }
    },
  };
};
