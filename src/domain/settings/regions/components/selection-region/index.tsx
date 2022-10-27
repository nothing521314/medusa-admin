import { CartContext } from "@medusa-react";
import { Region } from "@medusa-types";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import clsx from "clsx";
import React, { useCallback, useContext, useState } from "react";
import Button from "src/components/fundamentals/button";
import ChevronDownIcon from "src/components/fundamentals/icons/chevron-down";
import { AccountContext } from "src/context/account";
import { RegionsContext } from "src/context/region";

type Props = {
  className?: string;
};

export const SelectionRegion = ({ className }: Props) => {
  const { selectedRegion, handleSelectRegion } = useContext(AccountContext);
  const { regions } = useContext(RegionsContext);
  const { handleSetListProduct } = useContext(CartContext);

  const [isToggle, setIsToggle] = useState<boolean>(false);

  const handleClickSelectRegion = useCallback(
    (item: Region) => {
      if (!handleSelectRegion) return;
      if (selectedRegion?.name === item.name) return;
      handleSelectRegion(item);
      handleSetListProduct && handleSetListProduct([]);
    },
    [handleSelectRegion, handleSetListProduct, selectedRegion?.name]
  );

  return (
    <div className={clsx(className)}>
      <DropdownMenu.Root
        open={isToggle}
        onOpenChange={() => setIsToggle((prev) => !prev)}
      >
        <DropdownMenu.Trigger asChild className="flex">
          <div
            className={clsx(
              "p-2 flex items-center gap-2 cursor-pointer",
              "text-xs font-semibold"
            )}
          >
            <div className="text-xs font-light">Market Region:</div>
            {selectedRegion?.name || "Select"}
            <ChevronDownIcon
              size={16}
              className={clsx("transition-transform duration-100", {
                "rotate-180": isToggle,
              })}
            />
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
