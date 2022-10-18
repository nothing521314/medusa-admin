import {
  useAdminProduct,
  useAdminRegions,
  useAdminUpdateProduct,
} from "@medusa-react";
import { Product } from "@medusa-types";
import { RouteComponentProps } from "@reach/router";
import { navigate } from "gatsby";
import React, { useEffect, useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import ReactJson from "react-json-view";
import Button from "src/components/fundamentals/button";
import { KEY } from "src/constants/misc";
import useNotification from "src/hooks/use-notification";
import { FormImage } from "src/types/shared";
import { getErrorMessage } from "src/utils/error-messages";
import { prepareImages } from "src/utils/images";
import BackButton from "../../../components/atoms/back-button";
import Spinner from "../../../components/atoms/spinner";
import Section from "../../../components/organisms/section";
import { getErrorStatus } from "../../../utils/get-error-status";
import AdditionalHardwares from "../components/sections/additional-hw";
import GeneralSection from "../components/sections/general";
import MediaSection from "../components/sections/media";
import PricesSection from "../components/sections/price";

interface EditProps extends RouteComponentProps {
  id: string;
}

const Edit = ({ id }: EditProps) => {
  const { product, status, error, isLoading } = useAdminProduct(id);
  const { mutate, isLoading: isLoadingUpdate } = useAdminUpdateProduct(id);
  const { regions: regionsMaster } = useAdminRegions();
  const notification = useNotification();

  const form = useForm<Product>({});
  const {
    control,
    formState: { errors, isDirty },
    register,
    getValues,
    handleSubmit,
    watch,
    reset,
  } = form;

  useEffect(() => {
    if (product) {
      const col = product.collection as any;
      const prices = product.prices;
      const hw = product.additional_hardwares?.map((v: any) => {
        const h = v.product_addition;
        return h
          ? {
              ...v,
              id: v.product_additions_id,
              title: h.title,
              images: [{ url: h.thumbnail }],
              thumbnail: h.thumbnail,
              prices: h.prices?.map((v) => ({
                label: v.region_id,
                value: v.price,
              })),
            }
          : null;
      });

      const pricesProduct = regionsMaster?.map((v) => {
        const p = prices?.find((p) => p?.region_id === v.id)?.price ?? 0;
        return {
          region: v.id,
          value: p,
        };
      });

      reset({
        ...product,
        additional_hardwares: hw,
        collection: {
          value: col?.id,
          label: col?.title,
        },
        prices: pricesProduct as any,
      });
    }
  }, [product, regionsMaster, reset]);

  const onSubmit = () =>
    handleSubmit(
      async ({ images, id, collection, additional_hardwares, ...data }) => {
        if (!images.some((v) => v?.url)) {
          notification("Error", "Media is required.", "error");
          return;
        }
        if (!data.prices.some((v) => v?.value)) {
          notification("Error", "Prices is required.", "error");
          return;
        }

        const req: any = {
          title: data.title,
          subtitle: data.subtitle,
          description: data.description,
          weight: data.weight,
          dimension: data.dimension,
          brand: data.brand,
          delivery_lead_time: data.delivery_lead_time,
          warranty: data.warranty,
          additional_hardwares:
            collection.value === KEY.ID_CATEGORY_HW
              ? []
              : additional_hardwares?.map((v) => ({
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
          onSuccess: ({ product }) => {
            // navigate(`/a/products/${product.id}`);
            notification("Success", "Update product success", "success");
          },
          onError: (err) => {
            notification("Error", getErrorMessage(err), "error");
          },
        });
      }
    );

  if (error) {
    let message = "An unknown error occurred";

    const errorStatus = getErrorStatus(error);

    if (errorStatus) {
      message = errorStatus.message;

      if (errorStatus.status === 404) {
        navigate("/404");
        return null;
      }
    }

    // temp needs design
    return (
      <Section title="Error">
        <p className="inter-base-regular">{message}</p>

        <div className="mt-base bg-grey-5 rounded-rounded px-base py-xsmall">
          <ReactJson
            name={"Stack Trace"}
            collapsed={true}
            src={JSON.parse(JSON.stringify(error))}
          />
        </div>
      </Section>
    );
  }

  if (status === "loading" || !product) {
    // temp, perhaps use skeletons?
    return (
      <div className="w-full h-[calc(100vh-64px)] flex items-center justify-center">
        <Spinner variant="secondary" />
      </div>
    );
  }

  return (
    <div className="pb-5xlarge">
      <BackButton
        path="/a/products"
        label="Back to Products"
        className="mb-xsmall"
      />
      <div className="grid grid-cols-12 gap-x-base">
        <div className="col-span-12 flex flex-col gap-y-xsmall">
          <MediaSection mode="edit" form={form} />
          <GeneralSection mode="edit" form={form} />
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
          className="w-[200px]"
          disabled={!isDirty || isLoading || isLoadingUpdate}
          onClick={onSubmit()}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default Edit;
