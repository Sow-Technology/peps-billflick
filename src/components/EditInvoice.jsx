"use client";

import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
import Header from "./sections/Header";
import MainDetails from "./sections/MainDetails";
import Notes from "./sections/Notes";
import TableContainer from "./sections/Table";
import TermsConditions from "./sections/TermsConditions";


export default function EditTopicForm({
  id,
  phoneNumber,
  storeName,
  customerName,
  amountPaid,
  subTotal,
  tax,
  taxValue,
  emailId,
  coupon,
  couponDiscount,
  paymentMode, // This prop will determine the default selected payment mode
  notes,
  items,
}) {
  const [newphoneNumber, setNewphoneNumber] = useState(phoneNumber);
  const [newStoreName, setNewStoreName] = useState(storeName);
  const [stores, setStores] = useState([]);
  const [newCustomerName, setNewCustomerName] = useState(customerName);
  const [newAmountPaid, setNewAmountPaid] = useState(amountPaid);
  const [newSubTotal, setNewSubTotal] = useState(subTotal);
  const [newTax, setNewTax] = useState(tax);
  const [newTaxValue, setNewTaxValue] = useState(taxValue);
  const [newEmailId, setNewEmailId] = useState(emailId);
  const [newCoupon, setNewCoupon] = useState(coupon);
  const [newCouponDiscount, setNewCouponDiscount] = useState(couponDiscount);
  const [newPaymentMode, setNewPaymentMode] = useState(paymentMode); // Initialize with prop value
  const [newNotes, setNewNotes] = useState(notes);
  const [itemDetails, setItemDetails] = useState(items || []);

  // State for new item inputs
  const [newItemCode, setNewItemCode] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState(0);
  const [newItemDiscount, setNewItemDiscount] = useState(0);

  // const router = useRouter();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch("/api/getStores");
        const data = await response.json();
        setStores(data);
      } catch (error) {
        console.error("Error fetching stores:", error);
      }
    };

    fetchStores();
  }, []);

  const handleStoreChange = (e) => {
    setNewStoreName(e.target.value);
  };

  const handlePaymentModeChange = (e) => {
    setNewPaymentMode(e.target.value); // Update the payment mode state
  };

  const handleItemChange = (index, field, value) => {
    setItemDetails((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
      };
      return updatedItems;
    });
  };

  const handleAddItem = () => {
    const newItem = {
      code: newItemCode,
      quantity: newItemQuantity,
      discount: newItemDiscount,
    };

    // Update state with new item
    setItemDetails((prevItems) => [...prevItems, newItem]);

    // Reset new item input fields
    setNewItemCode("");
    setNewItemQuantity(0);
    setNewItemDiscount(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:3000/api/invoice/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newphoneNumber,
          newStoreName,
          newCustomerName,
          newAmountPaid,
          newSubTotal,
          newTax,
          newTaxValue,
          newEmailId,
          newCoupon,
          newCouponDiscount,
          newPaymentMode, // Send updated payment mode
          newNotes,
          items: itemDetails,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update topic");
      }

      router.refresh();
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className=" bg-white-100 flex  items-center">
      {/* <div className="max-w-6xl w-full bg-white shadow-lg rounded-lg p-8 grid grid-cols-2 gap-8"> */}
        {/* Left half */}
          <form onSubmit={handleSubmit} className="grid gap-4">
            <h2 className="text-xl font-bold mb-4">Edit Invoice</h2>

            {/* Display 3 fields in one line */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  onChange={(e) => setNewphoneNumber(e.target.value)}
                  value={newphoneNumber}
                  className="mt-1 block w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  type="text"
                  placeholder="Phone Number"
                />
              </div>

              <div>
                <label htmlFor="store" className="block text-sm font-medium text-gray-700">
                  Store Name
                </label>
                <select
                  id="store"
                  value={newStoreName}
                  onChange={handleStoreChange}
                  className="mt-1 block w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="" disabled>
                    Select a Store
                  </option>
                  {stores.map((store) => (
                    <option key={store.code} value={store.code}>
                      {store.code}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">
                  Customer Name
                </label>
                <input
                  id="customerName"
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  value={newCustomerName}
                  className="mt-1 block w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  type="text"
                  placeholder="Customer Name"
                />
              </div>
            </div>

            {/* Display 2 fields in one line */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="amountPaid" className="block text-sm font-medium text-gray-700">
                  Amount Paid
                </label>
                <input
                  id="amountPaid"
                  onChange={(e) => setNewAmountPaid(e.target.value)}
                  value={newAmountPaid}
                  className="mt-1 block w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  type="number"
                  placeholder="Amount Paid"
                />
              </div>

              <div>
                <label htmlFor="subTotal" className="block text-sm font-medium text-gray-700">
                  Sub Total
                </label>
                <input
                  id="subTotal"
                  onChange={(e) => setNewSubTotal(e.target.value)}
                  value={newSubTotal}
                  className="mt-1 block w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  type="number"
                  placeholder="Sub Total"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">

            <div>


        <label htmlFor="tax" className="block text-sm font-medium text-gray-700">Tax</label>
        <input
          id="tax"
          onChange={(e) => setNewTax(e.target.value)}
          value={newTax}
          className="mt-1 block w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          type="number"
          placeholder="Tax"
        />
      </div>

      <div>
        <label htmlFor="taxValue" className="block text-sm font-medium text-gray-700">Tax Value</label>
        <input
          id="taxValue"
          onChange={(e) => setNewTaxValue(e.target.value)}
          value={newTaxValue}
          className="mt-1 block w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          type="number"
          placeholder="Tax Value"
        />
      </div>

      <div>
        <label htmlFor="emailId" className="block text-sm font-medium text-gray-700">Email ID</label>
        <input
          id="emailId"
          onChange={(e) => setNewEmailId(e.target.value)}
          value={newEmailId}
          className="mt-1 block w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          type="email"
          placeholder="Email ID"
        />
      </div>
      </div>

      <div className="grid grid-cols-2 gap-4">


      <div>
        <label htmlFor="coupon" className="block text-sm font-medium text-gray-700">Coupon</label>
        <input
          id="coupon"
          onChange={(e) => setNewCoupon(e.target.value)}
          value={newCoupon}
          className="mt-1 block w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          type="text"
          placeholder="Coupon"
        />
      </div>

      <div>
        <label htmlFor="couponDiscount" className="block text-sm font-medium text-gray-700">Coupon Discount</label>
        <input
          id="couponDiscount"
          onChange={(e) => setNewCouponDiscount(e.target.value)}
          value={newCouponDiscount}
          className="mt-1 block w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          type="number"
          placeholder="Coupon Discount"
        />
      </div>
      </div>

      <div className="mt-5">
        <h3 className="font-bold">Add New Item</h3>
        <div className="flex gap-3">
          <input
            onChange={(e) => setNewItemCode(e.target.value)}
            value={newItemCode}
            className="border border-slate-500 px-4 py-2"
            type="text"
            placeholder="Item Code"
          />
          <input
            onChange={(e) => setNewItemQuantity(e.target.value)}
            value={newItemQuantity}
            className="border border-slate-500 px-4 py-2"
            type="number"
            placeholder="Quantity"
          />
          <input
            onChange={(e) => setNewItemDiscount(e.target.value)}
            value={newItemDiscount}
            className="border border-slate-500 px-4 py-2"
            type="number"
            placeholder="Discount"
          />
          <button
            type="button"
            onClick={handleAddItem}
            className="bg-blue-600 text-white px-4 py-2"
          >
            Add Product
          </button>
        </div>
      </div>

      {/* Render item details in a table format */}
      <div>
        <h3 className="font-bold">Items</h3>
        <table className="border-collapse border border-slate-500 w-full mt-2">
          <thead>
            <tr>
              <th className="border border-slate-500 px-4 py-2">Item Code</th>
              <th className="border border-slate-500 px-4 py-2">Quantity</th>
              <th className="border border-slate-500 px-4 py-2">Discount</th>
            </tr>
          </thead>
          <tbody>
            {itemDetails.map((item, index) => (
              <tr key={index}>
                <td className="border border-slate-500 px-4 py-2">
                  <input
                    onChange={(e) => handleItemChange(index, 'code', e.target.value)}
                    value={item.code}
                    className="border border-slate-300 w-full"
                    type="text"
                    placeholder="Item Code"
                  />
                </td>
                <td className="border border-slate-500 px-4 py-2">
                  <input
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    value={item.quantity}
                    className="border border-slate-300 w-full"
                    type="number"
                    placeholder="Quantity"
                  />
                </td>
                <td className="border border-slate-500 px-4 py-2">
                  <input
                    onChange={(e) => handleItemChange(index, 'discount', e.target.value)}
                    value={item.discount}
                    className="border border-slate-300 w-full"
                    type="number"
                    placeholder="Discount"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


            {/* Continue the form fields similarly */}
            {/* Payment mode in one line */}
            <div className="mt-4">
              <label className="block mb-1">Payment Mode</label>
              <div className="flex gap-5">
                <div>
                  <input
                    type="radio"
                    id="cash"
                    name="paymentMode"
                    value="Cash"
                    checked={newPaymentMode === "Cash"}
                    onChange={handlePaymentModeChange}
                  />
                  <label htmlFor="cash" className="ml-2">
                    Cash
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="upi"
                    name="paymentMode"
                    value="UPI"
                    checked={newPaymentMode === "UPI"}
                    onChange={handlePaymentModeChange}
                  />
                  <label htmlFor="upi" className="ml-2">
                    UPI
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="card"
                    name="paymentMode"
                    value="Card"
                    checked={newPaymentMode === "Card"}
                    onChange={handlePaymentModeChange}
                  />
                  <label htmlFor="card" className="ml-2">
                    Card
                  </label>
                </div>
              </div>
            </div>

            {/* Display the notes field */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                id="notes"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="mt-1 block w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Additional notes"
              />
            </div>
            
            <button
              type="submit"
              className="mt-6 bg-indigo-500 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-600 transition duration-300"
            >
              Save Changes
            </button>
          </form>

        {/* Right half */}
        {/* <div className="invoice__preview bg-white p-5 rounded-2xl border-4 border-blue-200 sticky top-0">
          <div  className="p-5" paperSize="A4">
            <Header />

            <MainDetails />

            <TableContainer />

            <Notes />
            <TermsConditions />
          </div>
        </div> */}
      {/* </div> */}
    </div>
  );
}
