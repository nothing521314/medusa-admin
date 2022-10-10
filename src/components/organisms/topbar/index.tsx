import { useCart } from "@medusa-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { navigate } from "gatsby";
import React, { useCallback, useContext, useMemo, useState } from "react";
import CartIcon from "src/components/fundamentals/icons/cart-icon";
import useToggleState from "src/hooks/use-toggle-state";
import { AccountContext } from "../../../context/account";
import Avatar from "../../atoms/avatar";
import Button from "../../fundamentals/button";
import GearIcon from "../../fundamentals/icons/gear-icon";
import HelpCircleIcon from "../../fundamentals/icons/help-circle";
import SignOutIcon from "../../fundamentals/icons/log-out-icon";
import SearchBar from "../../molecules/search-bar";
import CanNotMakeQuotationModal from "../can-not-make-quotation-modal";
import MailDialog from "../help-dialog";

const Topbar: React.FC = () => {
  const { first_name, last_name, email, handleLogout } = useContext(
    AccountContext
  );

  const { cart } = useCart();

  const {
    open: openCanNotMakeQuoteModal,
    close: closeCanNotMakeQuoteModal,
    state: canNotMakeQuoteModalOpen,
  } = useToggleState(false);

  const totalCart = useMemo(() => {
    if (!cart) {
      return 0;
    }
    return cart.items.reduce((sum, i) => sum + i.quantity, 0);
  }, [cart]);

  const [showSupportform, setShowSupportForm] = useState(false);

  const handleClickCartIcon = useCallback(() => {
    if (totalCart) {
      console.log("aa");
    } else {
      openCanNotMakeQuoteModal();
    }
  }, [openCanNotMakeQuoteModal, totalCart]);

  const logOut = useCallback(() => {
    handleLogout();
    navigate("/login");
  }, [handleLogout]);

  return (
    <div className="w-full min-h-topbar max-h-topbar pr-xlarge pl-base bg-grey-0 border-b border-grey-20 sticky top-0 flex items-center justify-between z-40">
      <SearchBar />
      <div className="flex items-center">
        <Button
          size="small"
          variant="ghost"
          className="w-8 h-8 mr-3"
          onClick={() => setShowSupportForm(!showSupportform)}
        >
          <HelpCircleIcon size={24} />
        </Button>

        <Button
          size="small"
          variant="ghost"
          className="w-8 h-8 mr-3"
          onClick={handleClickCartIcon}
        >
          <CartIcon size={24} />
          <span>{totalCart ? totalCart : ""}</span>
        </Button>

        <div className="ml-large w-large h-large">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <div className="cursor-pointer w-full h-full">
                <Avatar
                  user={{ first_name, last_name, email }}
                  color="bg-fuschia-40"
                />
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
                  className={"w-full justify-start"}
                  onClick={() => navigate("/a/settings")}
                >
                  <GearIcon />
                  Settings
                </Button>
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
        </div>
      </div>
      {showSupportform && (
        <MailDialog
          open={showSupportform}
          onClose={() => setShowSupportForm(false)}
        />
      )}
      {canNotMakeQuoteModalOpen && (
        <CanNotMakeQuotationModal
          handleClose={closeCanNotMakeQuoteModal}
          onSubmit={closeCanNotMakeQuoteModal}
        />
      )}
    </div>
  );
};

export default Topbar;
