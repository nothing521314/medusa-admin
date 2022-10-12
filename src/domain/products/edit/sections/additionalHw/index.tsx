import { Product } from "@medusa-types";
import clsx from "clsx";
import React from "react";
import Checkbox from "src/components/atoms/checkbox";
import ImagePlaceholderIcon from "src/components/fundamentals/icons/image-placeholder-icon";
import Section from "src/components/organisms/section";

const dummy = {
  id: "prod_01GF3MQH4QMYBW1E844JP8AC3J",
  created_at: "2022-10-11T13:46:15.020Z",
  updated_at: "2022-10-11T13:46:15.020Z",
  deleted_at: null,
  title: "Printer",
  brand: "Samsung",
  dimension: "20 cm x 30 cm",
  delivery_lead_time: null,
  warranty: "warranty",
  subtitle: null,
  description: "Made by Samsung",
  handle: "galaxy-a-7",
  is_giftcard: false,
  status: "draft",
  thumbnail: "https://m.media-amazon.com/images/I/81MA6k8dr1L.png",
  profile_id: null,
  weight: 30,
  length: null,
  height: null,
  width: null,
  hs_code: null,
  origin_country: null,
  mid_code: null,
  material: null,
  collection_id: "pcol_01GF3MQ7HW74SK7S0BZYTZJM65",
  type_id: null,
  discountable: true,
  external_id: null,
  metadata: {},
  variants: [],
  images: [
    {
      id: "img_01GF3MQH4KZN64RJGQ6D60T1NH",
      created_at: "2022-10-11T13:46:15.020Z",
      updated_at: "2022-10-11T13:46:15.020Z",
      deleted_at: null,
      url:
        "https://johnlewis.scene7.com/is/image/JohnLewis/240082094?$rsp-pdp-port-640$",
      metadata: null,
    },
  ],
  options: [],
  tags: [],
  type: null,
  collection: {
    id: "pcol_01GF3MQ7HW74SK7S0BZYTZJM65",
    created_at: "2022-10-11T13:46:05.243Z",
    updated_at: "2022-10-11T13:46:05.243Z",
    deleted_at: null,
    title: "Samsung",
    handle: "handle collection",
    metadata: { fields: "fields metadata" },
  },
  prices: [
    {
      price: 310,
    },
  ],
  additional_hardwares: [],
};

function AdditionalHardwares() {
  return (
    <Section title="Additional hardwares">
      <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(250px,5fr))] gap-4">
        {[dummy, dummy, dummy, dummy].map((p) => {
          return <ProductTile product={p} />;
        })}
      </div>
    </Section>
  );
}
const ProductTile = ({ product }: { product: Product }) => {
  const price = product.prices?.[0]?.price;

  return (
    <div className="p-base group rounded-rounded hover:bg-grey-5 flex-col border border-grey-30">
      <div className="relative">
        <div
          className={clsx(
            "rounded-base inline-block absolute top-2 right-2 z-10"
          )}
        ></div>
        <div
          className={clsx(
            "min-h-[230px] flex items-center justify-center bg-grey-5 rounded-rounded relative",
            "bg-cover bg-no-repeat bg-center"
          )}
          style={{ backgroundImage: `url(${product?.thumbnail})` }}
        >
          {!product?.thumbnail && <ImagePlaceholderIcon size={12} />}
        </div>

        <div>
          <div className="mt-base flex items-center justify-between">
            <p className="inter-small-regular text-grey-90 font-semibold line-clamp-1 mr-3">
              {product?.title}
            </p>
            <p className="inter-small-regular text-grey-90 font-semibold line-clamp-1 mr-3">
              {price ? `$${price}` : "-"}
            </p>
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <Checkbox label={""} />
        </div>
      </div>
    </div>
  );
};

export default AdditionalHardwares;
