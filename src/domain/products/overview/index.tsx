import { navigate, RouteComponentProps, useLocation } from "@reach/router";
import React, { useCallback, useContext, useEffect } from "react";
import { AccountContext } from "src/context/account";
import { SelectionRegion } from "src/domain/settings/regions/components/selection-region";
import Button from "../../../components/fundamentals/button";
import PlusIcon from "../../../components/fundamentals/icons/plus-icon";
import BodyCard from "../../../components/organisms/body-card";
import ProductTable from "../../../components/templates/product-table";

const Overview: React.FC<RouteComponentProps> = () => {
  const location = useLocation();
  const { isAdmin } = useContext(AccountContext);

  useEffect(() => {
    location.search = "";
  }, [location]);

  const CurrentAction = useCallback(() => {
    return (
      isAdmin && (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="small"
            onClick={() => navigate("/a/products/create")}
          >
            <PlusIcon size={20} />
            New Product
          </Button>
        </div>
      )
    );
  }, [isAdmin]);

  return (
    <>
      <div className="flex flex-col grow h-full">
        <div className="w-full flex flex-col grow">
          <BodyCard
            forceDropdown={false}
            customActionable={CurrentAction()}
            customHeader={
              <div className="inter-large-semibold gap-x-base flex flex-row items-center">
                Products
                {isAdmin ? <SelectionRegion /> : null}
              </div>
            }
          >
            <ProductTable />
          </BodyCard>
        </div>
      </div>
    </>
  );
};

export default Overview;
