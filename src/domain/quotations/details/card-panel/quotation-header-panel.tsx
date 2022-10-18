import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import clsx from "clsx";
import React, { useCallback, useState } from "react";
import Button from "src/components/fundamentals/button";
import ChevronDownIcon from "src/components/fundamentals/icons/chevron-down";
import BodyCard from "src/components/organisms/body-card";
import { quotationHeaderOptions } from "../default-value-form";

type Props = {
  headerSelected: any;
  onChange: (value: any) => void;
  readOnly: boolean;
};

const QuotationHeaderPanel = ({
  headerSelected = quotationHeaderOptions[0],
  onChange,
  readOnly,
}: Props) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const handleToggleDropdown = useCallback(() => {
    if (readOnly) return;
    setIsVisible((pre) => !pre);
  }, [readOnly]);

  const handleSelectQuotationHeader = useCallback(
    (item) => {
      onChange(item);
    },
    [onChange]
  );

  return (
    <BodyCard className="w-full mb-4 min-h-0 h-auto" title="Quotation Header">
      <DropdownMenu.Root open={isVisible} onOpenChange={handleToggleDropdown}>
        <DropdownMenu.Trigger asChild>
          <Button
            variant="secondary"
            className="flex justify-between w-1/4 items-center min-w-[300px]"
          >
            {headerSelected.title || "Select"}
            <ChevronDownIcon
              className={clsx(
                "cursor-pointer transition-transform duration-150",
                { "rotate-180": isVisible }
              )}
            />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          sideOffset={5}
          className="border bg-grey-0 border-grey-20 rounded-rounded shadow-dropdown p-xsmall min-w-full z-30 "
        >
          <DropdownMenu.Item className="mb-1 last:mb-0 hover:outline-none">
            {quotationHeaderOptions.map((item, index) => {
              return (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full !justify-start"
                  onClick={() => {
                    if (headerSelected.title === item.title) return;
                    handleSelectQuotationHeader(item);
                  }}
                >
                  {item.title}
                </Button>
              );
            })}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </BodyCard>
  );
};

export default QuotationHeaderPanel;
