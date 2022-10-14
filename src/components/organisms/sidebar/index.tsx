import React, { useContext, useState } from "react";
import MapPinIcon from "src/components/fundamentals/icons/map-pin-icon";
import { AccountContext } from "src/context/account";
import CustomerIcon from "../../fundamentals/icons/customer-icon";
import DollarSignIcon from "../../fundamentals/icons/dollar-sign-icon";
import TagIcon from "../../fundamentals/icons/tag-icon";
import SidebarCompanyLogo from "../../molecules/sidebar-company-logo";
import SidebarMenuItem from "../../molecules/sidebar-menu-item";

const ICON_SIZE = 18;

const Sidebar: React.FC = () => {
  const [currentlyOpen, setCurrentlyOpen] = useState(-1);
  const { isAdmin } = useContext(AccountContext);

  const triggerHandler = () => {
    const id = triggerHandler.id++;
    return {
      open: currentlyOpen === id,
      handleTriggerClick: () => setCurrentlyOpen(id),
    };
  };
  // We store the `id` counter on the function object, as a state creates
  // infinite updates, and we do not want the variable to be free floating.
  triggerHandler.id = 0;

  return (
    <div className="print:hidden min-w-sidebar max-w-sidebar h-screen overflow-y-auto bg-gray-0 border-r border-grey-20 py-base px-base">
      <div className="h-full ">
        <SidebarCompanyLogo />

        <div className="border-b pb-3.5 border-grey-20">
          <SidebarMenuItem
            pageLink={"/a/quotations"}
            icon={<DollarSignIcon size={ICON_SIZE} />}
            triggerHandler={triggerHandler}
            text={"Quotation"}
          />
          <SidebarMenuItem
            pageLink={"/a/products"}
            icon={<TagIcon size={ICON_SIZE} />}
            text={"Products"}
            triggerHandler={triggerHandler}
          />
          <SidebarMenuItem
            pageLink={"/a/customers"}
            icon={<CustomerIcon size={ICON_SIZE} />}
            triggerHandler={triggerHandler}
            text={"Customers"}
          />
          {isAdmin && (
            <>
              <SidebarMenuItem
                pageLink={"/a/salesman"}
                icon={<CustomerIcon size={ICON_SIZE} />}
                triggerHandler={triggerHandler}
                text={"Salesman"}
              />
              <SidebarMenuItem
                pageLink={"/a/settings/regions"}
                icon={<MapPinIcon size={ICON_SIZE} />}
                triggerHandler={triggerHandler}
                text={"Markets region"}
              />
            </>
          )}
          {/* <SidebarMenuItem
            pageLink={"/a/discounts"}
            icon={<SaleIcon size={ICON_SIZE} />}
            triggerHandler={triggerHandler}
            text={"Discounts"}
          /> */}
          {/* <SidebarMenuItem
            pageLink={"/a/gift-cards"}
            icon={<GiftIcon size={ICON_SIZE} />}
            triggerHandler={triggerHandler}
            text={"Gift Cards"}
          />
          <SidebarMenuItem
            pageLink={"/a/pricing"}
            icon={<CashIcon size={ICON_SIZE} />}
            triggerHandler={triggerHandler}
            text={"Pricing"}
          />
          <SidebarMenuItem
            pageLink={"/a/settings"}
            icon={<GearIcon size={ICON_SIZE} />}
            triggerHandler={triggerHandler}
            text={"Settings"}
          /> */}
        </div>

        {/* <div className="font-semibold mt-5 flex flex-col text-small">
          <SidebarTeam />
        </div> */}
      </div>
    </div>
  );
};

export default Sidebar;
