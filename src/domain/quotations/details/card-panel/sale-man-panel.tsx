import { useAdminGetSession } from "@medusa-react";
import * as RadixPopover from "@radix-ui/react-popover";
import { TQuotationReturn } from "medusa-types/api/routes/admin/quotations/type";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { CalendarComponent } from "src/components/atoms/date-picker/date-picker";
import Tooltip from "src/components/atoms/tooltip";
import ClipboardCopyIcon from "src/components/fundamentals/icons/clipboard-copy-icon";
import BodyCard from "src/components/organisms/body-card";
import useClipboard from "src/hooks/use-clipboard";
import useNotification from "src/hooks/use-notification";

type Props = {
  quotation?: TQuotationReturn;
  saleMan: any;
  date: string | null;
  onDateChange: (date: string) => void;
};

type TSaleManPanelData = {
  quotation: {
    title: string;
    id: string;
  };
  sale_man: {
    fullname: string;
    email: string;
    company: string;
  };
};

const SaleMalePanel = ({ quotation, saleMan, date, onDateChange }: Props) => {
  const notification = useNotification();

  const { user } = useAdminGetSession();
  const [saleManData, setSaleManData] = useState<TSaleManPanelData>({
    quotation: {
      id: "N/A",
      title: "N/A",
    },
    sale_man: {
      fullname: "N/A",
      company: "N/A",
      email: "N/A",
    },
  });

  const [, handleCopy] = useClipboard(`${quotation?.code!}`, {
    successDuration: 5500,
    onCopied: () => notification("Success", "Order ID copied", "success"),
  });

  const [, handleCopyEmail] = useClipboard(saleMan.email!, {
    successDuration: 5500,
    onCopied: () => notification("Success", "Email copied", "success"),
  });

  useHotkeys("command+i", handleCopy);

  useEffect(() => {
    if (quotation) {
      return setSaleManData({
        quotation: {
          id: quotation.code,
          title: quotation.title,
        },
        sale_man: {
          fullname: saleMan.name,
          company: "N/A",
          email: saleMan.email,
        },
      });
    }
    if (user) {
      return setSaleManData({
        quotation: {
          id: "N/A",
          title: "N/A",
        },
        sale_man: {
          fullname: ((user as unknown) as { name: string }).name || "N/A",
          company: ((user as unknown) as { company: string }).company || "N/A",
          email: user.email,
        },
      });
    }
  }, [quotation, saleMan.email, saleMan.name, user]);

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
            #{saleManData?.quotation.title} <ClipboardCopyIcon size={16} />
          </button>
        </Tooltip>
      }
      subtitle={saleManData?.quotation.id}
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
      <div className="grid grid-cols-3 mt-6 space-x-6 divide-x justify-between">
        <div className="flex flex-col">
          <div className="inter-smaller-regular text-grey-50 mb-1">
            Sale person
          </div>
          <div>{saleManData.sale_man.fullname}</div>
        </div>
        <div className="flex flex-col pl-6">
          <div className="inter-smaller-regular text-grey-50 mb-1">Email</div>
          <button
            className="text-grey-90 active:text-violet-90 cursor-pointer gap-x-1 flex items-center"
            type="button"
            onClick={handleCopyEmail}
          >
            {saleManData.sale_man.email}
            <ClipboardCopyIcon size={12} />
          </button>
        </div>
        <div className="flex flex-col pl-6">
          <div className="inter-smaller-regular text-grey-50 mb-1">Company</div>
          <div>{saleManData.sale_man.company}</div>
        </div>
      </div>
    </BodyCard>
  );
};

export default SaleMalePanel;
