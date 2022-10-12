import { useAdminUsers } from "@medusa-react";
import { RouteComponentProps } from "@reach/router";
import { navigate } from "gatsby";
import { isEmpty } from "lodash";
import qs from "qs";
import React, { useEffect, useState } from "react";
import { usePagination, useTable } from "react-table";
import { useCustomerActions } from "src/hooks/use-customer-actions";
import Spinner from "../../atoms/spinner";
import EditIcon from "../../fundamentals/icons/edit-icon";
import TrashIcon from "../../fundamentals/icons/trash-icon";
import Table, { TablePagination } from "../../molecules/table";
import { useSalesmanColumns } from "./use-salesman-columns";
import { useCustomerFilters } from "./use-salesman-filters";

const DEFAULT_PAGE_SIZE = 15;

const defaultQueryProps = {
  expand: "orders",
};

const SalesmanTable: React.FC<RouteComponentProps> = () => {
  const {
    reset,
    paginate,
    setQuery: setFreeText,
    queryObject,
    representationObject,
  } = useCustomerFilters(location.search, defaultQueryProps);

  const offs = parseInt(queryObject.offset) || 0;
  const lim = parseInt(queryObject.limit) || DEFAULT_PAGE_SIZE;

  const { users, isLoading } = useAdminUsers({
    ...queryObject,
  });
  const count = users?.length;

  const [query, setQuery] = useState(queryObject.query);
  const [numPages, setNumPages] = useState(0);

  useEffect(() => {
    if (typeof count !== "undefined") {
      const controlledPageCount = Math.ceil(count / lim);
      setNumPages(controlledPageCount);
    }
  }, [count]);

  const [columns] = useSalesmanColumns();

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
      data: users || [],
      manualPagination: true,
      initialState: {
        pageSize: lim,
        pageIndex: offs / lim,
      },
      pageCount: numPages,
      autoResetPage: false,
    },
    usePagination
  );
  const { handleDelete } = useCustomerActions();
  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query) {
        setFreeText(query);
        gotoPage(0);
      } else {
        if (typeof query !== "undefined") {
          // if we delete query string, we reset the table view
          reset();
        }
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

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

  const updateUrlFromFilter = (obj = {}) => {
    const stringified = qs.stringify(obj);
    window.history.replaceState(`/a/discounts`, "", `${`?${stringified}`}`);
  };

  const refreshWithFilters = () => {
    const filterObj = representationObject;

    if (isEmpty(filterObj)) {
      updateUrlFromFilter({ offset: 0, limit: DEFAULT_PAGE_SIZE });
    } else {
      updateUrlFromFilter(filterObj);
    }
  };

  useEffect(() => {
    refreshWithFilters();
  }, [representationObject]);

  return (
    <div className="w-full h-full overflow-y-auto flex flex-col justify-between">
      <Table enableSearch handleSearch={setQuery} {...getTableProps()}>
        <Table.Head>
          {headerGroups?.map((headerGroup) => (
            <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((col) => (
                <Table.HeadCell className="w-[100px]" {...col.getHeaderProps()}>
                  {col.render("Header")}
                </Table.HeadCell>
              ))}
            </Table.HeadRow>
          ))}
        </Table.Head>
        {isLoading || !users ? (
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
                  actions={[
                    {
                      label: "Edit",
                      onClick: () => navigate(String(row.original.id)),
                      icon: <EditIcon size={20} />,
                    },
                    // {
                    //   label: "Details",
                    //   onClick: () => navigate(row.original.id),
                    //   icon: <DetailsIcon size={20} />,
                    // },
                    {
                      label: "Delete",
                      variant: "danger",
                      onClick: () =>
                        row.original.id && handleDelete(row.original.id),
                      icon: <TrashIcon size={20} />,
                    },
                  ]}
                  linkTo={row.original.id}
                  {...row.getRowProps()}
                >
                  {row.cells.map((cell, index) => {
                    return (
                      <Table.Cell {...cell.getCellProps()}>
                        {cell.render("Cell", { index })}
                      </Table.Cell>
                    );
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
        title="Customers"
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

export default SalesmanTable;
