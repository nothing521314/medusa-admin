import { RouteComponentProps } from "@reach/router";
import ReactDOM from "react-dom";
import clsx from "clsx";
import moment from "moment";
import React, { useCallback, useMemo } from "react";
import Table from "src/components/molecules/table";
import { formatAmountWithSymbol } from "src/utils/prices";
import { IQuotationDetailForm } from "../details";

export interface TPrintQuotationFromModal
  extends RouteComponentProps<{ id: string; tab: string }>,
    React.HTMLAttributes<HTMLDivElement> {
  formData?: IQuotationDetailForm;
  className?: string;
}

const PrintQuotationFrom = ({
  formData,
  className,
}: TPrintQuotationFromModal) => {
  const renderText = useCallback((text?: string): string => {
    if (!text) return "";
    return text.replace(/\r?\n/g, "<br />");
  }, []);

  const summary = useMemo(() => {
    return (formData?.summary as any[])?.map((item) => {
      const child_product = item?.child_product?.map((child) => {
        return {
          ...child,
          total: (child.priceItem || 0) * (child.quantity || 0),
        };
      });
      return {
        ...item,
        total: (item.priceItem || 0) * (item.quantity || 0),
        subTotalChild: child_product.reduce((pre, cur) => pre + cur.total, 0),
        subTotal:
          (item.priceItem || 0) * (item.quantity || 0) +
          child_product.reduce((pre, cur) => pre + cur.total, 0),
        child_product,
        count: child_product?.length + 1,
      };
    });
  }, [formData?.summary]);

  const total = useMemo(() => {
    return summary?.reduce((pre, cur) => pre + cur.subTotal, 0) || 0;
  }, [summary]);

  const getNoNum = useCallback((index: number, arr: any, indexChild = 0) => {
    return (
      arr.slice(0, index).reduce((pre, cur) => pre + cur.count, 0) +
        1 +
        indexChild || 0
    );
  }, []);

  return ReactDOM.createPortal(
    <div
      className={clsx("w-full h-full relative table", className)}
      id="print-quote"
      style={{
        printColorAdjust: "exact",
      }}
    >
      <div className="table-header-group">
        <img src={formData?.header?.header} alt="" className="w-3/4 px-[1cm] mt-[1cm]" />
        <div className="flex justify-between items-center text-sm px-[1.5cm]">
          <div>Our Ref: QM-5542-2022</div>
          <div>{moment(formData?.createdAt).format("DD MMMM YYYY")}</div>
        </div>
      </div>
      <div className="w-full overflow-visible table-row-group">
        <div className="table-cell px-[1.5cm]">
          <div className="mt-2">
            <div className="font-semibold text-sm">
              Customer Name: {formData?.customer?.name}
            </div>
            <div className="text-sm h-5">
              Customer Address: {formData?.customer?.address}
            </div>
          </div>
          <div className="mt-2 text-sm">
            Dear {`${formData?.customer?.person_in_charge},`}
          </div>
          <div className="mt-2 border-y-4 border-black font-semibold py-2 text-sm">
            {`Quotation for ${summary?.[0]?.product?.title}`}
          </div>
          <div className="mt-2 text-justify text-sm">
            We are pleased to submit our quotation for your consideration.
            Please see details of the proposal as below:
          </div>
          {/* Table Price */}
          <Table className="!border-[2px] border-black">
            <Table.Head className="!border-[2px] border-black">
              <Table.HeadRow className="!border-[2px] border-black bg-[#DDEBF7]">
                <Table.HeadCell className="text-center border-black !text-black">
                  No.
                </Table.HeadCell>
                <Table.HeadCell className="border-l-[2px] text-center border border-black !text-black !w-2/5">
                  Product Description
                </Table.HeadCell>
                <Table.HeadCell className="border-l-[2px] border-t-[2px] text-center border-black !text-black">
                  Qty
                </Table.HeadCell>
                <Table.HeadCell className="border-l-[2px] border-t-[2px] text-center border-black !text-black">
                  List Price (
                  {(formData?.region?.currency_code || "").toUpperCase()})
                </Table.HeadCell>
                <Table.HeadCell className="border-l-[2px] border-t-[2px] text-center border-black !text-black">
                  Unit Price (
                  {(formData?.region?.currency_code || "").toUpperCase()})
                </Table.HeadCell>
                <Table.HeadCell className="border-l-[2px] border-t-[2px] text-center border-black !text-black">
                  Total ({(formData?.region?.currency_code || "").toUpperCase()}
                  )
                </Table.HeadCell>
              </Table.HeadRow>
            </Table.Head>
            <Table.Body>
              {(summary as any[])?.map((item, index) => {
                return (
                  <React.Fragment key={index}>
                    <Table.Row className="!border-b-0 !border-[2px] border-black">
                      <Table.Cell className="text-center border-l-[2px] border-black">
                        {getNoNum(index, summary)}
                      </Table.Cell>
                      <Table.Cell className="font-semibold border-l-[2px] px-4 border-black !w-2/5">
                        {item.title}
                      </Table.Cell>
                      <Table.Cell className="border-l-[2px] text-center border-black">
                        {item.quantity}
                      </Table.Cell>
                      <Table.Cell className="border-l-[2px] px-4 border-black text-right">
                        {formatAmountWithSymbol({
                          amount: item.priceItem,
                          currency: formData?.region?.currency_code || "usd",
                          digits: 2,
                          showPrefix: false,
                          tax: formData?.region?.tax_rate || 0,
                        })}
                      </Table.Cell>
                      <Table.Cell className="border-l-[2px] px-4 border-black text-right">
                        {formatAmountWithSymbol({
                          amount: item.priceItem,
                          currency: formData?.region?.currency_code || "usd",
                          digits: 2,
                          showPrefix: false,
                          tax: formData?.region?.tax_rate || 0,
                        })}
                      </Table.Cell>
                      <Table.Cell className="border-l-[2px] px-4 border-black text-right">
                        {formatAmountWithSymbol({
                          amount: item.total,
                          currency: formData?.region?.currency_code || "usd",
                          digits: 2,
                          showPrefix: false,
                          tax: formData?.region?.tax_rate || 0,
                        })}
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row className="!border-none">
                      <Table.Cell className="!h-fit"></Table.Cell>
                      <Table.Cell className="border-l-[2px] px-4 border-black font-normal !h-fit text-sm !w-2/5">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderText(item?.description),
                          }}
                        />
                      </Table.Cell>
                      <Table.Cell className="border-l-[2px] px-4 border-black !h-fit"></Table.Cell>
                      <Table.Cell className="border-l-[2px] px-4 border-black !h-fit"></Table.Cell>
                      <Table.Cell className="border-l-[2px] px-4 border-black !h-fit"></Table.Cell>
                      <Table.Cell className="border-l-[2px] px-4 border-black !h-fit"></Table.Cell>
                    </Table.Row>
                    {item?.game?.length ? (
                      <Table.Row className="!border-none mt-2">
                        <Table.Cell className="!h-fit"></Table.Cell>
                        <Table.Cell className="border-l-[2px] px-4 border-black !h-fit italic font-semibold text-sm">
                          Games Selected:
                        </Table.Cell>
                        <Table.Cell className="border-l-[2px] px-4 border-black !h-fit"></Table.Cell>
                        <Table.Cell className="border-l-[2px] px-4 border-black !h-fit"></Table.Cell>
                        <Table.Cell className="border-l-[2px] px-4 border-black !h-fit"></Table.Cell>
                        <Table.Cell className="border-l-[2px] px-4 border-black !h-fit"></Table.Cell>
                      </Table.Row>
                    ) : null}
                    {item.game?.map((name, indexG) => (
                      <Table.Row className="!border-none mt-2" key={indexG}>
                        <Table.Cell className="!h-fit"></Table.Cell>
                        <Table.Cell className="border-l-[2px] border-black !h-fit px-4 italic !w-2/5">
                          - {name}
                        </Table.Cell>
                        <Table.Cell className="border-l-[2px] px-4 border-black !h-fit"></Table.Cell>
                        <Table.Cell className="border-l-[2px] px-4 border-black !h-fit"></Table.Cell>
                        <Table.Cell className="border-l-[2px] px-4 border-black !h-fit"></Table.Cell>
                        <Table.Cell className="border-l-[2px] px-4 border-black !h-fit"></Table.Cell>
                      </Table.Row>
                    ))}
                    {item.child_product.length ? (
                      <Table.Row className="!border-[2px] border-black bg-[#f8e5d8]">
                        <Table.Cell className="!h-fit"></Table.Cell>
                        <Table.Cell className="font-semibold border-l-[2px] border-black !h-fit px-4">
                          Subtotal
                        </Table.Cell>
                        <Table.Cell className="font-semibold border-l-[2px] border-black !h-fit px-4"></Table.Cell>
                        <Table.Cell className="font-semibold border-l-[2px] border-black !h-fit px-4"></Table.Cell>
                        <Table.Cell className="font-semibold border-l-[2px] border-black !h-fit px-4"></Table.Cell>
                        <Table.Cell className="font-semibold border-l-[2px] border-black !h-fit px-4 text-right">
                          {formatAmountWithSymbol({
                            amount: item.total,
                            currency: formData?.region?.currency_code || "usd",
                            digits: 2,
                            showPrefix: false,
                            tax: formData?.region?.tax_rate || 0,
                          })}
                        </Table.Cell>
                      </Table.Row>
                    ) : null}
                    {item.child_product.map((child, indexChild) => {
                      return (
                        <React.Fragment key={indexChild}>
                          <Table.Row className="">
                            <Table.Cell className="text-center border-l-[2px] border-black">
                              {getNoNum(index, summary, indexChild + 1)}
                            </Table.Cell>
                            <Table.Cell className="border-l-[2px] px-4 border-black !w-2/5">{`- ${child.title}`}</Table.Cell>
                            <Table.Cell className="border-l-[2px] text-center border-black">
                              {child.quantity}
                            </Table.Cell>
                            <Table.Cell className="border-l-[2px] px-4 border-black text-right">
                              {formatAmountWithSymbol({
                                amount: child.priceItem,
                                currency:
                                  formData?.region?.currency_code || "usd",
                                digits: 2,
                                showPrefix: false,
                                tax: formData?.region?.tax_rate || 0,
                              })}
                            </Table.Cell>
                            <Table.Cell className="border-l-[2px] px-4 border-black text-right">
                              {formatAmountWithSymbol({
                                amount: child.priceItem,
                                currency:
                                  formData?.region?.currency_code || "usd",
                                digits: 2,
                                showPrefix: false,
                                tax: formData?.region?.tax_rate || 0,
                              })}
                            </Table.Cell>
                            <Table.Cell className="border-l-[2px] px-4 border-black text-right">
                              {formatAmountWithSymbol({
                                amount: child.total,
                                currency:
                                  formData?.region?.currency_code || "usd",
                                digits: 2,
                                showPrefix: false,
                                tax: formData?.region?.tax_rate || 0,
                              })}
                            </Table.Cell>
                          </Table.Row>
                          {item.child_product?.length > 1 ? (
                            <Table.Row className="!border-[2px] border-black bg-[#f8e5d8]">
                              <Table.Cell></Table.Cell>
                              <Table.Cell className="font-semibold border-l-[2px] border-black px-4">
                                Subtotal
                              </Table.Cell>
                              <Table.Cell className="font-semibold border-l-[2px] border-black px-4"></Table.Cell>
                              <Table.Cell className="font-semibold border-l-[2px] border-black px-4"></Table.Cell>
                              <Table.Cell className="font-semibold border-l-[2px] border-black px-4"></Table.Cell>
                              <Table.Cell className="font-semibold border-l-[2px] border-black px-4 text-right">
                                {formatAmountWithSymbol({
                                  amount: item.subTotalChild,
                                  currency:
                                    formData?.region?.currency_code || "usd",
                                  digits: 2,
                                  showPrefix: false,
                                  tax: formData?.region?.tax_rate || 0,
                                })}
                              </Table.Cell>
                            </Table.Row>
                          ) : null}
                        </React.Fragment>
                      );
                    })}
                  </React.Fragment>
                );
              })}
              <Table.Row className="!border-[2px] border-black bg-[#ffff54]">
                <Table.Cell></Table.Cell>
                <Table.Cell className="font-semibold border-l-[2px] border-black px-4">
                  Total
                </Table.Cell>
                <Table.Cell className="font-semibold border-l-[2px] border-black px-4"></Table.Cell>
                <Table.Cell className="font-semibold border-l-[2px] border-black px-4"></Table.Cell>
                <Table.Cell className="font-semibold border-l-[2px] border-black px-4"></Table.Cell>
                <Table.Cell className="font-semibold border-l-[2px] border-black px-4 text-right">
                  {formatAmountWithSymbol({
                    amount: total,
                    currency: formData?.region?.currency_code || "usd",
                    digits: 2,
                    showPrefix: false,
                    tax: formData?.region?.tax_rate || 0,
                  })}
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>

          <div className="font-semibold mt-2 underline text-sm">
            Quotation Conditions
          </div>
          <div
            className="mt-1 text-justify w-full text-sm"
            dangerouslySetInnerHTML={{
              __html: renderText(formData?.quotationConditions),
            }}
          />

          <div className="font-semibold mt-2 underline text-sm">
            Payment Terms
          </div>
          <div
            className="mt-1 text-justify w-full text-sm"
            dangerouslySetInnerHTML={{
              __html: renderText(formData?.paymentTerms),
            }}
          />

          <div className="font-semibold mt-2 underline text-sm">
            Delivery Lead Time
          </div>
          <div
            className="mt-1 text-justify w-full text-sm"
            dangerouslySetInnerHTML={{
              __html: renderText(formData?.deliveryLeadTime),
            }}
          />

          <div className="font-semibold mt-2 underline text-sm">Warranty</div>
          <div
            className="mt-1 text-justify w-full text-sm"
            dangerouslySetInnerHTML={{
              __html: renderText(formData?.warranty),
            }}
          />

          <div className="font-semibold mt-2 underline text-sm">
            Installation Support
          </div>
          <div
            className="mt-1 text-justify w-full text-sm"
            dangerouslySetInnerHTML={{
              __html: renderText(formData?.installationSupport),
            }}
          />

          <div className="font-semibold mt-2 underline text-sm">Appendix A</div>
          <div
            className="mt-1 text-justify w-full text-sm"
            dangerouslySetInnerHTML={{
              __html: renderText(formData?.appendixA),
            }}
          />

          <div className="font-semibold mt-2 underline text-sm">Appendix B</div>
          <div
            className="mt-1 text-justify w-full text-sm"
            dangerouslySetInnerHTML={{
              __html: renderText(formData?.appendixB),
            }}
          />
        </div>
      </div>
      <div className="table-footer-group invisible">
        <img src={formData?.header?.footer} alt="" />
      </div>
      <div className="table-footer-group fixed bottom-0">
        <img src={formData?.header?.footer} alt="" className="w-3/4 px-[1cm]" />
      </div>
    </div>,
    document.body
  );
};

export default PrintQuotationFrom;
