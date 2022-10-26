import { CartContext } from "@medusa-react";
import { Region } from "@medusa-types";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import clsx from "clsx";
import { navigate } from "gatsby";
import React, { useCallback, useContext, useEffect, useState } from "react";
import CartIcon from "src/components/fundamentals/icons/cart-icon";
import { SUB_TAB } from "src/domain/quotations";
import useToggleState from "src/hooks/use-toggle-state";
import { AccountContext } from "../../../context/account";
import CanNotMakeQuotationModal from "../../../domain/quotations/modal/can-not-make-quotation-modal";
import Avatar from "../../atoms/avatar";
import Button from "../../fundamentals/button";
import SignOutIcon from "../../fundamentals/icons/log-out-icon";
import SearchBar from "../../molecules/search-bar";
import CartDialog from "../cart-dialog";

const Topbar: React.FC = () => {
  const {
    name,
    email,
    handleLogout,
    regions,
    selectedRegion,
    isAdmin,
    handleSelectRegion,
  } = useContext(AccountContext);

  const { totalItems, handleSetListProduct, action } = useContext(CartContext);

  const [animate, setAnimate] = useState<boolean>(false);

  const {
    open: openCanNotMakeQuoteModal,
    close: closeCanNotMakeQuoteModal,
    state: canNotMakeQuoteModalOpen,
  } = useToggleState(false);

  const {
    open: handleOpenCartDiaglog,
    close: handleCloseCartDiaglog,
    state: isOpenCartDialog,
  } = useToggleState(false);

  const handleClickCartIcon = useCallback(() => {
    if (totalItems && action === SUB_TAB.MAKE_QUOTATION) {
      handleOpenCartDiaglog();
    } else {
      openCanNotMakeQuoteModal();
    }
  }, [action, handleOpenCartDiaglog, openCanNotMakeQuoteModal, totalItems]);

  const logOut = useCallback(() => {
    if (!handleLogout) return;
    handleSetListProduct && handleSetListProduct([]);
    handleLogout();
    navigate("/login");
  }, [handleLogout, handleSetListProduct]);

  const handleClickSelectRegion = useCallback(
    (item: Region) => {
      handleSetListProduct && handleSetListProduct([]);
      handleSelectRegion && handleSelectRegion(item);
      location.reload();
    },
    [handleSelectRegion, handleSetListProduct]
  );

  const handleMakeQuotation = useCallback(() => {
    handleCloseCartDiaglog();
    navigate(`/a/quotations/${SUB_TAB.MAKE_QUOTATION}/new-quotation`);
  }, [handleCloseCartDiaglog]);

  useEffect(() => {
    if (totalItems) {
      setAnimate(true);
    }
    setTimeout(() => {
      setAnimate(false);
    }, 150);
  }, [totalItems]);

  const renderRegionMenu = useCallback(() => {
    if (isAdmin) return null;
    if (action === SUB_TAB.REVISE_QUOTATION) return null;

    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <div className="flex space-x-2 mr-3 items-center">
            Market Region:
            <Button variant="ghost" size="small" className="">
              {selectedRegion?.name || "Select"}
            </Button>
          </div>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          sideOffset={5}
          className="border bg-grey-0 border-grey-20 rounded-rounded shadow-dropdown p-xsmall min-w-[200px] z-30"
        >
          <DropdownMenu.Item className="mb-1 last:mb-0">
            {regions.map((item, index) => {
              return (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full !justify-start"
                  onClick={() => {
                    if (selectedRegion?.name === item.name) return;
                    handleClickSelectRegion(item);
                  }}
                >
                  {`${item.name}/${item.currency_code.toUpperCase()}`}
                </Button>
              );
            })}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    );
  }, [action, handleClickSelectRegion, isAdmin, regions, selectedRegion?.name]);

  const renderAccountDetailMenu = useCallback(() => {
    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <div className="cursor-pointer w-full h-full">
            <Avatar user={{ name, email }} color="bg-fuschia-40" />
          </div>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          sideOffset={5}
          className="border bg-grey-0 border-grey-20 rounded-rounded shadow-dropdown p-xsmall min-w-[200px] z-30"
        >
          <DropdownMenu.Item className="mb-1 last:mb-0">
            <Button
              variant="ghost"
              size="small"
              className={"w-full justify-start text-rose-50"}
              onClick={() => logOut()}
            >
              <SignOutIcon size={20} />
              Sign out
            </Button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    );
  }, [email, logOut, name]);

  return (
    <div className="w-full min-h-topbar max-h-topbar pr-xlarge pl-base bg-grey-0 border-b border-grey-20 sticky top-0 flex items-center justify-between z-40">
      <SearchBar />
      <div className="flex items-center">
        {renderRegionMenu()}
        <Button
          size="small"
          variant="ghost"
          className="w-8 h-8 mr-3 relative"
          onClick={handleClickCartIcon}
        >
          <CartIcon size={24} />

          {totalItems && action === SUB_TAB.MAKE_QUOTATION ? (
            <div
              className={clsx(
                "rounded-full bg-green-600 text-white w-4 h-4 text-[10px] font-bold",
                "flex items-center justify-center",
                "absolute right-3 top-0",
                {
                  "animate-ping duration-150": animate,
                }
              )}
            >
              {totalItems}
            </div>
          ) : null}
        </Button>

        <div className="w-large h-large">{renderAccountDetailMenu()}</div>
      </div>
      {canNotMakeQuoteModalOpen && (
        <CanNotMakeQuotationModal
          handleClose={closeCanNotMakeQuoteModal}
          onSubmit={closeCanNotMakeQuoteModal}
        />
      )}
      {isOpenCartDialog && (
        <CartDialog
          onMakeQuotation={handleMakeQuotation}
          onClose={handleCloseCartDiaglog}
          open={isOpenCartDialog}
        />
      )}
    </div>
  );
};

export default Topbar;
