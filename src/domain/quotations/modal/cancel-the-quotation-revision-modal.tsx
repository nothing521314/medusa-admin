import React from "react";

import Button from "../../../components/fundamentals/button";
import Modal from "../../../components/molecules/modal";

type Props = {
  handleClickCancelButton: () => void;
  handleClickConfirmButton: () => void;
};

const CancelTheQuotationReviseModal: React.FC<Props> = ({
  handleClickCancelButton,
  handleClickConfirmButton,
}) => {
  return (
    <Modal handleClose={handleClickCancelButton}>
      <Modal.Body>
        <Modal.Content className="!w-full">
          <div className="inter-xlarge-semibold mb-5">
            Cancel the quotation revision?
          </div>
          <div className="text-red-500">
            The quotation will be back to the latest version!
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

export default CancelTheQuotationReviseModal;
