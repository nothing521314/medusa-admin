import { Region, User } from "@medusa-types";
import React, { useEffect, useReducer } from "react";
import { KEY } from "src/constants/misc";
import { getCookie } from "src/utils/getCookie";
import { setCookieRegion } from "src/utils/setCookieResion";
import { adminUserKeys } from "../../medusa-react";
import Medusa from "../services/api";
import { queryClient } from "../services/config";

interface IAccountState extends User {
  sale_man_state?: User;
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
  sale_man_state: undefined,
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
      // if (!isAdmin) {
      const regionOld = getCookie(KEY.ACTIVE_REGION);
      setCookieRegion(regionOld || res.regions?.[0]?.id);
      // } else {
      //   setCookieRegion("");
      // }
      return {
        ...state,
        isLoggedIn: true,
        id: res.id!,
        email: res.email,
        name: res?.name,
        role: res?.role,
        isAdmin,
        regions: res?.regions,
        sale_man_state: res,
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
      setCookieRegion(action.payload.id);

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

  useEffect(() => {
    const regionSelected = state.regions.filter(
      (v) => v.id === getCookie(KEY.ACTIVE_REGION)
    )?.[0];
    if (regionSelected) {
      dispatch({ type: "selectRegion", payload: regionSelected });
    }
  }, [state.regions]);

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
