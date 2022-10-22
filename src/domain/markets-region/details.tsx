import { useAdminRegion, useAdminUpdateRegion } from "@medusa-react";
import { Region } from "@medusa-types";
import { RouteComponentProps } from "@reach/router";
import { navigate } from "gatsby";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { getErrorMessage } from "src/utils/error-messages";
import FormValidator from "src/utils/form-validator";
import Button from "../../components/fundamentals/button";
import Breadcrumb from "../../components/molecules/breadcrumb";
import InputField from "../../components/molecules/input";
import BodyCard from "../../components/organisms/body-card";
import useNotification from "../../hooks/use-notification";
import ProductTable from "./product-table";
import SalesmanTable from "./salesman-table";

type CustomerDetailProps = {
  id: string;
} & RouteComponentProps;

const MarketRegionDetail: React.FC<CustomerDetailProps> = ({ id }) => {
  const form = useForm<Region>();
  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { isDirty, errors },
  } = form;

  const notification = useNotification();
  const { region, isSuccess } = useAdminRegion(id, {
    cacheTime: 0,
  });
  const updateRegion = useAdminUpdateRegion(id);

  useEffect(() => {
    region &&
      reset({
        ...region,
        currency_code: region?.currency_code.toLocaleUpperCase(),
      } as Region);
  }, [reset, region]);

  const onSubmit = handleSubmit(({ name, currency_code }) => {
    updateRegion.mutate(
      { name, currency_code: currency_code.toLocaleLowerCase() },
      {
        onSuccess: () => {
          notification("Success", "Successfully updated region", "success");
        },
        onError: (err) => {
          notification("Error", getErrorMessage(err), "error");
        },
      }
    );
  });

  if (!region) return null;

  return (
    <div>
      <Breadcrumb
        currentPage={"Market Region Details"}
        previousBreadcrumb={"Market Region"}
        previousRoute="/a/markets-region"
      />
      <BodyCard title="Market Region Details" className="min-h-">
        <div className="w-full flex mb-4 space-x-3">
          <InputField
            label="Name"
            {...register("name", {
              required: FormValidator.required("Name"),
            })}
            errors={errors}
          />
          <InputField
            label="Price currency"
            {...register("currency_code", {
              required: FormValidator.required("Price currency"),
            })}
            errors={errors}
          />
          <div className="mt-8  flex justify-center">
            <Button
              size="small"
              variant="danger"
              onClick={() => navigate(`/a/markets-region`)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button
              size="small"
              loading={updateRegion.isLoading}
              disabled={!isDirty || updateRegion.isLoading}
              variant="primary"
              className="min-w-[100px]"
              onClick={onSubmit}
            >
              Save
            </Button>
          </div>
        </div>
        {/* <ListProduct form={form} /> */}
        <div className="mt-9">
          <SalesmanTable id={id} />
        </div>
        <div className="mt-9">
          <ProductTable id={id} />
        </div>
      </BodyCard>
    </div>
  );
};

export default MarketRegionDetail;
