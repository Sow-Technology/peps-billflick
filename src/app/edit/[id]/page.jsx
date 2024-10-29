"use client";
import EditInvoice from "@/components/pages/dashboard/invoices/EditInvoice";
import { useInvoiceStore } from "@/store/store";
import { useEffect, useState } from "react";
import axios from "axios";

export default function EditTopic({ params }) {
  const [invoice, setInvoice] = useState(null);
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInvoiceLoading, setIsInvoiceLoading] = useState(false);

  const { id } = params;
  const invoiceId = decodeURIComponent(id).replace("id=", "");

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
    setStore,
  } = useInvoiceStore();

  // Fetch stores once
  const getStores = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/getStores");
      setStores(response.data);
    } catch (error) {
      console.error("Error fetching stores:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Find store details by store name
  const findStoreDetails = (storeName) => {
    return stores.find((store) => store.code === storeName) || null;
  };

  // Fetch the invoice by ID
  const getInvoiceById = async (id) => {
    setIsInvoiceLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/invoice/${id}`, {
        cache: "no-store",
      });
      if (!res.ok) {
        throw new Error("Failed to fetch invoice");
      }
      const data = await res.json();
      setInvoice(data.invoice);
      return data.invoice; // Return the invoice data
    } catch (error) {
      console.error("Error fetching invoice:", error);
    } finally {
      setIsInvoiceLoading(false);
    }
  };
  console.log(invoice);
  // Set form data based on the fetched invoice
  const setInvoiceData = (invoice) => {
    if (!invoice) return;
    const storeDetails = findStoreDetails(invoice.storeName);

    setOrderNumber(invoice.orderNumber);
    setCustomerName(invoice.customerName);
    setPhoneNumber(invoice.phoneNumber);
    setSubTotal(invoice.subTotal);
    setEmailId(invoice.emailId);
    setPaymentMode(invoice.paymentMode);
    setInvoiceDate(new Date(invoice.createdAt).toLocaleDateString());
    setPaid(invoice.amountPaid);
    setTax(invoice.tax);
    setTaxValue(invoice.taxValue);
    setProducts(invoice.items); // Assuming `items` is the product list
    setNotes(invoice.notes);

    if (storeDetails) {
      setStore(storeDetails);
    } else {
      console.warn(
        `Store details not found for store name: ${invoice.storeName}`
      );
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    getStores(); // Fetch stores first
    getInvoiceById(invoiceId);
  }, [invoiceId]);

  // When stores and invoice are loaded, set the form data
  useEffect(() => {
    if (invoice && stores.length > 0) {
      setInvoiceData(invoice);
    }
  }, [invoice, stores]);

  return (
    <>
      <EditInvoice />
    </>
  );
}
