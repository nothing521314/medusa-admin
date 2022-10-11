import { Order } from "@medusajs/medusa";
import * as RadixPopover from "@radix-ui/react-popover";
import moment from "moment";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { CalendarComponent } from "src/components/atoms/date-picker/date-picker";
import Tooltip from "src/components/atoms/tooltip";
import ClipboardCopyIcon from "src/components/fundamentals/icons/clipboard-copy-icon";
import BodyCard from "src/components/organisms/body-card";
import useClipboard from "src/hooks/use-clipboard";
import useNotification from "src/hooks/use-notification";

type Props = {
  order: Order;
  date: string | null;
  onDateChange: (date: string) => void;
};

const SaleMalePanel = ({ order, date, onDateChange }: Props) => {
  const notification = useNotification();

  const [, handleCopy] = useClipboard(`${order?.display_id!}`, {
    successDuration: 5500,
    onCopied: () => notification("Success", "Order ID copied", "success"),
  });

  const [, handleCopyEmail] = useClipboard(order?.email!, {
    successDuration: 5500,
    onCopied: () => notification("Success", "Email copied", "success"),
  });

  useHotkeys("command+i", handleCopy);

  return (
    <BodyCard
      className={"w-full mb-4 min-h-[200px]"}
      customHeader={
        <Tooltip side="top" content={"Copy ID"}>
          <button
            className="inter-xlarge-semibold text-grey-90 active:text-violet-90 cursor-pointer gap-x-2 flex items-center"
            type="button"
            onClick={handleCopy}
          >
            #{order.display_id} <ClipboardCopyIcon size={16} />
          </button>
        </Tooltip>
      }
      subtitle={order.cart_id}
      status={
        <RadixPopover.Root>
          <RadixPopover.Trigger className="w-full my-1">
            <div className="flex w-full items-center justify-between bg-grey-5 border border-grey-20 rounded inter-small-semibold text-grey-90 px-3 py-1.5">
              {moment(date).format("DD MMM YYYY hh:mm A")}
            </div>
          </RadixPopover.Trigger>
          <RadixPopover.Content
            side="bottom"
            align="start"
            alignOffset={-8}
            sideOffset={20}
            className="flex flex-col bg-grey-0 rounded-rounded shadow-dropdown p-2 top-2/4"
          >
            <CalendarComponent
              date={moment(date).toDate()}
              onChange={onDateChange}
            />
          </RadixPopover.Content>
        </RadixPopover.Root>
      }
      forceDropdown={true}
    >
      <div className="flex mt-6 space-x-6 divide-x justify-between">
        <div className="flex flex-col">
          <div className="inter-smaller-regular text-grey-50 mb-1">
            Sale person
          </div>
          <div>
            {`${order.shipping_address?.first_name} ${order.shipping_address?.last_name}` ||
              "N/A"}
          </div>
        </div>
        <div className="flex flex-col pl-6">
          <div className="inter-smaller-regular text-grey-50 mb-1">Email</div>
          <button
            className="text-grey-90 active:text-violet-90 cursor-pointer gap-x-1 flex items-center"
            type="button"
            onClick={handleCopyEmail}
          >
            {order.email}
            <ClipboardCopyIcon size={12} />
          </button>
        </div>
        <div className="flex flex-col pl-6">
          <div className="inter-smaller-regular text-grey-50 mb-1">Company</div>
          <div>{order.shipping_address?.company || "N/A"}</div>
        </div>
      </div>
    </BodyCard>
  );
};

export default SaleMalePanel;
