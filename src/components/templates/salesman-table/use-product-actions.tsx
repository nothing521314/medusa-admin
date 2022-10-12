import { useAdminDeleteCustomer, useAdminDeleteUser } from "@medusa-react";
import { Customer, User } from "@medusa-types";
import { navigate } from "gatsby";
import * as React from "react";
import useImperativeDialog from "../../../hooks/use-imperative-dialog";
import EditIcon from "../../fundamentals/icons/edit-icon";
import TrashIcon from "../../fundamentals/icons/trash-icon";
import { ActionType } from "../../molecules/actionables";

const useUserActions = ({ id = "", ...user }: User) => {
  const dialog = useImperativeDialog();
  const deleteProduct = useAdminDeleteUser(id);

  const handleDelete = async () => {
    const shouldDelete = await dialog({
      heading: "Delete Product",
      text: "Are you sure you want to delete this product?",
    });

    if (shouldDelete) {
      deleteProduct.mutate();
    }
  };

  const getActions = (): ActionType[] => [
    {
      label: "Edit",
      onClick: () => navigate(`/a/customers/${id}`),
      icon: <EditIcon size={20} />,
    },

    {
      label: "Delete",
      variant: "danger",
      onClick: handleDelete,
      icon: <TrashIcon size={20} />,
    },
  ];

  return {
    getActions,
  };
};

export default useUserActions;
