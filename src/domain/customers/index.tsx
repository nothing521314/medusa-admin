import { RouteComponentProps, Router } from "@reach/router";
import React, { useState } from "react";

import Button from "../../components/fundamentals/button";
import BodyCard from "../../components/organisms/body-card";
import CustomerTable from "../../components/templates/customer-table";
import CreateCustomerModal from "./create";
import Details from "./details/index";
import CustomerGroups from "./groups";
import CustomersPageTableHeader from "./header";

const CustomerIndex: React.FC<RouteComponentProps> = () => {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div>
      <div className="flex justify-end m-3">
        <Button
          variant="primary"
          className="min-w-[100px]"
          onClick={() => setShowCreate(true)}
        >
          Create Customer
        </Button>
        {showCreate && (
          <CreateCustomerModal handleClose={() => setShowCreate(false)} />
        )}
      </div>
      <div className="flex flex-col grow h-full">
        <div className="w-full flex flex-col grow">
          <BodyCard
            customHeader={<CustomersPageTableHeader activeView="customers" />}
          >
            <CustomerTable />
          </BodyCard>
        </div>
      </div>
    </div>
  );
};

const Customers = () => {
  return (
    <Router>
      <CustomerIndex path="/" />
      <CustomerGroups path="/groups/*" />
      <Details path=":id" />
    </Router>
  );
};

export default Customers;
