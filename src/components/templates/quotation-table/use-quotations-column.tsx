import { TQuotationReturn } from "medusa-types/api/routes/admin/quotations/type";
import moment from "moment";
import React, { useMemo } from "react";
import { Column } from "react-table";
import { getColor } from "../../../utils/color";
import { formatAmountWithSymbol } from "../../../utils/prices";
import Tooltip from "../../atoms/tooltip";
import CustomerAvatarItem from "../../molecules/customer-avatar-item";
import Table from "../../molecules/table";

const useQuotationTableColumns = (): Column<TQuotationReturn>[] => {
  return useMemo(
    () => [
      {
        Header: "Quotation code",
        accessor: "code",
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
        disableSortBy: true,
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
                name: value?.name || "",
                email: row.original.customer.email,
              }}
              color={getColor(row.index)}
              className="!px-0"
            />
          </Table.Cell>
        ),
      },
      {
        Header: "Total",
        disableSortBy: true,
        Cell: ({ row, index }) => {
          const list = row.original.quotation_lines.map((item) => {
            const child_product = item?.child_product?.map((child) => {
              return {
                ...child,
                total: child.volume * child.unit_price,
              };
            });
            return {
              ...item,
              total: item.volume * item.unit_price,
              subTotal:
                item.volume * item.unit_price +
                (child_product?.reduce((pre, cur) => pre + cur.total, 0) || 0),
              child_product,
            };
          });
          const total = list?.reduce((pre, cur) => pre + cur.subTotal, 0) || 0;
          return (
            <Table.Cell key={index}>
              {formatAmountWithSymbol({
                amount: total,
                currency: row.original.region.currency_code,
                digits: 2,
              })}
            </Table.Cell>
          );
        },
      },
    ],
    []
  );
};

export default useQuotationTableColumns;
