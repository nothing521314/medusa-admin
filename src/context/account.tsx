import { Region, User } from "@medusa-types";
import React, { useReducer } from "react";
import { setCookieRegion } from "src/utils/setCookieResion";
import { adminUserKeys } from "../../medusa-react";
import Medusa from "../services/api";
import { queryClient } from "../services/config";

interface IAccountState extends User {
  isLoggedIn: boolean;
  id: string;
  regions: Region[];
  selectedRegion?: Region;
  isAdmin: boolean;
  session?: () => void;
  handleUpdateUser?: (id?: string, user?: string) => void;
  handleLogout?: (details?: unknown) => void;
  handleLogin?: (details?: unknown) => void;
  handleSelectRegion?: (region: Region) => void;
}

export const defaultAccountContext: IAccountState = {
  isLoggedIn: false,
  id: "",
  name: "",
  role: "sale_man",
  isAdmin: false,
  phone: "",
  email: "",
  regions: [],
  selectedRegion: undefined,
};

export const AccountContext = React.createContext<IAccountState>(
  defaultAccountContext
);

const reducer = (state: IAccountState, action): IAccountState => {
  const res = action.payload as User;
  const isAdmin = res?.role === "admin";

  switch (action.type) {
    case "userAuthenticated":
      console.log(action.payload);

      if (!isAdmin) {
        setCookieRegion(res.regions?.[0]?.id);
      }
      return {
        ...state,
        isLoggedIn: true,
        id: res.id!,
        email: res.email,
        name: res?.name,
        role: res?.role,
        isAdmin,
        regions: res?.regions,
      };
    case "updateUser":
      return {
        ...state,
        ...action.payload,
      };
    case "userLoggedOut":
      setCookieRegion("");

      return defaultAccountContext;
    case "userLoggedIn":
      return {
        ...state,
        isLoggedIn: true,
        id: action.payload.id,
        email: action.payload.email,
        name: action.payload?.name,
      };
    case "selectRegion":
      setCookieRegion(action.payload);

      return {
        ...state,
        selectedRegion: action.payload,
      };
    default:
      return state;
  }
};

export const AccountProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, defaultAccountContext);

  return (
    <AccountContext.Provider
      value={{
        ...state,
        session: () => {
          return Medusa.auth.session().then(({ data }) => {
            dispatch({ type: "userAuthenticated", payload: data.user });
            return data;
          });
        },

        handleUpdateUser: (id, user) => {
          return Medusa.users.update(id, user).then(({ data }) => {
            queryClient.invalidateQueries(adminUserKeys.all);
            dispatch({ type: "updateUser", payload: data.user });
          });
        },

        handleLogout: (details) => {
          return Medusa.auth.deauthenticate(details).then(() => {
            dispatch({ type: "userLoggedOut" });
            return null;
          });
        },

        handleLogin: (details) => {
          return Medusa.auth.authenticate(details).then(({ data }) => {
            dispatch({ type: "userLoggedIn", payload: data.user });
            return data;
          });
        },

        handleSelectRegion: (region: Region) => {
          return dispatch({ type: "selectRegion", payload: region });
        },
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};
