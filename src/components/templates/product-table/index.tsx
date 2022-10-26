import { Hardware, Product } from "@medusa-types";
import { useLocation } from "@reach/router";
import { isEmpty } from "lodash";
import qs from "qs";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePagination, useTable } from "react-table";
import { AccountContext } from "src/context/account";
import SelectAdditionalHardwareModal from "src/domain/products/components/select-addtional-hardware-modal";
import { CartContext, useAdminProducts } from "../../../../medusa-react";
import { useFeatureFlag } from "../../../context/feature-flag";
import ProductsFilter from "../../../domain/products/filter-dropdown";
import Spinner from "../../atoms/spinner";
import Table, { TablePagination } from "../../molecules/table";
import { NoRecordTable } from "../no-record-table";
import ProductOverview from "./overview";
import useProductActions from "./use-product-actions";
import useProductTableColumn from "./use-product-column";
import { useProductFilters } from "./use-product-filters";

const DEFAULT_PAGE_SIZE = 15;
const DEFAULT_PAGE_SIZE_TILE_VIEW = 18;

type ProductTableProps = {};

const defaultQueryProps = {
  fields: "id,title,type,thumbnail,status,handle,description,updated_at",
  expand:
    "variants,options,collection,tags,prices,additional_hardwares,images",
  is_giftcard: false,
  // order: "created_at"
};

const ProductTable: React.FC<ProductTableProps> = () => {
  const location = useLocation();
  const { selectedRegion } = useContext(AccountContext);
  const { isFeatureEnabled } = useFeatureFlag();

  let hiddenColumns = ["sales_channel"];
  if (isFeatureEnabled("sales_channels")) {
    defaultQueryProps.expand =
      "variants,options,collection,tags,sales_channels";
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

  const clearFilters = useCallback(() => {
    reset();
    setQuery("");
  }, [reset]);

  const {
    products,
    isLoading,
    isRefetching,
    count,
    refetch,
  } = useAdminProducts({
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

  // Change selectedRegion -> refetch
  useEffect(() => {
    refetch();
  }, [refetch, selectedRegion]);

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

  const hasData = count && count > 0;

  return (
    <div className="w-full overflow-y-auto flex flex-col justify-between min-h-[300px] h-full  ">
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

              {hasData ? (
                <Table.Body {...getTableBodyProps()}>
                  {rows.map((row) => {
                    prepareRow(row);
                    return <ProductRow row={row} {...row.getRowProps()} />;
                  })}
                </Table.Body>
              ) : (
                <NoRecordTable />
              )}
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
  const {
    handleAddToCart,
    handleAddHarwareToCart,
    productList,
  } = React.useContext(CartContext);

  const [hardwares, setHardWares] = useState<Hardware[]>([]);

  const handleSubmitAdd = useCallback(
    (hw) => {
      handleAddToCart && handleAddToCart(product);
      setHardWares(hw);
    },
    [handleAddToCart, product]
  );

  useEffect(() => {
    if (!hardwares.length) return;
    try {
      handleAddHarwareToCart && handleAddHarwareToCart(product.id, [...hardwares]);
      setHardWares([]);
    } catch (error) {
      console.log(error);
    }
  }, [handleAddHarwareToCart, hardwares, product.id, productList.length]);

  return (
    <Table.Row
      color={"inherit"}
      linkTo={`/a/products/${product.id}`}
      actions={getActions("table")}
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
          handleSubmit={handleSubmitAdd}
        />
      )}
    </Table.Row>
  );
};
export default ProductTable;
