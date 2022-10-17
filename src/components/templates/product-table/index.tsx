import { useLocation } from "@reach/router";
import { isEmpty } from "lodash";
import { CartContext, useAdminProducts } from "../../../../medusa-react";
import qs from "qs";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { usePagination, useTable } from "react-table";
import { useFeatureFlag } from "../../../context/feature-flag";
import ProductsFilter from "../../../domain/products/filter-dropdown";
import Spinner from "../../atoms/spinner";
import Table, { TablePagination } from "../../molecules/table";
import ProductOverview from "./overview";
import useProductActions from "./use-product-actions";
import useProductTableColumn from "./use-product-column";
import { useProductFilters } from "./use-product-filters";
import { Product } from "@medusa-types";
import SelectAdditionalHardwareModal from "src/domain/products/components/select-addtional-hardware-modal";

const DEFAULT_PAGE_SIZE = 15;
const DEFAULT_PAGE_SIZE_TILE_VIEW = 18;

type ProductTableProps = {};

const defaultQueryProps = {
  fields: "id,title,type,thumbnail,status,handle,description,updated_at",
  expand:
    "variants,options,variants.prices,variants.options,collection,tags,prices,additional_hardwares,images",
  is_giftcard: false,
  // order: "created_at"
};

const ProductTable: React.FC<ProductTableProps> = () => {
  const location = useLocation();

  const { isFeatureEnabled } = useFeatureFlag();

  let hiddenColumns = ["sales_channel"];
  if (isFeatureEnabled("sales_channels")) {
    defaultQueryProps.expand =
      "variants,options,variants.prices,variants.options,collection,tags,sales_channels";
    hiddenColumns = [];
  }

  const {
    // removeTab,
    // setTab,
    // saveTab,
    // availableTabs: filterTabs,
    // activeFilterTab,
    reset,
    paginate,
    setFilters,
    setLimit,
    filters,
    setQuery: setFreeText,
    queryObject,
    representationObject,
  } = useProductFilters(location.search, defaultQueryProps);

  const { offs, limit } = useMemo(() => {
    return {
      offs: queryObject.offset || 0,
      limit: queryObject.limit,
    };
  }, [queryObject.limit, queryObject.offset]);

  const [query, setQuery] = useState(queryObject.query);
  const [showList, setShowList] = React.useState(true);

  const clearFilters = () => {
    reset();
    setQuery("");
  };

  const { products, isLoading, isRefetching, count } = useAdminProducts({
    ...queryObject,
  });

  const numPages = useMemo(() => {
    if (typeof count !== "undefined") {
      return Math.ceil(count / limit);
    }
    return 0;
  }, [count, limit]);

  const setTileView = useCallback(() => {
    setLimit(DEFAULT_PAGE_SIZE_TILE_VIEW);
    setShowList(false);
  }, [setLimit]);
  const setListView = useCallback(() => {
    setLimit(DEFAULT_PAGE_SIZE);
    setShowList(true);
  }, [setLimit]);

  const [columns] = useProductTableColumn({
    setTileView,
    setListView,
    showList,
  });

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    gotoPage,
    canPreviousPage,
    canNextPage,
    pageCount,
    nextPage,
    previousPage,
    // Get the state from the instance
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data: (products as Product[]) || [],
      manualPagination: true,
      initialState: {
        pageIndex: Math.floor(offs / limit),
        pageSize: limit,
        hiddenColumns,
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
  }, [gotoPage, query, reset, setFreeText]);

  const handleNext = useCallback(() => {
    if (canNextPage) {
      paginate(1);
      nextPage();
    }
  }, [canNextPage, nextPage, paginate]);

  const handlePrev = useCallback(() => {
    if (canPreviousPage) {
      paginate(-1);
      previousPage();
    }
  }, [canPreviousPage, paginate, previousPage]);

  const updateUrlFromFilter = useCallback((obj = {}) => {
    const stringified = qs.stringify(obj);
    window.history.replaceState("/a/products", "", `${`?${stringified}`}`);
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
    <div className="w-full h-full overflow-y-auto">
      <>
        <Table
          filteringOptions={
            <ProductsFilter
              filters={filters}
              submitFilters={setFilters}
              clearFilters={clearFilters}
              // tabs={filterTabs}
              // onTabClick={setTab}
              // activeTab={activeFilterTab}
              // onRemoveTab={removeTab}
              // onSaveTab={saveTab}
            />
          }
          enableSearch
          handleSearch={setQuery}
          isLoading={isLoading || isRefetching || !products}
          {...getTableProps()}
        >
          {showList ? (
            <>
              <Table.Head>
                {headerGroups?.map((headerGroup) => (
                  <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((col) => (
                      <Table.HeadCell
                        className="min-w-[100px]"
                        {...col.getHeaderProps()}
                      >
                        {col.render("Header")}
                      </Table.HeadCell>
                    ))}
                  </Table.HeadRow>
                ))}
              </Table.Head>

              <Table.Body {...getTableBodyProps()}>
                {rows.map((row) => {
                  prepareRow(row);
                  return <ProductRow row={row} {...row.getRowProps()} />;
                })}
              </Table.Body>
            </>
          ) : (
            <LoadingContainer
              isLoading={isLoading || isRefetching || !products}
            >
              <ProductOverview
                products={products as Product[]}
                toggleListView={setListView}
              />
            </LoadingContainer>
          )}
        </Table>
        <TablePagination
          count={count!}
          limit={limit}
          offset={offs}
          pageSize={offs + rows.length}
          title="Products"
          currentPage={pageIndex + 1}
          pageCount={pageCount}
          nextPage={handleNext}
          prevPage={handlePrev}
          hasNext={canNextPage}
          hasPrev={canPreviousPage}
        />
      </>
    </div>
  );
};

const LoadingContainer = ({ isLoading, children }) => {
  return isLoading ? (
    <div className="w-full pt-2xlarge flex items-center justify-center">
      <Spinner size={"large"} variant={"secondary"} />
    </div>
  ) : (
    children
  );
};

const ProductRow = ({ row, ...rest }) => {
  const product = row.original;
  const {
    getActions,
    isOpenHardwareModal,
    handleCloseHardwareModal,
  } = useProductActions(product);
  const { handleAddToCart } = React.useContext(CartContext);

  return (
    <Table.Row
      color={"inherit"}
      linkTo={`/a/products/${product.id}`}
      actions={getActions()}
      {...rest}
    >
      {row.cells.map((cell, index) => {
        return (
          <Table.Cell {...cell.getCellProps()}>
            {cell.render("Cell", { index })}
          </Table.Cell>
        );
      })}
      {isOpenHardwareModal && (
        <SelectAdditionalHardwareModal
          id={product.id}
          isOpen={isOpenHardwareModal}
          handleClose={handleCloseHardwareModal}
          handleSubmit={(hw) => {
            if (!handleAddToCart) return;
            handleAddToCart({
              ...product,
              additional_hardwares: hw,
            });
          }}
        />
      )}
    </Table.Row>
  );
};
export default ProductTable;
