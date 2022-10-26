import { Region } from "@medusa-types";
import React from "react";
import { useAdminRegions } from "../../medusa-react";

export const defaultFeatureFlagContext: {
  regions: Region[];
} = {
  regions: [],
};

export const RegionsContext = React.createContext(defaultFeatureFlagContext);

export const RegionProvider = ({ children }) => {
  const { regions, isFetching } = useAdminRegions();

  return (
    <RegionsContext.Provider value={{ regions: regions ?? [] }}>
      {children}
    </RegionsContext.Provider>
  );
};
