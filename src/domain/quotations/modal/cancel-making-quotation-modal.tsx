import React from "react";

import Button from "../../../components/fundamentals/button";
import Modal from "../../../components/molecules/modal";

type Props = {
  handleClickCancelButton: () => void;
  handleClickConfirmButton: () => void;
};

const CancelMakingQuotationModal: React.FC<Props> = ({
  handleClickCancelButton,
  handleClickConfirmButton,
}) => {
  return (
    <Modal handleClose={handleClickCancelButton}>
      <Modal.Body>
        <Modal.Content className="!w-full">
          <div className="inter-xlarge-semibold mb-5">
            Cancel making quotation?
          </div>
          <div className="text-red-500">
            All the data of the quotation will be reset to default!
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="flex w-full h-8 justify-end">
            <Button
              variant="secondary"
              className="mr-2 w-32 text-small justify-center"
              size="large"
              onClick={handleClickCancelButton}
            >
              No
            </Button>
            <Button
              size="large"
              className="w-32 text-small justify-center"
              variant="primary"
              onClick={handleClickConfirmButton}
            >
              Yes
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  );
};

export default CancelMakingQuotationModal;
