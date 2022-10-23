import { Product } from "@medusa-types";
import clsx from "clsx";
import React, { useContext, useMemo } from "react";
import { Column } from "react-table";
import { AccountContext } from "src/context/account";
import { formatAmountWithSymbol } from "src/utils/prices";
import ListIcon from "../../fundamentals/icons/list-icon";
import TileIcon from "../../fundamentals/icons/tile-icon";
import ImagePlaceholder from "../../fundamentals/image-placeholder";

const useProductTableColumn = ({ setTileView, setListView, showList }) => {
  const { selectedRegion } = useContext(AccountContext);

  const columns = useMemo(
    (): Column<Product>[] => [
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
          const price =
            value?.find((reg) => reg.region_id === selectedRegion?.id)?.price ||
            0;
          return (
            <div>
              {price
                ? formatAmountWithSymbol({
                    amount: price,
                    currency: selectedRegion?.currency_code || "usd",
                    digits: 2,
                    tax: selectedRegion?.tax_rate || 0,
                  })
                : "-"}
            </div>
          );
        },
      },
      {
        accessor: "hs_code",
        Header: (
          <div className="text-right flex justify-end">
            <span
              onClick={setListView}
              className={clsx("hover:bg-grey-5 cursor-pointer rounded p-0.5", {
                "text-grey-90": showList,
                "text-grey-40": !showList,
              })}
            >
              <ListIcon size={20} />
            </span>
            <span
              onClick={setTileView}
              className={clsx("hover:bg-grey-5 cursor-pointer rounded p-0.5", {
                "text-grey-90": !showList,
                "text-grey-40": showList,
              })}
            >
              <TileIcon size={20} />
            </span>
          </div>
        ),
      },
    ],
    [
      selectedRegion?.currency_code,
      selectedRegion?.id,
      selectedRegion?.tax_rate,
      setListView,
      setTileView,
      showList,
    ]
  );

  return [columns] as const;
};

export default useProductTableColumn;
