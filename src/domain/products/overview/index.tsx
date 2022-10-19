import { navigate, RouteComponentProps, useLocation } from "@reach/router";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { AccountContext } from "src/context/account";
import { SelectionRegion } from "src/domain/settings/regions/components/selection-region";
import { useAdminCreateCollection } from "../../../../medusa-react";
import Button from "../../../components/fundamentals/button";
import PlusIcon from "../../../components/fundamentals/icons/plus-icon";
import BodyCard from "../../../components/organisms/body-card";
import TableViewHeader from "../../../components/organisms/custom-table-header";
import AddCollectionModal from "../../../components/templates/collection-modal";
import CollectionsTable from "../../../components/templates/collections-table";
import ProductTable from "../../../components/templates/product-table";
import useNotification from "../../../hooks/use-notification";
import { getErrorMessage } from "../../../utils/error-messages";

const VIEWS = ["products"];

const Overview: React.FC<RouteComponentProps> = () => {
  const location = useLocation();
  const [view, setView] = useState("products");
  const [showNewCollection, setShowNewCollection] = useState(false);
  const { isAdmin } = useContext(AccountContext);

  // const {
  //   state: createProductState,
  //   close: closeProductCreate,
  //   open: openProductCreate,
  // } = useToggleState();

  // const createBatchJob = useAdminCreateBatchJob();

  const notification = useNotification();

  const createCollection = useAdminCreateCollection();

  // useEffect(() => {
  //   if (location.search.includes("?view=collections")) {
  //     setView("collections");
  //   }
  // }, [location]);

  useEffect(() => {
    location.search = "";
  }, [location, view]);

  const CurrentView = useCallback(() => {
    switch (view) {
      case "products":
        return <ProductTable />;
      default:
        return <CollectionsTable />;
    }
  }, [view]);

  const CurrentAction = useCallback(() => {
    switch (view) {
      case "products":
        return isAdmin && (
          <div className="flex space-x-2">
            {/* <Button variant="secondary" size="small">
              Import Products
            </Button>
            <Button variant="secondary" size="small">
              Export Products
            </Button> */}
            <Button
              variant="secondary"
              size="small"
              onClick={() => navigate("/a/products/create")}
            >
              <PlusIcon size={20} />
              New Product
            </Button>
          </div>
        );
      default:
        return (
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="small"
              onClick={() => setShowNewCollection(!showNewCollection)}
            >
              <PlusIcon size={20} />
              New Collection
            </Button>
          </div>
        );
    }
  }, [showNewCollection, view]);

  const handleCreateCollection = async (data, colMetadata) => {
    const metadata = colMetadata
      .filter((m) => m.key && m.value) // remove empty metadata
      .reduce((acc, next) => {
        return {
          ...acc,
          [next.key]: next.value,
        };
      }, {});

    await createCollection.mutateAsync(
      { ...data, metadata },
      {
        onSuccess: ({ collection }) => {
          notification("Success", "Successfully created collection", "success");
          navigate(`/a/collections/${collection.id}`);
          setShowNewCollection(false);
        },
        onError: (err) => notification("Error", getErrorMessage(err), "error"),
      }
    );
  };

  return (
    <>
      <div className="flex flex-col grow h-full">
        <div className="w-full flex flex-col grow">
          <BodyCard
            forceDropdown={false}
            customActionable={CurrentAction()}
            customHeader={
              <TableViewHeader
                append={isAdmin ? <SelectionRegion /> : null}
                views={VIEWS}
                setActiveView={setView}
                activeView={view}
              />
            }
          >
            <CurrentView />
          </BodyCard>
        </div>
      </div>
      {showNewCollection && (
        <AddCollectionModal
          onClose={() => setShowNewCollection(!showNewCollection)}
          onSubmit={handleCreateCollection}
        />
      )}
      {/* {exportModalOpen && (
        <ExportModal
          title="Export Products"
          handleClose={() => closeExportModal()}
          onSubmit={handleCreateExport}
          loading={createBatchJob.isLoading}
        />
      )}
      {importModalOpen && (
        <ImportProducts handleClose={() => closeImportModal()} />
      )} */}
    </>
  );
};

export default Overview;
