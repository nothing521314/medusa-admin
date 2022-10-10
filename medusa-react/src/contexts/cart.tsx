import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  useAddShippingMethodToCart,
  useCompleteCart,
  useCreateCart,
  useSetPaymentSession,
  useUpdateCart,
  useCreatePaymentSession,
  useGetCart,
} from "../hooks/store";
import { Cart } from "../types";

interface CartState {
  cart?: Cart;
}

interface ICartContext extends CartState {
  setCart: (cart: Cart) => void;
  pay: ReturnType<typeof useSetPaymentSession>;
  createCart: ReturnType<typeof useCreateCart>;
  startCheckout: ReturnType<typeof useCreatePaymentSession>;
  completeCheckout: ReturnType<typeof useCompleteCart>;
  updateCart: ReturnType<typeof useUpdateCart>;
  addShippingMethod: ReturnType<typeof useAddShippingMethodToCart>;
  totalItems: number;
}

const CartContext = React.createContext<ICartContext | null>(null);

const isBrowser = typeof window !== "undefined";
const CART_ID = "cart_id";

export const useCart = () => {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProps {
  children: React.ReactNode;
  initialState?: Cart;
}

const defaultInitialState = {
  id: "",
  items: [] as any,
} as Cart;

export const CartProvider = ({
  children,
  initialState = defaultInitialState,
}: CartProps) => {
  const [cart, setCart] = useState<Cart>(initialState);

  const handleSaveCard = useCallback((cart) => {
    if (isBrowser) {
      localStorage.setItem(CART_ID, cart?.id);
    }
  }, []);

  const createCart = useCreateCart({
    onSuccess: ({ cart }) => {
      handleSaveCard(cart);
      setCart(cart);
    },
  });

  const updateCart = useUpdateCart(cart?.id, {
    onSuccess: ({ cart }) => setCart(cart),
  });

  const addShippingMethod = useAddShippingMethodToCart(cart?.id, {
    onSuccess: ({ cart }) => setCart(cart),
  });

  const startCheckout = useCreatePaymentSession(cart?.id, {
    onSuccess: ({ cart }) => setCart(cart),
  });

  const pay = useSetPaymentSession(cart?.id, {
    onSuccess: ({ cart }) => {
      setCart(cart);
    },
  });

  const completeCheckout = useCompleteCart(cart?.id);

  const totalItems = cart?.items
    .map((i) => i.quantity)
    .reduce((acc, curr) => acc + curr, 0);

  const existingCartId = useMemo(() => {
    const storage = isBrowser ? localStorage.getItem(CART_ID) : null;
    if (!storage) {
      return "";
    }
    return storage;
  }, []);

  const { cart: existedCart, isError } = useGetCart(existingCartId);

  useEffect(() => {
    if (isError) {
      handleSaveCard(null);
    } else {
      if (!existedCart?.completed_at) {
        setCart(
          existedCart as Omit<Cart, "refundable_amount" | "refunded_total">
        );
        handleSaveCard(existedCart);
      }
    }
  }, [existedCart, handleSaveCard, isError]);

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        createCart,
        pay,
        startCheckout,
        completeCheckout,
        updateCart,
        addShippingMethod,
        totalItems: totalItems || 0,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
