import { Product } from "@medusa-types";
import moment from "moment";
import React, { useMemo } from "react";
import { Column } from "react-table";
import ImagePlaceholder from "src/components/fundamentals/image-placeholder";
import { formatAmountWithSymbol } from "src/utils/prices";

const useProductTableColumn = ({
  setTileView,
  setListView,
  showList,
  region,
}) => {
  const columns = useMemo(
    (): Column<Product>[] => [
      {
        Header: "Date added",
        accessor: "created_at", // accessor is the "key" in the data
        Cell: ({ cell: { value } }) => moment(value).format("DD MMM YYYY"),
      },
      {
        Header: "Name",
        accessor: "title",
        Cell: ({ row: { original } }) => {
          return (
            <div className="flex items-center">
              <div className="h-[40px] w-[30px] my-1.5 flex items-center mr-4">
                {original.images?.[0]?.url ? (
                  <img
                    src={original.images?.[0]?.url}
                    className="h-full object-cover rounded-soft"
                  />
                ) : (
                  <ImagePlaceholder />
                )}
              </div>
              {original.title}
            </div>
          );
        },
      },
      {
        Header: "Description",
        accessor: "description", // accessor is the "key" in the data
        Cell: ({ cell: { value } }) => {
          return <div>{value || "-"}</div>;
        },
      },
      {
        Header: "Prices",
        accessor: "prices", // accessor is the "key" in the data
        Cell: ({ cell: { value } }) => {
          const price = value?.[0]?.price ?? 0;
          return (
            <div>
              {price
                ? formatAmountWithSymbol({
                    amount: price,
                    currency: region?.currency_code || "usd",
                    digits: 2,
                    tax: region?.tax_rate || 0,
                  })
                : "-"}
            </div>
          );
        },
      },
    ],
    [region?.currency_code, region?.tax_rate]
  );

  return [columns] as const;
};

export default useProductTableColumn;
