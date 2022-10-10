import { useAdminCancelOrder } from "@medusa-react";
import { getErrorMessage } from "../utils/error-messages";
import useImperativeDialog from "./use-imperative-dialog";
import useNotification from "./use-notification";

export const useQuotationActions = (quotation: unknown) => {
  const cancelOrder = useAdminCancelOrder((quotation as { id: string }).id!);
  const notification = useNotification();
  const dialog = useImperativeDialog();

  return {
    handleDeleteOrder: async () => {
      const shouldDelete = await dialog({
        heading: "Cancel order",
        text: "Are you sure you want to cancel the order?",
      });

      if (!shouldDelete) {
        return;
      }

      return cancelOrder.mutate(undefined, {
        onSuccess: () =>
          notification("Success", "Successfully canceled order", "success"),
        onError: (err) => notification("Error", getErrorMessage(err), "error"),
      });
    },
  };
};
