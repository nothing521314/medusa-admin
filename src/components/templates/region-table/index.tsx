import { useAdminRegions } from "@medusa-react";
import { RouteComponentProps } from "@reach/router";
import { navigate } from "gatsby";
import React, { useEffect, useState } from "react";
import { usePagination, useTable } from "react-table";
import DetailsIcon from "src/components/fundamentals/details-icon";
import Spinner from "../../atoms/spinner";
import Table, { TablePagination } from "../../molecules/table";
import { NoRecordTable } from "../no-record-table";
import { useRegionColumns } from "./use-region-columns";
import { useCustomerFilters } from "./use-region-filters";

const DEFAULT_PAGE_SIZE = 15;

const defaultQueryProps = {};

const RegionTable: React.FC<RouteComponentProps> = () => {
  const {
    reset,
    paginate,
    setQuery: setFreeText,
    queryObject,
    representationObject,
  } = useCustomerFilters(location.search, defaultQueryProps);

  const offs = parseInt(queryObject.offset) || 0;
  const lim = parseInt(queryObject.limit) || DEFAULT_PAGE_SIZE;

  const { regions, isLoading } = useAdminRegions({
    ...queryObject,
  });
  const count = regions?.length;

  const [query, setQuery] = useState(queryObject.query);
  const [numPages, setNumPages] = useState(0);

  useEffect(() => {
    if (typeof count !== "undefined") {
      const controlledPageCount = Math.ceil(count / lim);
      setNumPages(controlledPageCount);
    }
  }, [count]);

  const [columns] = useRegionColumns();

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
      data: regions || [],
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

  const hasData = regions?.length ?? 0 > 0;

  return (
    <div className="w-full overflow-y-auto flex flex-col justify-between min-h-[300px] h-full ">
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
        {isLoading || !regions ? (
          <div className="flex w-full h-full absolute items-center justify-center mt-10">
            <div className="">
              <Spinner size={"large"} variant={"secondary"} />
            </div>
          </div>
        ) : hasData ? (
          <Table.Body {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <Table.Row
                  color={"inherit"}
                  actions={[
                    // {
                    //   label: "Edit",
                    //   onClick: () => navigate(String(row.original.id)),
                    //   icon: <EditIcon size={20} />,
                    // },
                    {
                      label: "Details",
                      onClick: () => navigate(String(row.original.id)),
                      icon: <DetailsIcon size={20} />,
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
        ) : (
          <NoRecordTable />
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

export default RegionTable;
