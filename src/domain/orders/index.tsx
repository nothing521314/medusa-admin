import { RouteComponentProps, Router } from "@reach/router";
import React from "react";
import { useAdminCreateBatchJob } from "../../../medusa-react";
import BodyCard from "../../components/organisms/body-card";
import ExportModal from "../../components/organisms/export-modal";
import OrderTable from "../../components/templates/order-table";
import useNotification from "../../hooks/use-notification";
import useToggleState from "../../hooks/use-toggle-state";
import { getErrorMessage } from "../../utils/error-messages";
import Details from "./details";

const OrderIndex: React.FC<RouteComponentProps> = () => {
  const createBatchJob = useAdminCreateBatchJob();
  const notification = useNotification();

  const { close: closeExportModal, state: exportModalOpen } = useToggleState(
    false
  );

  const handleCreateExport = () => {
    const reqObj = {
      type: "order-export",
      context: {},
      dry_run: false,
    };

    createBatchJob.mutate(reqObj, {
      onSuccess: () => {
        notification("Success", "Successfully initiated export", "success");
      },
      onError: (err) => {
        notification("Error", getErrorMessage(err), "error");
      },
    });

    closeExportModal();
  };

  return (
    <>
      <div className="flex flex-col grow h-full">
        <div className="w-full flex flex-col grow">
          <BodyCard
            customHeader={<div className="inter-large-semibold">Quotation</div>}
          >
            <OrderTable />
          </BodyCard>
        </div>
      </div>
      {exportModalOpen && (
        <ExportModal
          title="Export Orders"
          handleClose={() => closeExportModal()}
          onSubmit={handleCreateExport}
          loading={createBatchJob.isLoading}
        />
      )}
    </>
  );
};

const Orders = () => {
  return (
    <Router>
      <OrderIndex path="/" />
      <Details path=":id" />
    </Router>
  );
};

export default Orders;
