import { useAdminRegionsListUser } from "@medusa-react";
import { RouteComponentProps } from "@reach/router";
import { isEmpty } from "lodash";
import qs from "qs";
import React, { useEffect, useState } from "react";
import { usePagination, useTable } from "react-table";
import Spinner from "src/components/atoms/spinner";
import Button from "src/components/fundamentals/button";
import TrashIcon from "src/components/fundamentals/icons/trash-icon";
import Table, { TablePagination } from "src/components/molecules/table";
import useToggleState from "src/hooks/use-toggle-state";
import ModalAddProduct from "../product-table/modal-add-product";
import ModalAddSalesman from "./modal-add-salesman";
import { useSalesmanActions } from "./use-salesman-actions";
import { useSalesmanColumns } from "./use-salesman-columns";
import { useCustomerFilters } from "./use-salesman-filters";

const DEFAULT_PAGE_SIZE = 15;

const defaultQueryProps = {
  expand: "orders",
};

type CustomerDetailProps = {
  id: string;
} & RouteComponentProps;

const SalesmanTable: React.FC<any> = ({ id }: CustomerDetailProps) => {
  const {
    reset,
    paginate,
    setQuery: setFreeText,
    queryObject,
    representationObject,
  } = useCustomerFilters(location.search, defaultQueryProps);
  const {
    open: openModalAdd,
    close: closeModalAdd,
    state: isOpenModalAdd,
  } = useToggleState(false);

  const offs = parseInt(queryObject.offset) || 0;
  const lim = parseInt(queryObject.limit) || DEFAULT_PAGE_SIZE;

  const { user, isLoading, status } = useAdminRegionsListUser(
    id,
    {
      // ...queryObject,
    },
    {
      cacheTime: 0,
    }
  );
  const count = user?.length;

  const [query, setQuery] = useState(queryObject.query);
  const [numPages, setNumPages] = useState(0);

  useEffect(() => {
    if (typeof count !== "undefined") {
      const controlledPageCount = Math.ceil(count / lim);
      setNumPages(controlledPageCount);
    }
  }, [count, lim]);

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
      data: user || [],
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
  const { handleDelete, handleAdd } = useSalesmanActions(id);
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
      <Table
        filteringOptions={
          <>
            <b>Total Saleman Accounts</b>: {count}{" "}
          </>
        }
        tableActions={
          <Button variant="secondary" size="small" onClick={openModalAdd}>
            Add Saleman
          </Button>
        }
        {...getTableProps()}
      >
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
        {isLoading || !user ? (
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
                      label: "Remove Salesman",
                      variant: "danger",
                      onClick: () =>
                        row.original.id && handleDelete(row.original.id),
                      icon: <TrashIcon size={20} />,
                    },
                  ]}
                  linkTo={`/a/salesman/${row.original.id}`}
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

      {isOpenModalAdd && (
        <ModalAddSalesman
          listAdded={user ?? []}
          onClose={closeModalAdd}
          open={isOpenModalAdd}
          onAdd={(user) => {
            handleAdd(user.id!);
          }}
        />
      )}
    </div>
  );
};

export default SalesmanTable;
