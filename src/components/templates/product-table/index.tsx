import { Hardware, Product } from "@medusa-types";
import { useLocation } from "@reach/router";
import { navigate } from "gatsby";
import { isEmpty } from "lodash";
import { getProductData } from "src/domain/products/get-one-product";
import qs from "qs";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePagination, useTable } from "react-table";
import CartPlusIcon from "src/components/fundamentals/icons/cart-plus-icon";
import TrashIcon from "src/components/fundamentals/icons/trash-icon";
import ViewListIcon from "src/components/fundamentals/icons/view-list-icon";
import { ActionType } from "src/components/molecules/actionables";
import { AccountContext } from "src/context/account";
import SelectAdditionalHardwareModal from "src/domain/products/components/select-addtional-hardware-modal";
import { useDebounce } from "src/hooks/use-debounce";
import useImperativeDialog from "src/hooks/use-imperative-dialog";
import useNotification from "src/hooks/use-notification";
import useToggleState from "src/hooks/use-toggle-state";
import Medusa from "src/services/api";
import { getErrorMessage } from "src/utils/error-messages";
import { CartContext, useAdminProducts } from "../../../../medusa-react";
import { useFeatureFlag } from "../../../context/feature-flag";
import ProductsFilter from "../../../domain/products/filter-dropdown";
import Table, { TablePagination } from "../../molecules/table";
import { NoRecordTable } from "../no-record-table";
import ProductOverview from "./overview";
import useProductTableColumn from "./use-product-column";
import { useProductFilters } from "./use-product-filters";

const DEFAULT_PAGE_SIZE = 15;
const DEFAULT_PAGE_SIZE_TILE_VIEW = DEFAULT_PAGE_SIZE;

type ProductTableProps = {};

const defaultQueryProps = {
  fields: "id,title,type,thumbnail,status,handle,description,updated_at",
  expand: "variants,options,collection,tags,prices,additional_hardwares,images",
  is_giftcard: false,
  // order: "created_at"
};

const ProductTable: React.FC<ProductTableProps> = () => {
  const location = useLocation();
  const { selectedRegion, isAdmin } = useContext(AccountContext);
  const {
    handleAddToCart,
    handleAddHarwareToCart,
  } = React.useContext(CartContext);

  const { isFeatureEnabled } = useFeatureFlag();
  const dialog = useImperativeDialog();
  const notification = useNotification();

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

  const [query, setQuery] = useState(queryObject.query);
  const [showList, setShowList] = React.useState(false);
  const [hardwaresList, setHardWaresList] = React.useState<Hardware[]>([]);
  const [productData, setProductData] = React.useState<Product>();

  const clearFilters = useCallback(() => {
    reset();
    setQuery("");
  }, [reset]);

  const queryDebounce = useDebounce(queryObject, 400);

  const {
    products,
    isLoading,
    isRefetching,
    count,
    refetch,
  } = useAdminProducts({
    ...queryDebounce,
  });

  const { offs, limit } = useMemo(() => {
    return {
      offs: queryDebounce.offset || 0,
      limit: queryDebounce.limit,
    };
  }, [queryDebounce.limit, queryDebounce.offset]);

  const numPages = useMemo(() => {
    if (typeof count !== "undefined") {
      return Math.ceil(count / queryObject.limit);
    }
    return 0;
  }, [count, queryObject.limit]);

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

  const {
    open: handleOpenHardwareModal,
    close: handleCloseHardwareModal,
    state: isOpenHardwareModal,
  } = useToggleState(false);

  const [hardwares, setHardWares] = useState<Hardware[]>([]);

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

  const handleClickAddToCartBtn = React.useCallback(
    async (prodId: string) => {
      const { child_product, product: productData } = await getProductData(
        prodId
      );

      const childHavePrice = child_product?.filter((item) => {
        const price = item?.prices?.find(
          (reg) => (reg as { label?: string })?.label === selectedRegion?.id
        );
        return !!price;
      });
      if (childHavePrice.length) {
        setProductData(productData);
        handleOpenHardwareModal();
        setHardWaresList([...childHavePrice]);
      } else {
        handleAddToCart && handleAddToCart({ ...productData });
      }
    },
    [handleAddToCart, handleOpenHardwareModal, selectedRegion?.id]
  );

  const handleDelete = React.useCallback(
    async (prodId: string) => {
      const shouldDelete = await dialog({
        heading: "Delete Product",
        text: "Are you sure you want to delete this product?",
      });
      if (shouldDelete) {
        try {
          const res = await Medusa.products.delete(prodId);
          if (res.status === 200) {
            notification("Deleted", "Successfully deleted product", "success");
          }
        } catch (error) {
          notification("Error", getErrorMessage(error), "error");
        }
      }
    },
    [dialog, notification]
  );

  const getActions = useCallback(
    (mode: "grid" | "table" = "grid", prodId: string): ActionType[] => {
      const l: ActionType[] = [
        {
          label: "Details",
          onClick: () => navigate(`/a/products/${prodId}`),
          icon: <ViewListIcon size={20} />,
        },
      ];

      mode === "table" &&
        l.push({
          label: "Add To Cart",
          onClick: () => handleClickAddToCartBtn(prodId),
          icon: <CartPlusIcon size={20} />,
        });

      isAdmin &&
        l.push({
          label: "Delete Product",
          variant: "danger",
          onClick: () => handleDelete(prodId),
          icon: <TrashIcon size={20} />,
        });

      return l;
    },
    [handleClickAddToCartBtn, handleDelete, isAdmin]
  );

  const handleSubmitAdd = useCallback(
    (hw) => {
      if (!productData) return;
      console.log(productData);
      
      handleAddToCart && handleAddToCart(productData);
      setHardWares(hw);
    },
    [handleAddToCart, productData]
  );

  useEffect(() => {
    if (!hardwares.length) return;
    if (!productData?.id) return;
    try {
      handleAddHarwareToCart?.(productData.id, hardwares);
      setHardWares([]);
    } catch (error) {
      console.log(error);
    }
  }, [handleAddHarwareToCart, hardwares, productData?.id]);

  return (
    <div className="w-full overflow-y-auto flex flex-col justify-between min-h-[300px] h-full  ">
      <>
        <Table
          filteringOptions={
            <ProductsFilter
              filters={filters}
              submitFilters={setFilters}
              clearFilters={clearFilters}
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
                    return (
                      <Table.Row
                        color={"inherit"}
                        linkTo={`/a/products/${row.original.id}`}
                        actions={getActions("table", row.original.id!)}
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
            </>
          ) : (
            <ProductOverview
              products={products as Product[]}
              toggleListView={setListView}
              getActions={getActions as any}
              handleClickAddToCartBtn={handleClickAddToCartBtn}
            />
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
      {isOpenHardwareModal && hardwaresList && (
        <SelectAdditionalHardwareModal
          hardwareList={hardwaresList}
          isOpen={isOpenHardwareModal}
          handleClose={handleCloseHardwareModal}
          handleSubmit={handleSubmitAdd}
        />
      )}
    </div>
  );
};

export default ProductTable;
