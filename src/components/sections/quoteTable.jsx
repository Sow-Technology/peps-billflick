import { useInvoiceStore } from "@/store/store";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Popover, PopoverContent } from "../ui/popover";
import Image from "next/image";

const TableContainer = () => {
  const {
    products,
    setProducts,
    total,
    subTotal,
    setSubTotal,
    balance,
    setBalance,
    paid,
    setPaid,
    isEditing,
    setIsEditing,
    showModal,
    couponDiscount,
    setShowModal,
    paymentMode,
    taxValue,
  } = useInvoiceStore();

  return (
    <>
      <Table width="100%" className="mb-10 overflow-auto">
        <TableHeader>
          <TableRow className="bg-gray-100 p-1 text-primary">
            <TableHead className="font-bold">Code</TableHead>
            <TableHead className="font-bold">Product Name</TableHead>
            <TableHead className="font-bold">Qty</TableHead>
            <TableHead className="font-bold">Unit Price</TableHead>
            <TableHead className="font-bold">Discount</TableHead>
            <TableHead className="font-bold">Total</TableHead>
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
              <TableRow className="h-10" key={id}>
                <TableCell>{code}</TableCell>
                <TableCell>{productName}</TableCell>
                <TableCell>{quantity}</TableCell>
                <TableCell>{unitPrice}</TableCell>
                <TableCell>{discount}%</TableCell>
                <TableCell className="amount">{total}</TableCell>
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
          {/* <div className="text-primary font-medium">Paid</div> */}
        </div>
        <div className="text-right">
          <div>₹{taxValue}</div>
          {couponDiscount && <div className="">-₹{couponDiscount}</div>}

          <div>₹{subTotal}</div>
          {/* <div className="text-primary font-medium">₹{paid}</div> */}
        </div>
      </div>
     
    </>
  );
};

export default TableContainer;
