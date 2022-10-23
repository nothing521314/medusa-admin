import React from "react";
import { navigate } from "gatsby";

import TableViewHeader from "../../components/organisms/custom-table-header";

type P = {
  activeView: "Markets Region";
};

/*
 * Shared header component for "salesman" and "customer groups" page
 */
function SalesmanPageTableHeader(props: P) {
  return (
    <TableViewHeader
      setActiveView={() => {
        navigate("/a/markets-region");
      }}
      views={["Markets Region"]}
      activeView={props.activeView}
    />
  );
}

export default SalesmanPageTableHeader;
