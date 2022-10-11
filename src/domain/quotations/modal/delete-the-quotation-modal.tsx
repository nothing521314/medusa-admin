import React from "react";

import Button from "../../../components/fundamentals/button";
import Modal from "../../../components/molecules/modal";

type Props = {
  handleClickCancelButton: () => void;
  handleClickConfirmButton: () => void;
};

const DeleteTheQuotationModal: React.FC<Props> = ({
  handleClickCancelButton,
  handleClickConfirmButton,
}) => {
  return (
    <Modal handleClose={handleClickCancelButton}>
      <Modal.Body>
        <Modal.Content className="!w-full">
          <div className="inter-xlarge-semibold mb-5">
            Delete the quotation?
          </div>
          <div className="text-red-500">
            You can not recover the quotation you deleted
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
              Cancel
            </Button>
            <Button
              size="large"
              className="w-32 text-small justify-center"
              variant="danger"
              onClick={handleClickConfirmButton}
            >
              Delete
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteTheQuotationModal;
