import { AdminPostProductsReq, Product } from "@medusa-types";
import { RouteComponentProps } from "@reach/router";
import { navigate } from "gatsby";
import React from "react";
import { useForm } from "react-hook-form";
import BackButton from "src/components/atoms/back-button";
import { FormImage } from "src/types/shared";
import { prepareImages } from "src/utils/images";
import { useAdminCreateProduct } from "../../../../medusa-react";
import Button from "../../../components/fundamentals/button";
import useNotification from "../../../hooks/use-notification";
import { getErrorMessage } from "../../../utils/error-messages";
import AdditionalHardwares from "../components/sections/additional-hw";
import GeneralSection from "../components/sections/general";
import MediaSection from "../components/sections/media";
import PricesSection from "../components/sections/price";

const NewProduct: React.FC<RouteComponentProps> = () => {
  const form = useForm<Product>({});
  const { mutate } = useAdminCreateProduct();
  const notification = useNotification();

  const {
    handleSubmit,
    formState: { isDirty, errors },
  } = form;
  console.log("errors", errors);
  // const { isFeatureEnabled } = useFeatureFlag();

  const onSubmit = () =>
    handleSubmit(
      async ({ images, collection, additional_hardwares, ...data }) => {
        if (!images.some((v) => v?.url)) {
          notification("Error", "Media is required.", "error");
          return;
        }
        if (!data.prices.some((v) => v?.value)) {
          notification("Error", "Prices is required.", "error");
          return;
        }

        const req: AdminPostProductsReq = {
          ...data,
          additional_hardwares: additional_hardwares?.map((v) => ({
            id: v.id!,
          })),
          prices: data.prices.filter(Boolean),
          collection_id: collection.value,
          images: images.map((v) => v.url),
        };

        // Upload image
        if (images?.length) {
          let preppedImages: FormImage[] = [];

          try {
            preppedImages = await prepareImages(images);
          } catch (error) {
            let errorMessage =
              "Something went wrong while trying to upload images.";
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

          req.images = urls;
        }

        mutate(req, {
          onSuccess: () => {
            navigate("/a/products");
            notification("Success", "Created a new product", "success");
          },
          onError: (err) => {
            notification("Error", getErrorMessage(err), "error");
          },
        });
      }
    );
  return (
    <div className="pb-5xlarge">
      <BackButton
        path="/a/products"
        label="Back to Products"
        className="mb-xsmall"
      />
      <div className="grid grid-cols-12 gap-x-base">
        <div className="col-span-12 flex flex-col gap-y-xsmall">
          <MediaSection mode="new" form={form} />
          <GeneralSection form={form} />
          <PricesSection form={form} />
          <AdditionalHardwares form={form} />
          {/* <AttributesSection product={product} /> */}
          {/* <RawSection product={watch()} /> */}
        </div>
      </div>
      <div className="flex flex-row items-center justify-center space-x-10 mt-5">
        <Button
          onClick={() => navigate("/a/products")}
          variant="secondary"
          size="medium"
          className="w-[200px]"
          type="button"
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          size="medium"
          disabled={!isDirty}
          onClick={onSubmit()}
          className="w-[200px]"
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default NewProduct;
