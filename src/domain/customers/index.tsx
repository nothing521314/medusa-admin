import { RouteComponentProps, Router } from "@reach/router"
import React, { useState } from "react"

import BodyCard from "../../components/organisms/body-card"
import CustomerTable from "../../components/templates/customer-table"
import CustomerGroups from "./groups"
import Details from "./details/index"
import CustomersPageTableHeader from "./header"
import CreateCustomerModal from "./details/create"
import Button from "../../components/fundamentals/button"

const CustomerIndex: React.FC<RouteComponentProps> = () => {
  const [showCreate, setShowCreate] = useState(false)

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
  )
}

const Customers = () => {
  return (
    <Router>
      <CustomerIndex path="/" />
      <CustomerGroups path="/groups/*" />
      <Details path=":id" />
    </Router>
  )
}

export default Customers
