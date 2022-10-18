import { RouteComponentProps } from "@reach/router";
import clsx from "clsx";
import moment from "moment";
import React, { useCallback, useMemo } from "react";
import Table from "src/components/molecules/table";
import { formatAmountWithSymbol } from "src/utils/prices";
import { IQuotationDetailForm } from "../details";
import { THeaderPrint } from "../details/default-value-form";

interface TPrintQuotationFromModal
  extends RouteComponentProps<{ id: string; tab: string }> {
  formData?: IQuotationDetailForm;
  className?: string;
  headerSelected: THeaderPrint;
}

const PrintQuotationFrom = ({
  formData,
  className,
  headerSelected,
}: TPrintQuotationFromModal) => {
  const renderText = useCallback((text?: string): string => {
    if (!text) return "";
    return text.replace(/\r?\n/g, "<br />");
  }, []);

  const summary = useMemo(() => {
    return (formData?.summary as any[])?.map((item) => {
      const child_product = item.child_product.map((child) => {
        return {
          ...child,
          total: (child.priceItem || 0) * (child.quantity || 0),
        };
      });
      return {
        ...item,
        total: (item.priceItem || 0) * (item.quantity || 0),
        subTotal:
          (item.priceItem || 0) * (item.quantity || 0) +
          child_product.reduce((pre, cur) => pre + cur.total, 0),
        child_product,
      };
    });
  }, [formData?.summary]);

  const total = useMemo(() => {
    return summary?.reduce((pre, cur) => pre + cur.subTotal, 0) || 0;
  }, [summary]);

  return (
    <div className={clsx("w-full h-max bg-white", className)}>
      <img src={headerSelected.header} alt="" />
      <div className="w-full h-full px-16">
        <div className="flex justify-between items-center">
          <div>Our Ref: QM-5542-2022</div>
          <div>{moment(formData?.createdAt).format("DD MMMM YYYY")}</div>
        </div>
        <div className="mt-4">
          <div className="font-semibold">
            Customer Name: {formData?.customer?.name}
          </div>
          <div className="">
            Customer Address: {formData?.customer?.address}
          </div>
        </div>
        <div className="mt-4">
          Dear {`${formData?.customer?.person_in_charge},`}
        </div>
        <div className="mt-3 border-y-4 border-black font-semibold py-2">
          {"Quotation for SG EGMs - 26x DUALS X (Link Machines)"}
        </div>
        <div className="mt-3 text-justify">
          We are pleased to submit our quotation for your consideration. Please
          see details of the proposal as below:
        </div>
        {/* Table Price */}
        <Table className="!border-[2px] border-black">
          <Table.Head className="!border-[2px] border-black">
            <Table.HeadRow className="!border-[2px] border-black">
              <Table.HeadCell className="pl-4 border-black">No.</Table.HeadCell>
              <Table.HeadCell className="border-l-[2px] pl-4 border border-black">
                Product Description
              </Table.HeadCell>
              <Table.HeadCell className="border-l-[2px] border-t-[2px] pl-4 border-black">
                Qty
              </Table.HeadCell>
              <Table.HeadCell className="border-l-[2px] border-t-[2px] pl-4 border-black">
                List Price (
                {(formData?.region?.currency_code || "").toUpperCase()})
              </Table.HeadCell>
              <Table.HeadCell className="border-l-[2px] border-t-[2px] pl-4 border-black">
                Unit Price (
                {(formData?.region?.currency_code || "").toUpperCase()})
              </Table.HeadCell>
              <Table.HeadCell className="border-l-[2px] border-t-[2px] pl-4 border-black">
                Total ({(formData?.region?.currency_code || "").toUpperCase()})
              </Table.HeadCell>
            </Table.HeadRow>
          </Table.Head>
          <Table.Body>
            {(summary as any[])?.map((item, index) => {
              return (
                <>
                  <Table.Row className="!border-b-0 !border-[2px] border-black">
                    <Table.Cell className="pl-4 border-l-[2px] border-black">
                      {index + 1}
                    </Table.Cell>
                    <Table.Cell className="font-semibold border-l-[2px] pl-4 border-black">
                      {item.title}
                    </Table.Cell>
                    <Table.Cell className="border-l-[2px] pl-4 border-black">
                      {item.quantity}
                    </Table.Cell>
                    <Table.Cell className="border-l-[2px] pl-4 border-black">
                      {formatAmountWithSymbol({
                        amount: item.priceItem,
                        currency: formData?.region?.currency_code || "usd",
                        digits: 2,
                        tax: formData?.region?.tax_rate || 0,
                      })}
                    </Table.Cell>
                    <Table.Cell className="border-l-[2px] pl-4 border-black">
                      {formatAmountWithSymbol({
                        amount: item.priceItem,
                        currency: formData?.region?.currency_code || "usd",
                        digits: 2,
                        tax: formData?.region?.tax_rate || 0,
                      })}
                    </Table.Cell>
                    <Table.Cell className="border-l-[2px] pl-4 border-black">
                      {formatAmountWithSymbol({
                        amount: item.total,
                        currency: formData?.region?.currency_code || "usd",
                        digits: 2,
                        tax: formData?.region?.tax_rate || 0,
                      })}
                    </Table.Cell>
                  </Table.Row>
                  {item.child_product.map((child) => {
                    return (
                      <Table.Row className="!border-none mt-4">
                        <Table.Cell></Table.Cell>
                        <Table.Cell className="border-l-[2px] pl-4 border-black">{`- ${child.title}`}</Table.Cell>
                        <Table.Cell className="border-l-[2px] pl-4 border-black">
                          {child.quantity}
                        </Table.Cell>
                        <Table.Cell className="border-l-[2px] pl-4 border-black">
                          {formatAmountWithSymbol({
                            amount: child.priceItem,
                            currency: formData?.region?.currency_code || "usd",
                            digits: 2,
                            tax: formData?.region?.tax_rate || 0,
                          })}
                        </Table.Cell>
                        <Table.Cell className="border-l-[2px] pl-4 border-black">
                          {formatAmountWithSymbol({
                            amount: child.priceItem,
                            currency: formData?.region?.currency_code || "usd",
                            digits: 2,
                            tax: formData?.region?.tax_rate || 0,
                          })}
                        </Table.Cell>
                        <Table.Cell className="border-l-[2px] pl-4 border-black">
                          {formatAmountWithSymbol({
                            amount: child.total,
                            currency: formData?.region?.currency_code || "usd",
                            digits: 2,
                            tax: formData?.region?.tax_rate || 0,
                          })}
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                  {item.child_product.filter((child) => child?.game)?.length ? (
                    <Table.Row className="!border-none mt-4">
                      <Table.Cell></Table.Cell>
                      <Table.Cell className="border-l-[2px] pl-4 border-black italic font-semibold">
                        Games Selected:
                      </Table.Cell>
                      <Table.Cell className="border-l-[2px] pl-4 border-black"></Table.Cell>
                      <Table.Cell className="border-l-[2px] pl-4 border-black"></Table.Cell>
                      <Table.Cell className="border-l-[2px] pl-4 border-black"></Table.Cell>
                      <Table.Cell className="border-l-[2px] pl-4 border-black"></Table.Cell>
                    </Table.Row>
                  ) : null}
                  {item.child_product
                    .filter((child) => child?.game)
                    ?.map((child) => (
                      <Table.Row className="!border-none mt-2">
                        <Table.Cell></Table.Cell>
                        <Table.Cell className="border-l-[2px] border-black pl-4 italic">
                          <span className="italic">- {child?.game}</span>
                        </Table.Cell>
                        <Table.Cell className="border-l-[2px] pl-4 border-black"></Table.Cell>
                        <Table.Cell className="border-l-[2px] pl-4 border-black"></Table.Cell>
                        <Table.Cell className="border-l-[2px] pl-4 border-black"></Table.Cell>
                        <Table.Cell className="border-l-[2px] pl-4 border-black"></Table.Cell>
                      </Table.Row>
                    ))}
                  <Table.Row className="!border-[2px] border-black">
                    <Table.Cell></Table.Cell>
                    <Table.Cell className="font-semibold border-l-[2px] border-black pl-4">
                      Subtotal
                    </Table.Cell>
                    <Table.Cell className="font-semibold border-l-[2px] border-black pl-4"></Table.Cell>
                    <Table.Cell className="font-semibold border-l-[2px] border-black pl-4"></Table.Cell>
                    <Table.Cell className="font-semibold border-l-[2px] border-black pl-4"></Table.Cell>
                    <Table.Cell className="font-semibold border-l-[2px] border-black pl-4">
                      {formatAmountWithSymbol({
                        amount: item.subTotal,
                        currency: formData?.region?.currency_code || "usd",
                        digits: 2,
                        tax: formData?.region?.tax_rate || 0,
                      })}
                    </Table.Cell>
                  </Table.Row>
                </>
              );
            })}
            <Table.Row className="!border-[2px] border-black">
              <Table.Cell></Table.Cell>
              <Table.Cell className="font-semibold border-l-[2px] border-black pl-4">
                Total
              </Table.Cell>
              <Table.Cell className="font-semibold border-l-[2px] border-black pl-4"></Table.Cell>
              <Table.Cell className="font-semibold border-l-[2px] border-black pl-4"></Table.Cell>
              <Table.Cell className="font-semibold border-l-[2px] border-black pl-4"></Table.Cell>
              <Table.Cell className="font-semibold border-l-[2px] border-black pl-4">
                {formatAmountWithSymbol({
                  amount: total,
                  currency: formData?.region?.currency_code || "usd",
                  digits: 2,
                  tax: formData?.region?.tax_rate || 0,
                })}
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>

        <div className="font-semibold mt-4 underline">Quotation Conditions</div>
        <div
          className="mt-1 text-justify w-full"
          dangerouslySetInnerHTML={{
            __html: renderText(formData?.quotationConditions),
          }}
        />

        <div className="font-semibold mt-4 underline">Payment Terms</div>
        <div
          className="mt-1 text-justify w-full"
          dangerouslySetInnerHTML={{
            __html: renderText(formData?.paymentTerms),
          }}
        />

        <div className="font-semibold mt-4 underline">Delivery Lead Time</div>
        <div
          className="mt-1 text-justify w-full"
          dangerouslySetInnerHTML={{
            __html: renderText(formData?.deliveryLeadTime),
          }}
        />

        <div className="font-semibold mt-4 underline">Warranty</div>
        <div
          className="mt-1 text-justify w-full"
          dangerouslySetInnerHTML={{
            __html: renderText(formData?.warranty),
          }}
        />

        <div className="font-semibold mt-4 underline">Installation Support</div>
        <div
          className="mt-1 text-justify w-full"
          dangerouslySetInnerHTML={{
            __html: renderText(formData?.installationSupport),
          }}
        />

        <div className="font-semibold mt-4 underline">Appendix A</div>
        <div
          className="mt-1 text-justify w-full"
          dangerouslySetInnerHTML={{
            __html: renderText(formData?.appendixA),
          }}
        />

        <div className="font-semibold mt-4 underline">Appendix B</div>
        <div
          className="mt-1 text-justify w-full"
          dangerouslySetInnerHTML={{
            __html: renderText(formData?.appendixB),
          }}
        />
      </div>
      <img src={headerSelected.footer} alt="" />
    </div>
  );
};

export default PrintQuotationFrom;
