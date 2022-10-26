import React from "react";
import Table from "../molecules/table";

type Props = {} & React.HTMLAttributes<HTMLTableSectionElement>;

export const NoRecordTable = ({ className, ...props }: Props) => {
  return (
    <Table.Body
      className={
        "flex w-full h-full absolute items-center justify-center mt-10 " +
        className
      }
      {...props}
    >
      <Table.Row className="border-none">
        <Table.HeadCell>No record</Table.HeadCell>
      </Table.Row>
    </Table.Body>
  );
};
