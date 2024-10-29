import { useInvoiceStore } from "@/store/store";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TableContainer = () => {
  const {
    products,
    total,
    subTotal,
    balance,
    paid,
    couponDiscount,
    paymentMode,
    taxValue,
  } = useInvoiceStore();

  return (
    <>
      <Table
        width="100%"
        className="mb-10 overflow-auto border-collapse border border-gray-300"
      >
        <TableHeader>
          <TableRow className="bg-gray-100 p-1 text-primary border border-gray-300">
            <TableHead className="font-bold border border-gray-300">
              Code
            </TableHead>
            <TableHead className="font-bold border border-gray-300">
              Product Name
            </TableHead>
            <TableHead className="font-bold border border-gray-300">
              Qty
            </TableHead>
            <TableHead className="font-bold border border-gray-300">
              Unit Price
            </TableHead>
            <TableHead className="font-bold border border-gray-300">
              Discount
            </TableHead>
            <TableHead className="font-bold border border-gray-300">
              Total
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products?.map(
            ({
              code,
              productName,
              quantity,
              unitPrice,
              total,
              discount,
              id,
            }) => (
              <TableRow className="h-10 border border-gray-300" key={id}>
                <TableCell className="border border-gray-300">{code}</TableCell>
                <TableCell className="border border-gray-300">
                  {productName}
                </TableCell>
                <TableCell className="border border-gray-300">
                  {quantity}
                </TableCell>
                <TableCell className="border border-gray-300">
                  {unitPrice}
                </TableCell>
                <TableCell className="border border-gray-300">
                  {discount}%
                </TableCell>
                <TableCell className="border border-gray-300 amount">
                  {total}
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-end gap-20">
        <div>
          <div className="">Tax</div>
          {couponDiscount && <div className="">Coupon Discount</div>}
          <div className="">SubTotal</div>
          <div className="text-primary font-medium">Paid</div>
        </div>
        <div className="text-right">
          <div>₹{taxValue}</div>
          {couponDiscount && <div className="">-₹{couponDiscount}</div>}
          <div>₹{subTotal}</div>
          <div className="text-primary font-medium">₹{paid}</div>
        </div>
      </div>

      <div className="flex gap-10">
        <div className="font-medium text-[#373737]">Payment Mode:</div>
        <div className="capitalize">{paymentMode}</div>
      </div>
    </>
  );
};

export default TableContainer;
