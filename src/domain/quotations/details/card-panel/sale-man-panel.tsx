import { User } from "@medusa-types";
import * as RadixPopover from "@radix-ui/react-popover";
import clsx from "clsx";
import moment from "moment";
import React from "react";
import { UseFormRegister } from "react-hook-form";
import { useHotkeys } from "react-hotkeys-hook";
import { CalendarComponent } from "src/components/atoms/date-picker/date-picker";
import Tooltip from "src/components/atoms/tooltip";
import ClipboardCopyIcon from "src/components/fundamentals/icons/clipboard-copy-icon";
import BodyCard from "src/components/organisms/body-card";
import useClipboard from "src/hooks/use-clipboard";
import useNotification from "src/hooks/use-notification";
import { IQuotationDetailForm } from "..";

type Props = {
  state: IQuotationDetailForm;
  register: UseFormRegister<IQuotationDetailForm>;
  saleMan?: User;
  date: string | null;
  minDate?: Date;
  readOnly: boolean;
  onDateChange: (date: Date) => void;
  company: string;
};

const SaleMalePanel = ({
  state,
  date,
  onDateChange,
  saleMan,
  register,
  readOnly,
  company,
  minDate,
}: Props) => {
  const notification = useNotification();

  const [, handleCopy] = useClipboard(`${state.code}`, {
    successDuration: 5500,
    onCopied: () => notification("Success", "Order ID copied", "success"),
  });

  const [, handleCopyEmail] = useClipboard(saleMan?.email!, {
    successDuration: 5500,
    onCopied: () => notification("Success", "Email copied", "success"),
  });

  useHotkeys("command+i", handleCopy);

  return (
    <BodyCard
      className={"w-full mb-4 min-h-[200px]"}
      customHeader={
        <div className="flex flex-row items-center justify-between w-full">
          <div className="max-w-[80%]">
            <Tooltip
              side="top"
              content={`#${state.code}`}
              className="w-fit whitespace-nowrap !max-w-max"
            >
              <button
                className={clsx(
                  "text-grey-90 active:text-violet-90 cursor-pointer gap-x-2 flex items-center",
                  "inter-xlarge-semibold w-full"
                )}
                type="button"
                onClick={handleCopy}
              >
                <div className="text-left overflow-hidden text-ellipsis whitespace-nowrap">
                  #{state.code}
                </div>
                <ClipboardCopyIcon size={16} className="min-w-[16px]" />
              </button>
            </Tooltip>
          </div>
          <div>
            <RadixPopover.Root>
              {readOnly ? (
                <div
                  className={clsx(
                    "flex items-center justify-between px-3 py-1.5",
                    "bg-grey-5 border border-grey-20 rounded",
                    "inter-small-semibold text-grey-90 whitespace-nowrap w-fit"
                  )}
                >
                  {moment(date).format("DD MMM YYYY hh:mm A")}
                </div>
              ) : (
                <RadixPopover.Trigger className="w-full my-1">
                  <div
                    className={clsx(
                      "flex items-center justify-between px-3 py-1.5",
                      "bg-grey-5 border border-grey-20 rounded",
                      "inter-small-semibold text-grey-90 whitespace-nowrap w-fit"
                    )}
                  >
                    {moment(date).format("DD MMM YYYY hh:mm A")}
                  </div>
                </RadixPopover.Trigger>
              )}
              <RadixPopover.Content
                side="bottom"
                align="start"
                alignOffset={-8}
                sideOffset={20}
                className="flex flex-col bg-grey-0 rounded-rounded shadow-dropdown p-2 top-2/4"
              >
                <CalendarComponent
                  date={date ? moment(date).toDate() : new Date()}
                  onChange={onDateChange}
                  minDate={minDate}
                  showTimeInput
                  timeInputLabel="Time:"
                  locale="en"
                  timeFormat="HH:mm a"
                />
              </RadixPopover.Content>
            </RadixPopover.Root>
          </div>
        </div>
      }
      subtitle={
        <input
          readOnly={readOnly}
          placeholder="Please input quotation heading"
          className={clsx(
            "mt-2 outline-none focus-within:outline-none border px-2 py-1 rounded-lg w-full",
            "focus-within:shadow-input focus-within:border-violet-60 focus-within:bg-grey-5"
          )}
          maxLength={100}
          {...register("quotationHeading", { required: true })}
        />
      }
      forceDropdown={true}
    >
      <div className="grid grid-cols-3 mt-6 space-x-6 divide-x justify-between">
        <div className="flex flex-col">
          <div className="inter-smaller-regular text-grey-50 mb-1">
            Sale person
          </div>
          <div>{saleMan?.name}</div>
        </div>
        <div className="flex flex-col pl-6">
          <div className="inter-smaller-regular text-grey-50 mb-1">Email</div>
          <button
            className="text-grey-90 active:text-violet-90 cursor-pointer gap-x-1 flex items-center"
            type="button"
            onClick={handleCopyEmail}
          >
            {saleMan?.email}
            <ClipboardCopyIcon size={12} />
          </button>
        </div>
        <div className="flex flex-col pl-6">
          <div className="inter-smaller-regular text-grey-50 mb-1">Company</div>
          <div>{company || "N/A"}</div>
        </div>
      </div>
    </BodyCard>
  );
};

export default SaleMalePanel;
