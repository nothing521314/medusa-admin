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
import { FeatureFlagContext } from "../../../context/feature-flag";
import Spinner from "../../atoms/spinner";
import Table, { TablePagination } from "../../molecules/table";
import useOrderTableColumns from "./use-order-column";
import { useOrderFilters } from "./use-order-filters";

const DEFAULT_PAGE_SIZE = 15;

const defaultQueryProps = {
  expand: "shipping_address",
  fields:
    "id,status,display_id,created_at,email,fulfillment_status,payment_status,total,currency_code",
};

const OrderTable: React.FC<RouteComponentProps> = () => {
  const location = useLocation();

  const { isFeatureEnabled } = React.useContext(FeatureFlagContext);

  const hiddenColumns = useMemo(() => {
    if (isFeatureEnabled("sales_channels")) {
      defaultQueryProps.expand = "shipping_address,sales_channel";
      return [];
    }
    return ["sales_channel"];
  }, [isFeatureEnabled]);

  const {
    reset,
    paginate,
    setQuery: setFreeText,
    queryObject,
    representationObject,
  } = useOrderFilters(location.search, defaultQueryProps);
  const filtersOnLoad = queryObject;

  const offs = parseInt(filtersOnLoad?.offset) || 0;
  const lim = parseInt(filtersOnLoad.limit) || DEFAULT_PAGE_SIZE;

  const [query, setQuery] = useState(filtersOnLoad?.query);
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
      },
    ],
    isLoading: false,
    count: 1,
  };

  const numPages = useMemo(() => {
    const controlledPageCount = Math.ceil(count! / queryObject.limit);
    return controlledPageCount;
  }, [count, queryObject.limit]);

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
        pageSize: lim,
        pageIndex: offs / lim,
        hiddenColumns,
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

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query) {
        setFreeText(query);
        gotoPage(0);
      } else {
        // if we delete query string, we reset the table view
        reset();
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [gotoPage, query, reset, setFreeText]);

  const handleNext = () => {
    if (canNextPage) {
      paginate(1);
      nextPage();
    }
  };

  const handlePrev = () => {
    if (canPreviousPage) {
      paginate(-1);
      previousPage();
    }
  };

  const handleDelete = useCallback((id: number | string) => {
    return id;
  }, []);

  const updateUrlFromFilter = useCallback((obj = {}) => {
    const stringified = qs.stringify(obj);
    window.history.replaceState("/a/orders", "", `${`?${stringified}`}`);
  }, []);

  const refreshWithFilters = useCallback(() => {
    const filterObj = representationObject;

    if (isEmpty(filterObj)) {
      updateUrlFromFilter({ offset: 0, limit: DEFAULT_PAGE_SIZE });
    } else {
      updateUrlFromFilter(filterObj);
    }
  }, [representationObject, updateUrlFromFilter]);

  useEffect(() => {
    refreshWithFilters();
  }, [refreshWithFilters]);

  return (
    <div className="w-full overflow-y-auto flex flex-col justify-between min-h-[300px] h-full ">
      <Table
        enableSearch
        handleSearch={setQuery}
        searchValue={query}
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
                  className="group"
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
        limit={queryObject.limit}
        offset={queryObject.offset}
        pageSize={queryObject.offset + rows.length}
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
