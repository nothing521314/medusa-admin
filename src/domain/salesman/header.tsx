import React from "react";
import { navigate } from "gatsby";

import TableViewHeader from "../../components/organisms/custom-table-header";

type P = {
  activeView: "salesman" | "groups";
};

/*
 * Shared header component for "salesman" and "customer groups" page
 */
function SalesmanPageTableHeader(props: P) {
  return (
    <TableViewHeader
      setActiveView={(v) => {
        navigate(`/a/salesman`);
      }}
      views={["salesman"]}
      activeView={props.activeView}
    />
  );
}

export default SalesmanPageTableHeader;
