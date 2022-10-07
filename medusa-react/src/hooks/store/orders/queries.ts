import { queryKeysFactory } from "../../utils/index"
import { StoreOrdersRes, StoreGetOrdersParams } from "@medusajs/medusa"
import { useQuery } from "react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { Response } from "../../../../../medusa-js"

const ORDERS_QUERY_KEY = `orders` as const

export const orderKeys = {
  ...queryKeysFactory<typeof ORDERS_QUERY_KEY, StoreGetOrdersParams>(
    ORDERS_QUERY_KEY
  ),
  cart: (cartId: string) => [...orderKeys.details(), "cart", cartId] as const,
}

type OrderQueryKey = typeof orderKeys

export const useOrder = (
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<StoreOrdersRes>,
    Error,
    ReturnType<OrderQueryKey["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    orderKeys.detail(id),
    () => client.orders.retrieve(id),
    options
  )

  return { ...data, ...rest } as const
}

export const useCartOrder = (
  cartId: string,
  options?: UseQueryOptionsWrapper<
    Response<StoreOrdersRes>,
    Error,
    ReturnType<OrderQueryKey["cart"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    orderKeys.cart(cartId),
    () => client.orders.retrieveByCartId(cartId),
    options
  )

  return { ...data, ...rest } as const
}

export const useOrders = (
  query: StoreGetOrdersParams,
  options?: UseQueryOptionsWrapper<
    Response<StoreOrdersRes>,
    Error,
    ReturnType<OrderQueryKey["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    orderKeys.list(query),
    () => client.orders.lookupOrder(query),
    options
  )

  return { ...data, ...rest } as const
}
