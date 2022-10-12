import moment from "moment";
import React, { useMemo } from "react";
import { getColor } from "../../../utils/color";
import CustomerAvatarItem from "../../molecules/customer-avatar-item";

export const useCustomerColumns = () => {
  const columns = useMemo(
    () => [
      {
        Header: "Date added",
        accessor: "created_at", // accessor is the "key" in the data
        Cell: ({ cell: { value } }) => moment(value).format("DD MMM YYYY"),
      },
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ row }) => (
          <CustomerAvatarItem
            customer={row.original}
            color={getColor(row.index)}
          />
        ),
      },
      {
        Header: "Contract",
        Cell: ({
          cell: {
            row: { original },
          },
        }) => (
          <>
            {original.email}
            <br />
            {original.phone}
          </>
        ),
      },
      {
        Header: "Person In Charge",
        accessor: "person_in_charge",
      },
      // {
      //   accessor: "orders",
      //   Header: () => <div className="text-right">Orders</div>,
      //   Cell: ({ cell: { value } }) => (
      //     <div className="text-right">{value?.length || 0}</div>
      //   ),
      // },
      // {
      //   Header: "",
      //   accessor: "col-2",
      // },
    ],
    []
  );

  return [columns];
};
