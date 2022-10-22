import moment from "moment";
import { useMemo } from "react";

export const useRegionColumns = () => {
  const columns = useMemo(
    () => [
      {
        Header: "Date added",
        accessor: "created_at", // accessor is the "key" in the data
        Cell: ({ cell: { value } }) => moment(value).format("DD MMM YYYY"),
      },
      {
        Header: "Market Region",
        accessor: "name",
      },

      {
        Header: "Price Currency",
        accessor: "currency_code",
        Cell: ({ cell: { value } }) => {
          return String(value).toLocaleUpperCase();
        },
      },
      {
        Header: "No of salesman",
        accessor: "user_count",
      },
      {
        Header: "No of products",
        accessor: "product_count",
      },
    ],
    []
  );

  return [columns];
};
