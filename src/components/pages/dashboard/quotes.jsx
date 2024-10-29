import { useInvoiceStore } from "@/store/store";
import Header from "../../sections/quoteHeader";
import MainDetails from "../../sections/quotesMainDetails";
import Notes from "../../sections/Notes";
import TableForm from "../../sections/quoteTableForm";
import { useEffect, useRef, useState } from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";
import ReactToPrint from "react-to-print";
import TableContainer from "../../sections/quoteTable";
import { Checkbox } from "../../ui/checkbox";
import Image from "next/image";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import axios from "axios";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { storesData } from "@/lib/data";
import { useLocalStorage } from "@uidotdev/usehooks";
import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { PiSpinner } from "react-icons/pi";

function App() {
  const session = useSession();
  const {
    orderNumber,
    setOrderNumber,
    customerName,
    setCustomerName,
    phoneNumber,
    setPhoneNumber,
    emailId,
    setEmailId,
    notes,
    setNotes,
    subTotal,
    paymentMode,
    setTax,
    tax,
    taxValue,
    setTaxValue,
    setPaymentMode,
    coupon,
    store,
    setStore,
    setProducts,
    couponDiscount,
  } = useInvoiceStore();
  const componentRef = useRef();
  const [isInvoiceSaved, setIsInvoiceSaved] = useState(false);

  const router = useRouter();
  const [width] = useState(641);
  const [items, setItems] = useState([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [existingCustomer, setExistingCustomer] = useState(false);
  const [isPaymentDone, setIsPaymentDone] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stores, setStores] = useState([]);
  useEffect(() => {
    console.log(paymentMode);
    if (paymentMode == "upi") {
      console.log(true);
      setIsPopoverOpen(true);
    } else {
      setIsPopoverOpen(false);
    }
  }, [paymentMode]);
  const handleSubmit = async () => {
    if (isInvoiceSaved) {
      toast.error("This invoice has already been saved!");
      return;
    }
    const handleReset = async () => {
      await getInvoiceNumber();
      setCustomerName("");
      setPhoneNumber("");
      setEmailId("");
      setNotes("");
      setItems([]);
      setPaymentMode(null);
      setTax(0);
      setProducts([]);
      setTaxValue(0);
      setIsPaymentDone(false);
      setIsInvoiceSaved(false);
    };

    const data = {
      orderNumber,
      customerName,
      phoneNumber,
      emailId,
      notes,
      paymentMode,
      items,
      isPaymentDone,
      subTotal,
      taxValue,
      tax,
      storeName: store.code,
      coupon,
      couponDiscount,
    };
    // if (!existingCustomer) {
    //   const newCustomer = await axios.post("/api/createCustomer", {
    //     name: customerName,
    //     phoneNumber,
    //     emailId,
    //   });
    //   console.log(newCustomer);
    // }
    const response = await axios.post("/api/invoice", { ...data });
    setIsInvoiceSaved(true);

    getInvoiceNumber().then((res) => {
      console.log(res);
      setOrderNumber(res.data);
    });
    handleReset();
  };
  useEffect(() => {
    if (window.innerWidth < width) {
      alert("Place your phone in landscape mode for the best experience");
    }
  }, [width]);

  const getInvoiceNumber = async () => {
    setIsLoading(true);
    const response = await axios.get("/api/newInvoiceNumber");
    setOrderNumber(response.data);
    setIsLoading(false);
    return response;
  };
  const getStores = async () => {
    setIsLoading(true);
    const response = await axios.get("/api/getStores");
    console.log(response);
    setStores(response.data);
    setIsLoading(false);
    return response;
  };
  useEffect(() => {
    getInvoiceNumber();
    getStores();
  }, []);

  const handleFetchCustomerDetails = async () => {
    toast.loading("Fetching Customer Details", {
      id: "fetchingCustomerDetails",
    });
    const response = await axios.get(
      `/api/getCustomer?phoneNumber=${phoneNumber}`
    );
    console.log(response);
    if (response.status != 200) {
      toast.error("Customer not found!, enter details to create new customer", {
        id: "fetchingCustomerDetails",
      });
    }
    setCustomerName(response.data.name);
    setEmailId(response.data.email);
    setExistingCustomer(true);
    toast.success("Customer Details Fetched", {
      id: "fetchingCustomerDetails",
    });
  };
  const handleStoreChange = (value) => {
    const activeStore = stores.filter((store) => store.code === value);
    console.log(activeStore);
    setStore(activeStore[0]);
    console.log(store);
    localStorage.setItem("selectedStore", value);
    console.log(value);
  };
  useEffect(() => {
    const storedData = localStorage.getItem("selectedStore");
    console.log(storedData);
    const activeStore = stores.filter((store) => store.code === storedData);
    console.log(activeStore);
    setStore(activeStore[0]);
  }, []);
  console.log(stores);
  // useEffect(() => {
  //   if (!orderNumber) {
  //     return "Loading..";
  //   }
  // }, [orderNumber]);
  if (session.status == "unauthenticated") {
    redirect("/auth");
  }
  if (session.status == "authenticated" && session.data.user.role == "user") {
    // redirect("/unauthorized");
  }
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <PiSpinner />
      </div>
    );
  }
  return (
    <>
      <main
        className="m-5 p-5 xl:grid grid-cols-2 gap-10 xl:items-start"
        style={{
          maxWidth: "1920px",
          margin: "auto",
        }}
      >
        <section>
          <div className="bg-white p-5 rounded shadow">
            <div className="flex flex-col justify-center gap-2">
              <article className="">
                <div className="flex flex-row w-auto items-center gap-2">
                  <Label htmlFor="" className="md:min-w-[100px]">
                    Select Store
                  </Label>
                  <Select
                    onValueChange={handleStoreChange}
                    value={storesData.code}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a Store" />
                    </SelectTrigger>
                    <SelectContent>
                      {stores?.map((store) => (
                        <SelectItem key={store.code} value={store.code}>
                          {store.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </article>
              <article className="grid grid-cols-4 gap-4 md:mt-6 max-lg:space-y-2">
                <div className=" flex-col gap-3 col-span-3">
                  <Label htmlFor="phoneNumber">
                    Enter customer phone number
                  </Label>
                  <Input
                    type="text"
                    name="phoneNumber"
                    id="phoneNumber"
                    placeholder="Enter customer phone number"
                    maxLength={96}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <div className="w-max col-span-1 flex  items-end">
                  {" "}
                  <Button onClick={handleFetchCustomerDetails}>
                    Get Details
                  </Button>
                </div>
                <div className="flex flex-col gap-3 col-span-2">
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    type="text"
                    name="customerName"
                    id="customerName"
                    placeholder="Enter customer's name"
                    maxLength={56}
                    autoComplete="off"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-3 col-span-2">
                  <Label htmlFor="emailId">Enter customer Email ID</Label>
                  <Input
                    type="text"
                    name="emailId"
                    id="emailId"
                    placeholder="Enter customer Email ID"
                    maxLength={96}
                    autoComplete="off"
                    value={emailId}
                    onChange={(e) => setEmailId(e.target.value)}
                  />
                </div>
              </article>

              {/* This is our table form */}
              <article>
                <TableForm setItems={setItems} />
              </article>

              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                name="notes"
                id="notes"
                cols="30"
                rows="5"
                placeholder="Additional notes to the client"
                maxLength={500}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></Textarea>
            </div>
            <ReactToPrint
              trigger={() => <Button className="my-5">Print / Download</Button>}
              content={() => componentRef.current}
            />
          </div>
        </section>

        {/* Invoice Preview */}
        <div className="invoice__preview bg-white p-5 rounded-2xl border-4 border-blue-200 sticky top-0">
          <div ref={componentRef} className="p-5" paperSize="A4">
            <Header />

            <MainDetails />

            <TableContainer />

            <Notes />
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
