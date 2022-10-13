import { Product } from "@medusa-types";
import React, { useCallback, useEffect, useReducer } from "react";
import { Cart } from "../types";

interface CartState {
  cart?: Cart;
}
export interface IProductAdded extends Omit<Product, "beforeInsert"> {
  quantity: number;
}

interface ICartContext extends CartState {
  handleAddToCart?: (product: IProductAdded | Product) => void;
  productList: IProductAdded[];
  handleDeleteFromCart?: (product: IProductAdded) => void;
  totalItems: number;
}

const initialState = {
  productList: [],
  totalItems: 0,
};

export const CartContext = React.createContext<ICartContext>(initialState);

const isBrowser = typeof window !== "undefined";
const CART_LIST = "cart_list";

interface CartProps {
  children: React.ReactNode;
  initialState?: Cart;
}

export const CartProvider = ({ children }: CartProps) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "productionList":
        return {
          ...state,
          productList: action.payload,
        };
      case "totalItems":
        return {
          ...state,
          totalItems: action.payload,
        };
      default:
        return state;
    }
  }, initialState);

  const handleSaveCard = useCallback((cart: IProductAdded[]) => {
    dispatch({ type: "productionList", payload: [...cart] });
    if (isBrowser) {
      localStorage.setItem(CART_LIST, JSON.stringify(cart));
    }
  }, []);

  const handleAddToCart = useCallback(
    (product?: Product) => {
      if (!product) return;
      const cloneCart = [...state.productList];
      const indexOfProduct = cloneCart.findIndex(
        (item) => item.id === product.id
      );

      if (indexOfProduct !== -1) {
        cloneCart[indexOfProduct] = {
          ...cloneCart[indexOfProduct],
          quantity: cloneCart[indexOfProduct].quantity + 1,
        };
      } else {
        const productAdding: IProductAdded = {
          ...product,
          quantity: 1,
        };
        cloneCart.push(productAdding);
      }

      handleSaveCard(cloneCart);
    },
    [handleSaveCard, state.productList]
  );

  const handleDeleteFromCart = useCallback(
    (product?: IProductAdded) => {
      if (!product) return;

      const cloneCart = [...state.productList];
      const indexOfProduct = cloneCart.findIndex(
        (item) => item.id === product.id
      );

      if (product.quantity > 1) {
        cloneCart[indexOfProduct] = {
          ...product,
          quantity: product.quantity - 1,
        };
      } else {
        cloneCart.splice(indexOfProduct, 1);
      }

      handleSaveCard(cloneCart);
    },
    [handleSaveCard, state.productList]
  );

  useEffect(() => {
    let total = 0;
    if (state.productList) {
      total = state.productList.reduce((sum, i) => sum + i.quantity, 0);
    }
    dispatch({ type: "totalItems", payload: total });
  }, [state.productList]);

  useEffect(() => {
    const storageData = localStorage.getItem(CART_LIST);
    const parseData = storageData ? JSON.parse(storageData) : null;
    if (parseData) {
      handleSaveCard(parseData);
    }
  }, [handleSaveCard]);

  return (
    <CartContext.Provider
      value={{
        ...state,
        handleAddToCart,
        handleDeleteFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
