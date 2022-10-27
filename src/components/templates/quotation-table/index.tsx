import {
  useAdminDeleteQuotation,
  useAdminQuotationGetList,
} from "@medusa-react";
import { RouteComponentProps, useLocation } from "@reach/router";
import clsx from "clsx";
import { navigate } from "gatsby";
import { isEmpty } from "lodash";
import qs from "qs";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePagination, useTable } from "react-table";
import DownloadIcon from "src/components/fundamentals/icons/download-icon";
import EditIcon from "src/components/fundamentals/icons/edit-icon";
import MailIcon from "src/components/fundamentals/icons/mail-icon";
import TrashIcon from "src/components/fundamentals/icons/trash-icon";
import { AccountContext } from "src/context/account";
import { SUB_TAB } from "src/domain/quotations";
import DeleteTheQuotationModal from "src/domain/quotations/modal/delete-the-quotation-modal";
import { useDebounce } from "src/hooks/use-debounce";
import useNotification from "src/hooks/use-notification";
import useToggleState from "src/hooks/use-toggle-state";
import Spinner from "../../atoms/spinner";
import Table, { TablePagination } from "../../molecules/table";
import { NoRecordTable } from "../no-record-table";
import {
  parseQuotationQueryString,
  removeEmptyProperties,
  TQuotationFilters,
} from "./quotation-filters";
import useQuotationTableColumns from "./use-quotations-column";

const DEFAULT_PAGE_SIZE = 15;

interface Props extends RouteComponentProps {
  handleSetFormData: (data) => void;
}

