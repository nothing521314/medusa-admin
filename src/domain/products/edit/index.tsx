import { RouteComponentProps } from "@reach/router";
import { navigate } from "gatsby";
import React from "react";
import ReactJson from "react-json-view";
import Button from "src/components/fundamentals/button";
import { useAdminProduct } from "../../../../medusa-react";
import BackButton from "../../../components/atoms/back-button";
import Spinner from "../../../components/atoms/spinner";
import Section from "../../../components/organisms/section";
import { getErrorStatus } from "../../../utils/get-error-status";
import AdditionalHardwares from "./sections/additionalHw";
import GeneralSection from "./sections/general";
import MediaSection from "./sections/media";
import PricesSection from "./sections/price";

interface EditProps extends RouteComponentProps {
  id?: string;
}

const Edit = ({ id }: EditProps) => {
  const { product, status, error } = useAdminProduct(id || "");

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

  console.log("product", JSON.stringify(product));

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
          <PricesSection product={product} />
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

export default Edit;
