import { useAdminDeleteCustomer } from "@medusa-react"
import { Customer } from "@medusajs/medusa"
import { navigate } from "gatsby"
import * as React from "react"
import useImperativeDialog from "../../../hooks/use-imperative-dialog"
import EditIcon from "../../fundamentals/icons/edit-icon"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import { ActionType } from "../../molecules/actionables"

const useCustomerActions = (cus: Customer) => {
  const dialog = useImperativeDialog()
  const deleteProduct = useAdminDeleteCustomer()

  const handleDelete = async () => {
    const shouldDelete = await dialog({
      heading: "Delete Product",
      text: "Are you sure you want to delete this product?",
    })

    if (shouldDelete) {
      deleteProduct.mutate(cus.id)
    }
  }

  const getActions = (): ActionType[] => [
    {
      label: "Edit",
      onClick: () => navigate(`/a/customers/${cus.id}`),
      icon: <EditIcon size={20} />,
    },

    {
      label: "Delete",
      variant: "danger",
      onClick: handleDelete,
      icon: <TrashIcon size={20} />,
    },
  ]

  return {
    getActions,
  }
}

export default useCustomerActions
