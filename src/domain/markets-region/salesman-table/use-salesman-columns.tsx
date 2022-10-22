import moment from "moment";
import React, { useMemo } from "react";
import CustomerAvatarItem from "src/components/molecules/customer-avatar-item";
import { getColor } from "../../../utils/color";

export const useSalesmanColumns = () => {
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
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Phone",
        accessor: "phone",
      },
    ],
    []
  );

  return [columns];
};
