import { CartContext, IProductAdded } from "@medusa-react";
import { Hardware, Product } from "@medusa-types";
import { getProductData } from "src/domain/products/get-one-product";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Button from "src/components/fundamentals/button";
import BodyCard from "src/components/organisms/body-card";
import SelectAdditionalHardwareModal from "src/domain/products/components/select-addtional-hardware-modal";
import useToggleState from "src/hooks/use-toggle-state";
import { IQuotationDetailForm } from "..";
import { SUB_TAB } from "../..";
import AddProductDialog from "../../modal/add-product-dialog";
import OrderLine from "../order-line";
import { DisplayTotal } from "../templates";

type Props = {
  formData?: IQuotationDetailForm;
  readOnly?: boolean;
  tab?: string;
};

const SummaryPanel = ({ formData, readOnly = true, tab }: Props) => {
  const summary = useMemo((): IProductAdded[] => {
    if (formData?.summary) {
      return formData.summary as IProductAdded[];
    }
    return [];
  }, [formData?.summary]);
  const [productSelected, setProductSelected] = useState<Product>();
  const [hardwares, setHardWares] = useState<Hardware[]>([]);
  const [hardwaresList, setHardWaresList] = React.useState<Hardware[]>([]);
  const { handleAddToCart, handleAddHarwareToCart } = useContext(CartContext);

  const {
    open: handleOpenHardwareModal,
    close: handleCloseHardwareModal,
    state: isOpenHardwareModal,
  } = useToggleState(false);

  const list = useMemo(() => {
    return summary?.map((item) => {
      const child_product = item?.child_product?.map((child) => {
        return {
          ...child,
          total: (child?.priceItem || 0) * (child?.quantity || 0),
        };
      });
      return {
        total: (item?.priceItem || 0) * (item?.quantity || 0),
        subTotal:
          (item?.priceItem || 0) * item.quantity +
          (child_product?.reduce((pre, cur) => pre + cur.total, 0) || 0),
        child_product,
      };
    });
  }, [summary]);

  const { subtotal, shipping, tax, originalTotal } = useMemo(() => {
    const subtotal =
      list?.reduce((pre, cur) => pre + ((cur as any)?.subTotal || 0), 0) || 0;
    const shipping = 0;
    const tax = formData?.region?.tax_rate || 0;
    return {
      subtotal,
      shipping,
      tax,
      originalTotal: subtotal + shipping + tax,
    };
  }, [list, formData?.region?.tax_rate]);
  const {
    open: handleOpenCustomerDialog,
    close: handleCloseProductDialog,
    state: isOpenProductDialog,
  } = useToggleState(false);

  const handleClickChangeButton = useCallback(() => {
    if (isOpenProductDialog) return;
    handleOpenCustomerDialog();
  }, [handleOpenCustomerDialog, isOpenProductDialog]);

  const handleClickAddToCartBtn = React.useCallback(
    async (prodId: string) => {
      const { child_product, product: productData } = await getProductData(
        prodId
      );

      const childHavePrice = child_product?.filter((item) => {
        const price = item?.prices?.find(
          (reg) => (reg as { label?: string })?.label === formData?.region?.id
        );
        return !!price;
      });
      if (childHavePrice.length) {
        setProductSelected(productData);
        handleOpenHardwareModal();
        setHardWaresList([...childHavePrice]);
      } else {
        handleAddToCart && handleAddToCart({ ...productData });
      }
    },
    [formData?.region?.id, handleAddToCart, handleOpenHardwareModal]
  );

  const handleSubmitAdd = useCallback(
    (hw) => {
      if (!productSelected) return;
      handleAddToCart && handleAddToCart(productSelected);
      setHardWares(hw);
    },
    [handleAddToCart, productSelected]
  );

  useEffect(() => {
    if (!hardwares.length) return;
    if (!productSelected?.id) return;
    try {
      handleAddHarwareToCart?.(productSelected.id, hardwares);
      setHardWares([]);
    } catch (error) {
      console.log(error);
    }
  }, [handleAddHarwareToCart, hardwares, productSelected?.id]);

  if (!summary || !formData?.region) {
    return null;
  }

  return (
    <BodyCard
      className={"w-full mb-4 min-h-0 h-auto"}
      title="Summary"
      status={
        tab === SUB_TAB.REVISE_QUOTATION ? (
          <Button
            variant="secondary"
            size="small"
            onClick={handleClickChangeButton}
            type="button"
          >
            Add Product
          </Button>
        ) : undefined
      }
    >
      <div className="mt-6">
        {summary?.map((item, i) => (
          <OrderLine
            key={i}
            region={formData?.region}
            item={item}
            readOnly={readOnly}
            tab={tab}
          />
        ))}
        <DisplayTotal
          currency={formData?.region?.currency_code || "usd"}
          totalAmount={subtotal}
          totalTitle={"Subtotal"}
        />
        <DisplayTotal
          currency={formData?.region?.currency_code || "usd"}
          totalAmount={shipping}
          totalTitle={"Shipping"}
        />
        <DisplayTotal
          currency={formData?.region?.currency_code || "usd"}
          totalAmount={tax}
          totalTitle={"Tax"}
        />
        <DisplayTotal
          variant={"large"}
          currency={formData?.region?.currency_code || "usd"}
          totalAmount={originalTotal}
          totalTitle={"Total"}
        />
      </div>
      <div className="relative w-full">
        {isOpenProductDialog && (
          <AddProductDialog
            open={isOpenProductDialog}
            onClose={handleCloseProductDialog}
            region={formData.region}
            handleSetProduct={(product) => handleClickAddToCartBtn(product.id!)}
          />
        )}
        {isOpenHardwareModal && hardwaresList && (
          <SelectAdditionalHardwareModal
            hardwareList={hardwaresList}
            isOpen={isOpenHardwareModal}
            handleClose={handleCloseHardwareModal}
            handleSubmit={handleSubmitAdd}
          />
        )}
      </div>
    </BodyCard>
  );
};

export default SummaryPanel;
