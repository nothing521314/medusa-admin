import { Hardware, Product } from "@medusa-types";
import React, { useCallback, useEffect, useReducer } from "react";
import { SUB_TAB } from "src/domain/quotations";
import { Cart } from "../types";

interface CartState {
  cart?: Cart;
}
export interface IProductAdded extends Omit<Product, "beforeInsert"> {
  child_product?: Hardware[];
  priceItem?: number;
  quantity: number;
}

interface ICartContext extends CartState {
  handleAddToCart?: (product: IProductAdded | Product) => void;
  productList: IProductAdded[];
  handleDeleteFromCart?: (product: IProductAdded) => void;
  totalItems: number;
  handleAddHarwareToCart?: (productId: string, hardware: Hardware[]) => void;
  handleDeleteHarwareToCart?: (productId: string, hardware: Hardware[]) => void;
  handleSetListProduct?: (product: IProductAdded[]) => void;
  handleAddGameOption?: (
    product_id: string,
    hardwareId: string,
    game: string
  ) => void;
  action?: SUB_TAB;
  handleSetAction?: (action?: SUB_TAB) => void;
}

const initialState = {
  productList: [],
  totalItems: 0,
  action: SUB_TAB.MAKE_QUOTATION,
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
      case "action":
        return {
          ...state,
          action: action.payload,
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

  const handleAddHarwareToCart = useCallback(
    (product_id: string, hardwares: Hardware[]) => {
      const cloneCart = [...state.productList];
      const indexOfProduct = cloneCart.findIndex(
        (item) => item.id === product_id
      );

      hardwares.map((hardware) => {
        const i = cloneCart[indexOfProduct].additional_hardwares.findIndex(
          (item) => item.id === hardware.id
        );
        if (i !== -1) {
          cloneCart[indexOfProduct].additional_hardwares[i] = {
            ...hardware,
            quantity: (hardware?.quantity || 0) + 1,
          };
        } else {
          cloneCart[indexOfProduct].additional_hardwares.push({
            ...hardware,
            quantity: 1,
          });
        }
      });

      handleSaveCard(cloneCart);
    },
    [handleSaveCard, state.productList]
  );

  const handleDeleteHarwareToCart = useCallback(
    (product_id: string, hardwares: Hardware[]) => {
      const cloneCart = [...state.productList];
      const indexOfProduct = cloneCart.findIndex(
        (item) => item.id === product_id
      );

      hardwares.map((hardware) => {
        const i = cloneCart[indexOfProduct].additional_hardwares.findIndex(
          (item) => item.id === hardware.id
        );

        if (cloneCart[indexOfProduct].additional_hardwares[i].quantity > 1) {
          cloneCart[indexOfProduct].additional_hardwares[i] = {
            ...cloneCart[indexOfProduct].additional_hardwares[i],
            quantity:
              cloneCart[indexOfProduct].additional_hardwares[i].quantity - 1,
          };
        } else {
          cloneCart[indexOfProduct].additional_hardwares.splice(i, 1);
        }
      });

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
          ...cloneCart[indexOfProduct],
          quantity: product.quantity - 1,
        };
      } else {
        cloneCart.splice(indexOfProduct, 1);
      }

      handleSaveCard(cloneCart);
    },
    [handleSaveCard, state.productList]
  );

  const handleSetListProduct = useCallback((data) => {
    dispatch({ type: "productionList", payload: [...data] });
  }, []);

  const handleSetAction = useCallback((action?: SUB_TAB) => {
    dispatch({ type: "action", payload: action });
  }, []);

  const handleAddGameOption = useCallback(
    (product_id: string, hardwareId: string, game: string) => {
      const cloneCart = [...state.productList];
      const indexOfProduct = cloneCart.findIndex(
        (item) => item.id === product_id
      );

      const indexOfHw = cloneCart[
        indexOfProduct
      ].additional_hardwares.findIndex((hw) => hw.id === hardwareId);
      cloneCart[indexOfProduct].additional_hardwares[indexOfHw] = {
        ...cloneCart[indexOfProduct].additional_hardwares[indexOfHw],
        game,
      };

      handleSaveCard(cloneCart);
    },
    [handleSaveCard, state.productList]
  );

  useEffect(() => {
    let total = 0;
    if (state.productList) {
      const prod = state.productList.map((item) => {
        return {
          total:
            item.quantity +
            (item?.additional_hardwares?.reduce(
              (pre, cur) => pre + cur.quantity,
              0
            ) || 0),
        };
      });
      total = prod.reduce((sum, i) => sum + i.total, 0);
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
        handleAddHarwareToCart,
        handleDeleteHarwareToCart,
        handleSetListProduct,
        handleAddGameOption,
        handleSetAction,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
