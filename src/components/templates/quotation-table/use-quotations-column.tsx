import { Order } from "@medusa-types";
import moment from "moment";
import React, { useMemo } from "react";
import { Column } from "react-table";
import { getColor } from "../../../utils/color";
import { formatAmountWithSymbol } from "../../../utils/prices";
import Tooltip from "../../atoms/tooltip";
import CustomerAvatarItem from "../../molecules/customer-avatar-item";
import Table from "../../molecules/table";

const useOrderTableColumns = (): Column<Order>[] => {
  return useMemo(
    () => [
      {
        Header: (
          <Table.HeadCell className="pl-2 flex items-center">
            No #
          </Table.HeadCell>
        ),
        accessor: "display_id",
        disableSortBy: true,
        Cell: ({ cell: { value }, index }) => (
          <Table.Cell
            key={index}
            className="text-grey-90 group-hover:text-violet-60 min-w-[100px] pl-2"
          >{`#${value}`}</Table.Cell>
        ),
      },
      {
        Header: "Quotation code",
        accessor: "cart_id",
        disableSortBy: true,
        Cell: ({ cell: { value }, index }) => (
          <Table.Cell
            key={index}
            className="text-grey-90 group-hover:text-violet-60 min-w-[100px]"
          >{`#${value}`}</Table.Cell>
        ),
      },
      {
        Header: "Date created",
        accessor: "created_at",
        defaultCanSort: true,
        Cell: ({ cell: { value }, index }) => (
          <Table.Cell key={index}>
            <Tooltip content={moment(value).format("DD MMM YYYY hh:mm a")}>
              {moment(value).format("DD MMM YYYY")}
            </Tooltip>
          </Table.Cell>
        ),
      },
      {
        Header: "Customer",
        disableSortBy: true,
        accessor: "customer",
        Cell: ({ row, cell: { value }, index }) => (
          <Table.Cell key={index}>
            <CustomerAvatarItem
              customer={{
                first_name:
                  value?.first_name ||
                  row.original.shipping_address?.first_name ||
                  "",
                last_name:
                  value?.last_name ||
                  row.original.shipping_address?.last_name ||
                  "",
                email: row.original.email,
              }}
              color={getColor(row.index)}
              className="!px-0"
            />
          </Table.Cell>
        ),
      },
      {
        Header: "Total",
        accessor: "total",
        Cell: ({ row, cell: { value }, index }) => (
          <Table.Cell key={index}>
            {formatAmountWithSymbol({
              amount: value,
              currency: row.original.currency_code,
              digits: 2,
            })}
          </Table.Cell>
        ),
      },
      // {
      //   Header: "",
      //   disableSortBy: true,
      //   accessor: "currency",
      //   Cell: ({ row, index }) => (
      //     <Table.Cell className="w-[5%] pr-2" key={index}>
      //       <div className="flex rounded-rounded w-full justify-end">
      //         <Tooltip
      //           content={
      //             isoAlpha2Countries[
      //               row.original.shipping_address?.country_code?.toUpperCase()
      //             ] ||
      //             row.original.shipping_address?.country_code?.toUpperCase()
      //           }
      //         >
      //           <ReactCountryFlag
      //             className={"rounded"}
      //             svg
      //             countryCode={row.original.shipping_address?.country_code}
      //           />
      //         </Tooltip>
      //       </div>
      //     </Table.Cell>
      //   ),
      // },
    ],
    []
  );
};

export default useOrderTableColumns;
