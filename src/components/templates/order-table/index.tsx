import { RouteComponentProps, useLocation } from "@reach/router";
import clsx from "clsx";
import { navigate } from "gatsby";
import { isEmpty } from "lodash";
import qs from "qs";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { usePagination, useSortBy, useTable } from "react-table";
import DownloadIcon from "src/components/fundamentals/icons/download-icon";
import EditIcon from "src/components/fundamentals/icons/edit-icon";
import MailIcon from "src/components/fundamentals/icons/mail-icon";
import SortingIcon from "src/components/fundamentals/icons/sorting-icon";
import TrashIcon from "src/components/fundamentals/icons/trash-icon";
import { useDebounce } from "src/hooks/use-debounce";
import Spinner from "../../atoms/spinner";
import Table, { TablePagination } from "../../molecules/table";
import { parseQuotationQueryString } from "./quotation-filters";
import useOrderTableColumns from "./use-order-column";

const DEFAULT_PAGE_SIZE = 15;

const OrderTable: React.FC<RouteComponentProps> = () => {
  const location = useLocation();

  const defaultFilter = useMemo(() => {
    if (location.search && location.search[0] === "?") {
      location.search = location.search.substring(1);
    }

    return parseQuotationQueryString(location.search);
  }, [location]);

  const [filters, setFilters] = useState(defaultFilter);

  const filtersDebounce = useDebounce(filters, 400);

  // const { orders, isLoading, count } = useAdminOrders(queryObject);

  const { orders, isLoading, count } = {
    orders: [
      {
        cart_id: "123",
        customer: {
          first_name: "nothing",
          last_name: "nguyen",
        },
        display_id: 1,
        created_at: "2022-10-02",
        total: 111111,
        currency_code: "VND",
        currency: "usd",
        id: "order_01FG1DWV8Y6K4K72KBR6KA74DN",
      },
    ],
    isLoading: false,
    count: 10,
  };

  const numPages = useMemo(() => {
    const controlledPageCount = Math.ceil(count! / filters.limit);
    return controlledPageCount;
  }, [count, filters.limit]);

  const columns = useOrderTableColumns();

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    // Get the state from the instance
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data: (orders as any) || [],
      manualPagination: true,
      manualSortBy: true,
      initialState: {
        pageSize: filtersDebounce.limit,
        pageIndex: filtersDebounce.offset / filtersDebounce.limit,
        sortBy: [
          { id: "created_at", desc: true },
          { id: "total", desc: true },
        ],
      },
      pageCount: numPages,
      autoResetPage: false,
    },
    useSortBy,
    usePagination
  );

  const handleNext = () => {
    if (canNextPage) {
      nextPage();
    }
  };

  const handlePrev = () => {
    if (canPreviousPage) {
      previousPage();
    }
  };

  const handleDelete = useCallback((id: number | string) => {
    return id;
  }, []);

  const handleSetQuery = useCallback(
    (value: string) => {
      setFilters((pre) => ({
        ...pre,
        query: value,
      }));
      gotoPage(0);
    },
    [gotoPage]
  );

  const updateUrlFromFilter = useCallback((obj = {}) => {
    const stringified = qs.stringify(obj);
    window.history.replaceState("/a/orders", "", `${`?${stringified}`}`);
  }, []);

  const removeEmptyProperties = useCallback(
    (obj: {
      [key: string]: string | number | Array<string> | undefined | boolean;
    }) => {
      return Object.fromEntries(
        Object.entries(obj).filter(([, value]) => value !== "")
      );
    },
    []
  );

  const refreshWithFilters = useCallback(() => {
    const filterObj = removeEmptyProperties(filtersDebounce);

    if (isEmpty(filterObj)) {
      updateUrlFromFilter({ offset: 0, limit: DEFAULT_PAGE_SIZE });
    } else {
      updateUrlFromFilter(filterObj);
    }
  }, [filtersDebounce, removeEmptyProperties, updateUrlFromFilter]);

  useEffect(() => {
    refreshWithFilters();
  }, [refreshWithFilters]);

  return (
    <div className="w-full overflow-y-auto flex flex-col justify-between min-h-[300px] h-full ">
      <Table
        enableSearch
        handleSearch={handleSetQuery}
        searchValue={filters.query}
        {...getTableProps()}
        className={clsx({ ["relative"]: isLoading })}
      >
        <Table.Head>
          {headerGroups?.map((headerGroup) => (
            <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((col) => (
                <Table.HeadCell
                  {...col.getHeaderProps(col.getSortByToggleProps())}
                >
                  <div className="flex items-center">
                    {col.render("Header")}
                    {col.isSorted && (
                      <SortingIcon
                        color="#a0a0a0"
                        size="20"
                        descendingColor={col.isSortedDesc ? "#111827" : ""}
                        ascendingColor={!col.isSortedDesc ? "#111827" : ""}
                      />
                    )}
                  </div>
                </Table.HeadCell>
              ))}
            </Table.HeadRow>
          ))}
        </Table.Head>
        {isLoading || !orders ? (
          <div className="flex w-full h-full absolute items-center justify-center mt-10">
            <div className="">
              <Spinner size={"large"} variant={"secondary"} />
            </div>
          </div>
        ) : (
          <Table.Body {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <Table.Row
                  color={"inherit"}
                  linkTo={row.original.id}
                  actions={[
                    {
                      label: "Revise",
                      onClick: () => navigate(row.original.id),
                      icon: <EditIcon size={20} />,
                    },
                    {
                      label: "Download",
                      onClick: () => navigate(row.original.id),
                      icon: <DownloadIcon size={20} />,
                    },
                    {
                      label: "Email",
                      onClick: () => navigate(row.original.id),
                      icon: <MailIcon size={20} />,
                    },
                    {
                      label: "Delete Quotation",
                      variant: "danger",
                      onClick: () => handleDelete(row.original.id),
                      icon: <TrashIcon size={20} />,
                    },
                  ]}
                  {...row.getRowProps()}
                >
                  {row.cells.map((cell, index) => {
                    return cell.render("Cell", { index });
                  })}
                </Table.Row>
              );
            })}
          </Table.Body>
        )}
      </Table>
      <TablePagination
        count={count!}
        limit={filters.limit}
        offset={filters.offset}
        pageSize={filters.offset + rows.length}
        title="Quotations"
        currentPage={pageIndex + 1}
        pageCount={pageCount}
        nextPage={handleNext}
        prevPage={handlePrev}
        hasNext={canNextPage}
        hasPrev={canPreviousPage}
      />
    </div>
  );
};

export default OrderTable;
