import React from "react";
import { ErrorIcon } from "react-hot-toast";
import Button from "src/components/fundamentals/button";
import Modal from "src/components/molecules/modal";

type TCanNotMakeQuoteModal = {
  handleClose: () => void;
  onSubmit?: () => void;
};

const CanNotMakeQuotationModal = ({
  handleClose,
  onSubmit,
}: TCanNotMakeQuoteModal) => {
  return (
    <Modal handleClose={handleClose}>
      <Modal.Body className="w-[600px]">
        <Modal.Header handleClose={handleClose}>
          <div className="inter-xlarge-semibold flex flex-row items-center">
            Can not make quotation
            <ErrorIcon className="ml-2" />
          </div>
        </Modal.Header>
        <Modal.Content className="!w-full">
          <div className="mb-4 inter-small-regular">
            You have to add products to the cart to make the quotation.
            <a className="ml-1 text-blue-60 underline cursor-pointer">
              View product
            </a>
          </div>
          <div className="w-full flex justify-center">
            <Button variant="secondary" size="small" onClick={onSubmit}>
              OK, I understand!
            </Button>
          </div>
        </Modal.Content>
      </Modal.Body>
    </Modal>
  );
};

export default CanNotMakeQuotationModal;
