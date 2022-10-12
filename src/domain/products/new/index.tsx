import { AdminPostProductsReq } from "@medusa-types";
import { navigate } from "gatsby";
import React, { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import BackButton from "src/components/atoms/back-button";
import { useAdminCreateProduct } from "../../../../medusa-react";
import Button from "../../../components/fundamentals/button";
import { useFeatureFlag } from "../../../context/feature-flag";
import useNotification from "../../../hooks/use-notification";
import { FormImage, ProductStatus } from "../../../types/shared";
import { getErrorMessage } from "../../../utils/error-messages";
import { prepareImages } from "../../../utils/images";
import { CustomsFormType } from "../components/customs-form";
import
  {
    DimensionsFormType
  } from "../components/dimensions-form";
import
  {
    DiscountableFormType
  } from "../components/discountable-form";
import { GeneralFormType } from "../components/general-form";
import { MediaFormType } from "../components/media-form";
import { OrganizeFormType } from "../components/organize-form";
import { PricesFormType } from "../components/prices-form";
import { ThumbnailFormType } from "../components/thumbnail-form";
import AdditionalHardwares from "../edit/sections/additionalHw";
import GeneralSection from "./../edit/sections/general";
import MediaSection from "./../edit/sections/media";
import VariantsSection from "./../edit/sections/price";

type NewProductForm = {
  general: GeneralFormType;
  discounted: DiscountableFormType;
  organize: OrganizeFormType;
  variants: any;
  customs: CustomsFormType;
  dimensions: DimensionsFormType;
  thumbnail: ThumbnailFormType;
  media: MediaFormType;
  salesChannels: any;
};

type Props = {};

// Draft
const product = {
  id: "",
  created_at: "",
  updated_at: "",
  deleted_at: null,
  title: "",
  brand: "",
  dimension: "",
  delivery_lead_time: null,
  warranty: "",
  subtitle: null,
  description: "",
  handle: "",
  is_giftcard: false,
  status: "",
  thumbnail: "",
  profile_id: null,
  weight: 0,
  length: null,
  height: null,
  width: null,
  hs_code: null,
  origin_country: null,
  mid_code: null,
  material: null,
  collection_id: "",
  type_id: null,
  discountable: true,
  external_id: null,
  metadata: {},
  variants: [],
  images: [
    
  ],
  options: [],
  tags: [],
  type: null,
  collection: {
    id: "",
    created_at: "",
    updated_at: "",
    deleted_at: null,
    title: "",
    handle: "",
    metadata: { fields: "" },
  },
  prices: [],
  additional_hardwares: [],
};

const NewProduct = ({}: Props) => {
  const form = useForm<NewProductForm>({
    defaultValues: createBlank(),
  });
  const { mutate } = useAdminCreateProduct();
  const notification = useNotification();

  const watchedCustoms = useWatch({
    control: form.control,
    name: "customs",
  });

  const watchedDimensions = useWatch({
    control: form.control,
    name: "dimensions",
  });

  const {
    handleSubmit,
    formState: { isDirty },
    reset,
  } = form;

  const closeAndReset = () => {
    reset(createBlank());
  };

  useEffect(() => {
    reset(createBlank());
  }, []);

  const { isFeatureEnabled } = useFeatureFlag();

  const onSubmit = (publish = true) =>
    handleSubmit(async (data) => {
      const payload = createPayload(
        data,
        publish,
        isFeatureEnabled("sales_channels")
      );

      if (data.media?.images?.length) {
        let preppedImages: FormImage[] = [];

        try {
          preppedImages = await prepareImages(data.media.images);
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

        payload.images = urls;
      }

      if (data.thumbnail?.images?.length) {
        let preppedImages: FormImage[] = [];

        try {
          preppedImages = await prepareImages(data.thumbnail.images);
        } catch (error) {
          let errorMessage =
            "Something went wrong while trying to upload the thumbnail.";
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

        payload.thumbnail = urls[0];
      }

      mutate(payload, {
        onSuccess: ({ product }) => {
          closeAndReset();
          navigate(`/a/products/${product.id}`);
        },
        onError: (err) => {
          notification("Error", getErrorMessage(err), "error");
        },
      });
    });

  return (
    <div className="pb-5xlarge">
      <BackButton
        path="/a/products"
        label="Back to Products"
        className="mb-xsmall"
      />
      <div className="grid grid-cols-12 gap-x-base">
        <div className="col-span-12 flex flex-col gap-y-xsmall">
          <MediaSection product={product} />
          <GeneralSection product={product} />
          <VariantsSection product={product} />
          <AdditionalHardwares />
          {/* <AttributesSection product={product} /> */}
          {/* <RawSection product={product} /> */}
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
        <Button variant="primary" size="medium" className="w-[200px]">
          Save
        </Button>
      </div>
    </div>
  );
};

const createPayload = (
  data: NewProductForm,
  publish = true,
  salesChannelsEnabled = false
): AdminPostProductsReq => {
  const payload: AdminPostProductsReq = {
    title: data.general.title,
    subtitle: data.general.subtitle || undefined,
    material: data.general.material || undefined,
    handle: data.general.handle,
    discountable: data.discounted.value,
    is_giftcard: false,
    collection_id: data.organize.collection?.value,
    description: data.general.description || undefined,
    height: data.dimensions.height || undefined,
    length: data.dimensions.length || undefined,
    weight: data.dimensions.weight || undefined,
    width: data.dimensions.width || undefined,
    hs_code: data.customs.hs_code || undefined,
    mid_code: data.customs.mid_code || undefined,
    type: data.organize.type
      ? {
          value: data.organize.type.label,
          id: data.organize.type.value,
        }
      : undefined,
    tags: data.organize.tags
      ? data.organize.tags.map((t) => ({
          value: t,
        }))
      : undefined,
    origin_country: data.customs.origin_country?.value || undefined,
    options: data.variants.options.map((o) => ({
      title: o.title,
    })),
    variants: data.variants.entries.map((v) => ({
      title: v.general.title!,
      material: v.general.material || undefined,
      inventory_quantity: v.stock.inventory_quantity || 0,
      prices: getVariantPrices(v.prices),
      allow_backorder: v.stock.allow_backorder,
      sku: v.stock.sku || undefined,
      barcode: v.stock.barcode || undefined,
      options: v.options.map((o) => ({
        value: o.option?.value!,
      })),
      ean: v.stock.ean || undefined,
      upc: v.stock.upc || undefined,
      height: v.dimensions.height || undefined,
      length: v.dimensions.length || undefined,
      weight: v.dimensions.weight || undefined,
      width: v.dimensions.width || undefined,
      hs_code: v.customs.hs_code || undefined,
      mid_code: v.customs.mid_code || undefined,
      origin_country: v.customs.origin_country?.value || undefined,
      manage_inventory: v.stock.manage_inventory,
    })),
    // @ts-ignore
    status: publish ? ProductStatus.PUBLISHED : ProductStatus.DRAFT,
  };

  if (salesChannelsEnabled) {
    payload.sales_channels = data.salesChannels.channels.map((c) => ({
      id: c.id,
    }));
  }

  return payload;
};

const createBlank = (): NewProductForm => {
  return {
    general: {
      title: "",
      material: null,
      subtitle: null,
      description: null,
      handle: "",
    },
    customs: {
      hs_code: null,
      mid_code: null,
      origin_country: null,
    },
    dimensions: {
      height: null,
      length: null,
      weight: null,
      width: null,
    },
    discounted: {
      value: true,
    },
    media: {
      images: [],
    },
    organize: {
      collection: null,
      tags: null,
      type: null,
    },
    salesChannels: {
      channels: [],
    },
    thumbnail: {
      images: [],
    },
    variants: {
      entries: [],
      options: [],
    },
  };
};

const getVariantPrices = (prices: PricesFormType) => {
  const priceArray = prices.prices
    .filter((price) => price.amount)
    .map((price) => {
      return {
        amount: price.amount as number,
        currency_code: price.region_id ? undefined : price.currency_code,
        region_id: price.region_id || undefined,
      };
    });

  return priceArray;
};

export default NewProduct;
