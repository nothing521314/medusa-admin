import { adminUserKeys } from "../../medusa-react";
import React, { useReducer } from "react";
import Medusa from "../services/api";
import { queryClient } from "../services/config";
import { Region } from "@medusa-types";

interface IAccountState {
  isLoggedIn: boolean;
  id: string;
  name: string;
  email: string;
  regions: Region[];
  selectedRegion?: Region;
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
  email: "",
  regions: [],
  selectedRegion: undefined,
};

export const AccountContext = React.createContext<IAccountState>(
  defaultAccountContext
);

const reducer = (state: IAccountState, action): IAccountState => {
  switch (action.type) {
    case "userAuthenticated":
      console.log(action.payload);
      return {
        ...state,
        isLoggedIn: true,
        id: action.payload.id,
        email: action.payload.email,
        name: action.payload?.name,
        regions: action.payload?.regions,
      };
    case "updateUser":
      return {
        ...state,
        ...action.payload,
      };
    case "userLoggedOut":
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