const QuotationTable: React.FC<Props> = ({ handleSetFormData }) => {
  const location = useLocation();
  const { mutateAsync: handleDeleteQuotation } = useAdminDeleteQuotation();
  const { selectedRegion } = useContext(AccountContext);
  const notification = useNotification();

  const [idDelete, setIdDelete] = useState<string>("");

  const {
    open: handleOpenDeleteQuotationModal,
    close: handleCloseDeleteQuotationModal,
    state: isVisibleDeleteQuotationModal,
  } = useToggleState(false);

  const defaultFilter = useMemo(() => {
    if (location.search && location.search[0] === "?") {
      location.search = location.search.substring(1);
    }

    return parseQuotationQueryString(location.search);
  }, [location]);

  const [filters, setFilters] = useState<TQuotationFilters>(
    defaultFilter as TQuotationFilters
  );

  const filtersDebounce = useDebounce(filters, 400);
  const { quotations, isLoading, count, refetch } = useAdminQuotationGetList(
    filtersDebounce
  );

  const numPages = useMemo(() => {
    const controlledPageCount = Math.ceil(count! / filters.limit);
    return controlledPageCount;
  }, [count, filters.limit]);

  const columns = useQuotationTableColumns();

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
    // toggleSortBy,
    // Get the state from the instance
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data: (quotations as any) || [],
      manualPagination: true,
      // manualSortBy: true,
      initialState: {
        pageSize: filtersDebounce.limit,
        pageIndex: filtersDebounce.offset / filtersDebounce.limit,
      },
      pageCount: numPages,
      autoResetPage: false,
    },
    usePagination
  );

  const handleNext = useCallback(() => {
    if (canNextPage) {
      setFilters((pre) => ({
        ...pre,
        offset: pre.offset + DEFAULT_PAGE_SIZE,
      }));
      nextPage();
    }
  }, [canNextPage, nextPage]);

  const handlePrev = useCallback(() => {
    if (canPreviousPage) {
      setFilters((pre) => ({
        ...pre,
        offset: pre.offset - DEFAULT_PAGE_SIZE,
      }));
      previousPage();
    }
  }, [canPreviousPage, previousPage]);

  // const handleSorting = useCallback(
  //   (
  //     columnId: string,
  //     disableSortBy?: boolean,
  //     descending?: boolean | undefined,
  //     isMulti?: boolean | undefined
  //   ) => {
  //     if (disableSortBy) {
  //       return;
  //     }
  //     toggleSortBy(columnId, !descending, isMulti);
  //   },
  //   [toggleSortBy]
  // );

  const handleSetQuery = useCallback(
    (value: string) => {
      setFilters((pre) => ({
        ...pre,
        q: value,
      }));
      gotoPage(0);
    },
    [gotoPage]
  );

  const updateUrlFromFilter = useCallback((obj = {}) => {
    const stringified = qs.stringify(obj);
    window.history.replaceState("/a/quotations", "", `${`?${stringified}`}`);
  }, []);

  const refreshWithFilters = useCallback(() => {
    const filterObj = removeEmptyProperties(filtersDebounce);

    if (isEmpty(filterObj)) {
      updateUrlFromFilter({ offset: 0, limit: DEFAULT_PAGE_SIZE });
    } else {
      updateUrlFromFilter(filterObj);
    }
  }, [filtersDebounce, updateUrlFromFilter]);

  useEffect(() => {
    refreshWithFilters();
  }, [refreshWithFilters]);

  useEffect(() => {
    refetch();
  }, [refetch, selectedRegion]);

  const handleSendMail = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, mail: string) => {
      e.preventDefault();
      window.location.href = `mailto:${mail}`;
    },
    []
  );

  const handleConfirmDeleteQuotation = useCallback(async () => {
    try {
      const res = await handleDeleteQuotation(idDelete);
      if (res.response.status === 200) {
        setIdDelete("");
        handleCloseDeleteQuotationModal();
        notification(
          "Success",
          "Deleted the quotations successfully",
          "success"
        );
        location.reload();
      }
    } catch (error) {
      return;
    }
  }, [
    handleCloseDeleteQuotationModal,
    handleDeleteQuotation,
    idDelete,
    location,
    notification,
  ]);

  const renderModal = useCallback(() => {
    if (isVisibleDeleteQuotationModal) {
      return (
        <DeleteTheQuotationModal
          handleClickCancelButton={handleCloseDeleteQuotationModal}
          handleClickConfirmButton={() => handleConfirmDeleteQuotation()}
        />
      );
    }

    return null;
  }, [
    handleCloseDeleteQuotationModal,
    handleConfirmDeleteQuotation,
    isVisibleDeleteQuotationModal,
  ]);

  const renderTableBody = useCallback(() => {
    if (isLoading) {
      return (
        <Table.Body className="flex w-full h-full absolute items-center justify-center mt-10">
          <Table.Row className="border-none">
            <Table.HeadCell>
              <Spinner size={"large"} variant={"secondary"} />
            </Table.HeadCell>
          </Table.Row>
        </Table.Body>
      );
    }

    if (!quotations || !quotations.length) {
      return <NoRecordTable />;
    }

    return (
      <Table.Body {...getTableBodyProps()}>
        {rows.map((row, index) => {
          prepareRow(row);
          return (
            <Table.Row
              color={"inherit"}
              linkTo={`${SUB_TAB.QUOTATION_DETAILS}/${row.original.id}`}
              actions={[
                {
                  label: "Revise",
                  onClick: () =>
                    navigate(`${SUB_TAB.REVISE_QUOTATION}/${row.original.id}`),
                  icon: <EditIcon size={20} />,
                },
                {
                  label: "Download",
                  onClick: () => handleSetFormData(row.original),
                  icon: <DownloadIcon size={20} />,
                },
                {
                  label: "Email",
                  onClick: (
                    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                  ) => handleSendMail(e, row?.original?.customer?.email),
                  icon: <MailIcon size={20} />,
                },
                {
                  label: "Delete Quotation",
                  variant: "danger",
                  onClick: () => {
                    setIdDelete(row.original.id);
                    handleOpenDeleteQuotationModal();
                  },
                  icon: <TrashIcon size={20} />,
                },
              ]}
              {...row.getRowProps()}
              key={index}
            >
              {row.cells.map((cell, index) => {
                return cell.render("Cell", { index });
              })}
            </Table.Row>
          );
        })}
      </Table.Body>
    );
  }, [
    isLoading,
    quotations,
    getTableBodyProps,
    rows,
    prepareRow,
    handleSetFormData,
    handleSendMail,
    handleOpenDeleteQuotationModal,
  ]);

  return (
    <div className="w-full overflow-y-auto flex flex-col justify-between min-h-[300px] h-full">
      <Table
        enableSearch
        handleSearch={handleSetQuery}
        searchValue={filters.q}
        {...getTableProps()}
        className={clsx({ ["relative"]: isLoading })}
      >
        <Table.Head>
          {headerGroups?.map((headerGroup) => (
            <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((col) => (
                <Table.HeadCell
                  {...col.getHeaderProps()}
                  // onClick={() =>
                  //   handleSorting(
                  //     col.id,
                  //     col.disableSortBy,
                  //     col.isSortedDesc,
                  //     true
                  //   )
                  // }
                >
                  <span className="flex items-center">
                    {col.render("Header")}
                    {/* {col.isSorted && (
                      <SortingIcon
                        color="#a0a0a0"
                        size="20"
                        descendingColor={col.isSortedDesc ? "#111827" : ""}
                        ascendingColor={!col.isSortedDesc ? "#111827" : ""}
                      />
                    )} */}
                  </span>
                </Table.HeadCell>
              ))}
            </Table.HeadRow>
          ))}
        </Table.Head>
        {renderTableBody()}
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
      {renderModal()}
    </div>
  );
};

export default QuotationTable;
