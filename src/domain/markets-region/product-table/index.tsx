import { CartContext, useAdminRegionsListProduct } from "@medusa-react";
import { Hardware, Product, Region } from "@medusa-types";
import { useLocation } from "@reach/router";
import { isEmpty } from "lodash";
import qs from "qs";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { usePagination, useTable } from "react-table";
import Button from "src/components/fundamentals/button";
import TrashIcon from "src/components/fundamentals/icons/trash-icon";
import Table, { TablePagination } from "src/components/molecules/table";
import useToggleState from "src/hooks/use-toggle-state";
import { useFeatureFlag } from "../../../context/feature-flag";
import ModalAddProduct from "./modal-add-product";
import useProductActions from "./use-product-actions";
import useProductTableColumn from "./use-product-column";
import { useProductFilters } from "./use-product-filters";

const DEFAULT_PAGE_SIZE = 15;
const DEFAULT_PAGE_SIZE_TILE_VIEW = 18;

type ProductTableProps = {
  id: string;
  region: Region;
};

const defaultQueryProps = {
  // fields: "id,title,type,thumbnail,status,handle,description,updated_at",
  // expand:
  //   "variants,options,variants.prices,variants.options,collection,tags,prices,additional_hardwares,images",
  // is_giftcard: false,
  // order: "created_at"
};

const ProductTable: React.FC<ProductTableProps> = ({ id, region }) => {
  const location = useLocation();
  const {
    open: openModalProduct,
    close: closeModalProduct,
    state: isOpenModalProduct,
  } = useToggleState(false);

  const { handleAdd } = useProductActions(id);

  const { isFeatureEnabled } = useFeatureFlag();

  let hiddenColumns = ["sales_channel"];
  if (isFeatureEnabled("sales_channels")) {
    // defaultQueryProps.expand =
    //   "variants,options,variants.prices,variants.options,collection,tags,sales_channels";
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

  const {
    product: products,
    isLoading,
    isRefetching,
    count,
    status,
  } = useAdminRegionsListProduct(
    id,
    {
      // ...queryObject,
    },
    {
      cacheTime: 0,
    }
  );

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
    region
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
            <>
              <b>Total Products Added</b>: {count}{" "}
            </>
          }
          tableActions={
            <Button variant="secondary" size="small" onClick={openModalProduct}>
              Add Product
            </Button>
          }
          isLoading={isLoading || isRefetching || !products}
          {...getTableProps()}
        >
          {
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
                  return (
                    <ProductRow row={row} id={id} {...row.getRowProps()} />
                  );
                })}
              </Table.Body>
            </>
          }
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
      {isOpenModalProduct && (
        <ModalAddProduct
          listAdded={(products as Product[]) ?? []}
          onClose={closeModalProduct}
          open={isOpenModalProduct}
          region={region}
          onAdd={(product, amount) => {
            handleAdd(product.id!, amount);
          }}
        />
      )}
    </div>
  );
};

const ProductRow = ({ id, row, ...rest }) => {
  const product = row.original;
  const { handleDelete } = useProductActions(id);
  const { handleAddHarwareToCart, productList } = React.useContext(CartContext);

  const [hardwares, setHardWares] = useState<Hardware[]>([]);

  useEffect(() => {
    if (!hardwares.length) return;
    try {
      handleAddHarwareToCart && handleAddHarwareToCart(product.id, hardwares);
      setHardWares([]);
    } catch (error) {
      console.log(error);
    }
  }, [handleAddHarwareToCart, hardwares, product.id, productList.length]);

  return (
    <>
      <Table.Row
        color={"inherit"}
        linkTo={`/a/products/${product.id}`}
        actions={[
          {
            label: "Remove Product",
            variant: "danger",
            onClick: () => handleDelete(product.id, 0),
            icon: <TrashIcon size={20} />,
          },
        ]}
        {...rest}
      >
        {row.cells.map((cell, index) => {
          return (
            <Table.Cell {...cell.getCellProps()}>
              {cell.render("Cell", { index })}
            </Table.Cell>
          );
        })}
      </Table.Row>
    </>
  );
};
export default ProductTable;
