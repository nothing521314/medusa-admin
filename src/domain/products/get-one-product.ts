import { Product } from "@medusa-types";
import Medusa from "src/services/api";

export const getProductData = async (id: string) => {
  const { data } = await Medusa.products.retrieve(id);
  const product: Product = data?.product;

  const col = product.collection as any;
  const prices = [...product.prices];
  const hw = !product.additional_hardwares
    ? []
    : [...product.additional_hardwares]?.map((v: any) => {
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

  const pricesProduct = prices?.map((v) => {
    return {
      region: v.region_id,
      value: v.price,
    };
  });

  return {
    product: {
      ...product,
      additional_hardwares: hw,
      collection: {
        value: col?.id,
        label: col?.title,
      },
      prices: pricesProduct as any,
    },
    child_product: hw,
  };
};
