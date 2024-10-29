"use client";
import Header from "@/components/sections/Header";
import MainDetails from "@/components/sections/MainDetails";
import Notes from "@/components/sections/Notes";
import TableContainer from "@/components/sections/Table";
import TermsConditions from "@/components/sections/TermsConditions";
import { useInvoiceStore } from "@/store/store";
import React, { useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";

export default function PrintInvoiceDialog({ isOpen, setIsOpen }) {
  const {
    setOrderNumber,
    setCustomerName,
    setPhoneNumber,
    setSubTotal,
    setEmailId,
    setProducts,
    setNotes,
    setPaymentMode,
    setTax,
    setTaxValue,
    setPaymentStatus,
    setPaid,

    setInvoiceDate,
    setStore, // Store setter
  } = useInvoiceStore();
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => {
      setIsOpen(false), setOrderNumber(null);
      setCustomerName("");
      setPhoneNumber(null);
      setSubTotal(null);
      setEmailId("");
      setPaymentMode(null);
      setInvoiceDate(new Date(invoice.createdAt).toLocaleDateString());
      setPaid(null);
      setTax(18);
      setTaxValue(null);
      setProducts([]);
      setNotes("");
      setStore({});
    },
  });

  useEffect(() => {
    if (isOpen) {
      handlePrint(); // Trigger print when the dialog is opened
    }
  }, [isOpen, handlePrint]);

  return (
    <div className="invoice__preview bg-white p-5 rounded-2xl border-4 border-blue-200  hidden  absolute ">
      <div ref={componentRef} className="p-5" paperSize="A4">
        <Header />
        <MainDetails />
        <TableContainer />
        <Notes />
        <TermsConditions />
      </div>
    </div>
  );
}
