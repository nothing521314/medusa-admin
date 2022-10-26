import React, { useCallback, useContext } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Button from "src/components/fundamentals/button";
import { AccountContext } from "src/context/account";
import { CartContext } from "@medusa-react";
import { Region } from "@medusa-types";
import { RegionsContext } from "src/context/region";

export const SelectionRegion = () => {
  const { selectedRegion, handleSelectRegion } = useContext(AccountContext);
  const { regions } = useContext(RegionsContext);
  const { handleSetListProduct } = useContext(CartContext);

  const handleClickSelectRegion = useCallback(
    (item: Region) => {
      if (!handleSelectRegion) return;
      if (selectedRegion?.name === item.name) return;
      handleSelectRegion(item);
      handleSetListProduct && handleSetListProduct([]);
      location.reload();
    },
    [handleSelectRegion, handleSetListProduct, selectedRegion?.name]
  );

  return (
    <div className="flex ml-5">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild className="flex">
          <div className="flex text-xs font-light space-x-2 items-center">
            Market Region:
            <Button variant="ghost" size="small" className="p-0 ml-1  text-xs">
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
                  onClick={() => handleClickSelectRegion(item)}
                >
                  {`${item.name}/${item.currency_code.toUpperCase()}`}
                </Button>
              );
            })}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
};
