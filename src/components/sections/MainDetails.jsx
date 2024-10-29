import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useInvoiceStore } from "@/store/store";

const MainDetails = () => {
  const { customerName, phoneNumber, emailId, orderNumber, invoiceDate } =
    useInvoiceStore();
  return (
    <>
      <section className="flex flex-row items-center justify-between text-sm">
        <article className="mt-10 mb-14 flex flex-col items-start justify-start text-[#666666]">
          <div className="flex gap-2 items-center p-1">
            <h3 className="text-[#e01b84]">Customer Name:</h3>
            <h4>{customerName}</h4>
          </div>
          <div className="flex gap-2 items-center p-1">
            <h3 className="font-bold">Phone Number:</h3>
            <h4>{phoneNumber}</h4>
          </div>
          <div className="flex gap-2 items-center p-1">
            <h3 className="font-bold">Email Id:</h3>
            <h4>{emailId}</h4>
          </div>
        </article>
        <article className="mt-10 mb-14 flex items-end justify-end text-[#666666]">
          <ul>
            <li className="p-1 ">
              <span className="font-bold">Order number:</span> #{orderNumber}
            </li>
            <li className="p-1 bg-gray-100">
              <span className="font-bold">Invoice date:</span>{" "}
              {invoiceDate || new Date().toLocaleDateString()}
            </li>
            <li className="p-1 ">
              <span className="font-bold">GST IN: </span> 29BCNPT0590C1ZB
            </li>
          </ul>
        </article>
      </section>
    </>
  );
};

export default MainDetails;
