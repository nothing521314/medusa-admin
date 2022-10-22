import { RouteComponentProps, Router } from "@reach/router";
import React from "react";

import BodyCard from "../../components/organisms/body-card";
import RegionTable from "../../components/templates/region-table";
import Details from "./details";
import MarketsRegionTableHeader from "./header";

const MarketsRegion: React.FC<RouteComponentProps> = () => {
  return (
    <div>
      <div className="flex flex-col grow h-full">
        <div className="w-full flex flex-col grow">
          <BodyCard
            customHeader={
              <MarketsRegionTableHeader activeView="Markets Region" />
            }
          >
            <RegionTable />
          </BodyCard>
        </div>
      </div>
    </div>
  );
};

const MarketsRegionRouter = () => {
  return (
    <Router>
      <MarketsRegion path="/" />
      <Details path=":id" />
    </Router>
  );
};

export default MarketsRegionRouter;
