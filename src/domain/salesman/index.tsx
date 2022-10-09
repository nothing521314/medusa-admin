import { RouteComponentProps, Router } from "@reach/router"
import React, { useState } from "react"

import BodyCard from "../../components/organisms/body-card"
import CustomerTable from "../../components/templates/customer-table"
import Details from "./details"
import SalesmanPageTableHeader from "./header"
import CreateSalesmanModal from "./create"
import Button from "../../components/fundamentals/button"

const SalesmanIndex: React.FC<RouteComponentProps> = () => {
  const [showCreate, setShowCreate] = useState(false)

  return (
    <div>
      <div className="flex justify-end m-3">
        <Button
          variant="primary"
          className="min-w-[100px]"
          onClick={() => setShowCreate(true)}
        >
          Create Salesman
        </Button>
        {showCreate && (
          <CreateSalesmanModal handleClose={() => setShowCreate(false)} />
        )}
      </div>
      <div className="flex flex-col grow h-full">
        <div className="w-full flex flex-col grow">
          <BodyCard
            customHeader={<SalesmanPageTableHeader activeView="salesman" />}
          >
            <CustomerTable />
          </BodyCard>
        </div>
      </div>
    </div>
  )
}

const Salesman = () => {
  return (
    <Router>
      <SalesmanIndex path="/" />
      <Details path=":id" />
    </Router>
  )
}

export default Salesman
