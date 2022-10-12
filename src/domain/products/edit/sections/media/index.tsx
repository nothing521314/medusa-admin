import { Product } from "@medusa-types";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import CartPlusIcon from "src/components/fundamentals/icons/cart-plus-icon";
import Section from "src/components/organisms/section";
import Button from "../../../../../components/fundamentals/button";
import Modal from "../../../../../components/molecules/modal";
import useNotification from "../../../../../hooks/use-notification";
import { FormImage } from "../../../../../types/shared";
import { prepareImages } from "../../../../../utils/images";
import { nestedForm } from "../../../../../utils/nested-form";
import MediaForm, { MediaFormType } from "../../../components/media-form";
import useEditProductActions from "../../hooks/use-edit-product-actions";
import { CartContext, useAdminDeleteProduct } from "@medusa-react";

type Props = {
  product: Product;
  // open: boolean;
  // onClose: () => void;
};

type MediaForm = {
  media: MediaFormType;
};

const MediaModal = ({ product }: Props) => {
  const { onUpdate, updating } = useEditProductActions(product.id);
  const { handleAddToCart } = React.useContext(CartContext);
  const form = useForm<MediaForm>({
    defaultValues: getDefaultValues(product),
  });

  const {
    formState: { isDirty },
    handleSubmit,
    reset,
  } = form;

  const notification = useNotification();

  useEffect(() => {
    reset(getDefaultValues(product));
  }, [product]);

  const onReset = () => {
    reset(getDefaultValues(product));
  };

  const onSubmit = handleSubmit(async (data) => {
    let preppedImages: FormImage[] = [];

    try {
      preppedImages = await prepareImages(data.media.images);
    } catch (error) {
      let errorMessage = "Something went wrong while trying to upload images.";
      const response = (error as any).response as Response;

      if (response.status === 500) {
        errorMessage =
          errorMessage +
          " " +
          "You might not have a file service configured. Please contact your administrator";
      }

      notification("Error", errorMessage, "error");
      return;
    }
    const urls = preppedImages.map((image) => image.url);

    onUpdate(
      {
        images: urls,
      },
      onReset
    );
  });

  const price = product.prices?.[0]?.price;

  return (
    <Section title="Media">
      <div className="grid grid-cols-12 gap-x-base">
        <div className="col-span-7 flex flex-col gap-y-3">
          <MediaForm form={nestedForm(form, "media")} />
        </div>
        <div className="flex flex-col col-span-5 gap-y-3 justify-center items-center">
          <span>
            <span className="font-bold">Price</span>:{" "}
            <span className="text-xl">{price ? `$${price}` : "-"}</span>
          </span>
          <Button
            variant="secondary"
            size="small"
            onClick={() => handleAddToCart?.(product)}
          >
            <CartPlusIcon size={20} />
            Add To Cart
          </Button>
        </div>
      </div>
    </Section>
  );
};

const getDefaultValues = (product: Product): MediaForm => {
  return {
    media: {
      images:
        product.images?.map((image) => ({
          url: image.url,
          selected: false,
        })) || [],
    },
  };
};

export default MediaModal;
