import { useInvoiceStore } from "@/store/store";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
// import { productsData } from "@/lib/data";
import { toast } from "sonner";
import collect from "collect.js";
import { Button } from "../ui/button";
import { getCouponDetails } from "@/app/_actions/coupon";

const TableForm = ({ setItems }) => {
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
    setShowModal,
    paymentMode,
    setPaymentMode,
    setTax,
    tax,
    taxValue,
    setTaxValue,
    coupon,
    storeName,
    setCoupon,
    couponDiscount,
    setCouponDiscount,
  } = useInvoiceStore();
  const [quantity, setQuantity] = useState(1);
  const [code, setCode] = useState(null);
  const [price, setPrice] = useState();
  const [discount, setDiscount] = useState(0);
  const [couponDetails, setCouponDetails] = useState({});
  const [productsData, setProductsData] = useState([]);

  const editRow = (id) => {
    const editingRow = products.find((row) => row.id === id);
    setProducts(products.filter((row) => row.id !== id));
    setIsEditing(true);
    setCode(editingRow.code);
    setQuantity(editingRow.quantity);
    setPrice(editingRow.price);
  };

  const calculateTotal = (code, quantity, discount) => {
    const unitPrice = productsData.find((p) => p.code === code)?.unitPrice || 0;
    const totalBeforeDiscount = quantity * unitPrice;
    const total = totalBeforeDiscount - (discount / 100) * totalBeforeDiscount;
    return total.toFixed(2); // Truncate to 2 decimal places
  };

  console.log(couponDetails);
  console.log(couponDiscount);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code || !quantity || typeof discount !== "number") {
      toast.error("All the fields are required!");
      return;
    }

    const newTotal = calculateTotal(code, quantity, discount);
    console.log(storeName);
    const newProduct = {
      code,
      quantity,
      id: uuidv4(),
      discount,
      total: newTotal,

      unitPrice: productsData.find((p) => p.code === code).unitPrice,
      productName: productsData.find((p) => p.code === code).productName,
    };
    setCode(null);
    setQuantity(1);
    setDiscount(0);
    setProducts([...products, newProduct]);
    setIsEditing(false);
  };

  useEffect(() => {
    const allItems = products.map((product) => parseFloat(product.total));
    setSubTotal(collect(allItems).sum().toFixed(2));
  }, [products, setSubTotal]);

  useEffect(() => {
    const balance = subTotal - Number(paid);
    setBalance(
      subTotal >= paid
        ? "₹" + balance.toFixed(2)
        : "-₹" + Math.abs(balance).toFixed(2)
    );
  }, [paid, setBalance, subTotal]);
  const handleDiscountChange = (e, id) => {
    let inputValue = e.target.value;
    if (inputValue.endsWith("%")) {
      inputValue = inputValue.slice(0, -1);
    }
    if (!isNaN(inputValue) && inputValue >= 0 && inputValue <= 100) {
      const updatedProducts = products.map((product) => {
        if (product.id === id) {
          const newDiscount = inputValue;
          const newTotal = calculateTotal(
            product.code,
            product.quantity,
            newDiscount
          );
          return { ...product, discount: newDiscount, total: newTotal };
        }
        return product;
      });
      setProducts(updatedProducts);
    }
  };
  const handleDiscount = (e) => {
    let inputValue = e.target.value.replace("%", "");

    if (
      !isNaN(Number(inputValue)) &&
      Number(inputValue) >= 0 &&
      Number(inputValue) <= 100
    ) {
      setDiscount(Number(inputValue));
    }
  };
  const handleTaxChange = (e) => {
    let inputValue = e.target.value.replace("%", "");

    if (
      !isNaN(Number(inputValue)) &&
      Number(inputValue) >= 0 &&
      Number(inputValue) <= 30
    ) {
      setTax(Number(inputValue));
    }
  };

  const handlePaidChange = (e) => {
    let inputValue = e.target.value;
    if (inputValue.startsWith("₹")) {
      inputValue = inputValue.slice(1);
    }
    if (!isNaN(inputValue) && inputValue >= 0) {
      setPaid(inputValue);
    }
  };

  const handleQuantityChange = (e, id) => {
    const updatedQuantity = e.target.value;
    const updatedProducts = products.map((product) => {
      if (product.id === id) {
        const newTotal = calculateTotal(
          product.code,
          updatedQuantity,
          product.discount
        );
        return { ...product, quantity: updatedQuantity, total: newTotal };
      }
      return product;
    });
    setProducts(updatedProducts);
  };

  const handleCodeChange = (value, id) => {
    const updatedProducts = products.map((product) => {
      if (product.id === id) {
        const newTotal = calculateTotal(
          value,
          product.quantity,
          product.discount
        );
        return { ...product, code: value, total: newTotal };
      }
      return product;
    });
    setProducts(updatedProducts);
  };

  const handleCoupon = async () => {
    toast.loading("Applying Coupon...", {
      id: "coupon",
    });

    try {
      const response = await getCouponDetails(coupon);

      if (!response.success) {
        toast.error("Invalid coupon code!", {
          id: "coupon",
        });
        return;
      }

      const couponData = response.data;

      if (new Date(couponData.validity) < Date.now()) {
        toast.error("Coupon expired!", {
          id: "coupon",
        });
        return;
      }

      if (couponData.status !== "Active") {
        toast.error("Coupon is inactive", {
          id: "coupon",
        });
        return;
      }

      setCouponDetails(couponData);
      console.log(subTotal);
      let newSubTotal = subTotal;
      console.log(newSubTotal);

      if (couponData.couponType === "Fixed") {
        newSubTotal = Math.max(subTotal - couponData.discount, 0);
        setCouponDiscount(couponData.discount);
      } else if (couponData.couponType === "percentage") {
        let calculatedDiscount = (couponData.discount / 100) * subTotal;
        console.log(subTotal);
        console.log("======");
        console.log(calculatedDiscount);

        if (
          couponData.maxDiscount > 0 &&
          calculatedDiscount > couponData.maxDiscount
        ) {
          calculatedDiscount = couponData.maxDiscount;
        }

        newSubTotal = Math.max(subTotal - calculatedDiscount, 0);
        setCouponDiscount(calculatedDiscount.toFixed(2));
      }

      setSubTotal(newSubTotal.toFixed(2));
      toast.success("Coupon applied successfully!", {
        id: "coupon",
      });
    } catch (error) {
      toast.error("An error occurred while applying the coupon.", {
        id: "coupon",
      });
      console.error("Coupon application error:", error);
    }
  };

  useEffect(() => {
    setItems(products);
  }, [products, setItems]);
  useEffect(() => {
    const tVal = subTotal * (tax / 100);
    setTaxValue(tVal.toFixed(2));
  }, [tax, subTotal, setTaxValue]);
  useEffect(() => {
    if (couponDetails && couponDetails.couponType == "percentage") {
      let calculatedDiscount = (couponDetails.discount / 100) * subTotal;
      console.log(calculatedDiscount);
      if (
        couponDetails.maxDiscount > 0 &&
        calculatedDiscount > couponDetails.maxDiscount
      ) {
        calculatedDiscount = couponDetails.maxDiscount;
      }
      const newSubTotal = Math.max(subTotal - calculatedDiscount, 0);
      setSubTotal(newSubTotal.toFixed(2));
      setCouponDiscount(calculatedDiscount.toFixed(2));
    }
  }, [products]);
  useEffect(() => {
    // Fetch the products data from the API
    const fetchProductsData = async () => {
      try {
        const response = await fetch("/api/getProducts");
        const data = await response.json();
        if (data.success) {
          setProductsData(data.data);
          console.log(data.data);
        } else {
          toast.error("Failed to fetch products", {
            id: "fetchingProducts",
          });
        }
      } catch (error) {
        toast.error("Error fetching products", {
          id: "fetchingProducts",
        });
      }
    };

    fetchProductsData();
  }, []);

  return (
    <>
      <table width="100%" className="mb-10 overflow-auto">
        {products?.map(
          ({ code, productName, quantity, unitPrice, total, discount, id }) => (
            <React.Fragment key={id}>
              <div className="my-5 flex flex-row justify-between items-center gap-2 flex-wrap">
                <div className="flex flex-1 flex-col items-start gap-2">
                  <Label htmlFor="code">Code</Label>
                  <Select
                    onValueChange={(value) => handleCodeChange(value, id)}
                    value={code}
                  >
                    <SelectTrigger className="">
                      <SelectValue placeholder="code" />
                    </SelectTrigger>
                    <SelectContent>
                      {productsData.map((product) => (
                        <SelectItem key={product.code} value={product.code}>
                          {product.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-1 flex-col items-start gap-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    type="number"
                    name="quantity"
                    id="quantity"
                    placeholder="Quantity"
                    maxLength={33}
                    value={quantity}
                    onChange={(e) => handleQuantityChange(e, id)}
                  />
                </div>

                <div className="flex flex-1 flex-col items-start gap-2">
                  <Label htmlFor="discount">Discount</Label>
                  <Input
                    type="text"
                    name="discount"
                    id="discount"
                    placeholder="Discount"
                    maxLength={33}
                    value={discount !== "" ? `${discount}%` : ""}
                    onChange={(e) => handleDiscountChange(e, id)}
                  />
                </div>
              </div>
            </React.Fragment>
          )
        )}
      </table>

      <form
        onSubmit={handleSubmit}
        className="my-5 flex flex-row justify-between items-center gap-2 flex-wrap"
      >
        <div className="flex flex-col flex-1 items-start gap-2">
          <Label htmlFor="code">Code</Label>
          <Select onValueChange={setCode} value={code}>
            <SelectTrigger className="">
              <SelectValue placeholder="code" />
            </SelectTrigger>
            <SelectContent>
              {productsData.map((product) => (
                <SelectItem key={product.code} value={product.code}>
                  {product.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col items-start gap-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            type="number"
            name="quantity"
            id="quantity"
            placeholder="Quantity"
            maxLength={33}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <div className="flex flex-1 flex-col items-start gap-2">
          <Label htmlFor="discount">Discount</Label>
          <Input
            type="text"
            name="discount"
            id="discount"
            placeholder="Discount"
            value={discount !== "" ? `${discount}%` : ""}
            onChange={handleDiscount}
          />
        </div>
        <Button type="submit" className="-400 mt-auto">
          {isEditing ? "Finish Editing" : "Add Product"}
        </Button>
      </form>

      {/* <div className="inline-flex sm:w-[48%] items-center justify-center gap-2 mb-4 mr-4">
        <Label htmlFor="paid">Amount Paid:</Label>
        <Input
          id="paid"
          name="paid"
          onChange={handlePaidChange}
          value={"₹" + paid}
        />
      </div> */}
      <div className="inline-flex  sm:w-[48%] items-center justify-center gap-2 mb-4">
        <Label htmlFor="paid">Tax applicable:</Label>
        <Input
          id="tax"
          name="tax"
          onChange={handleTaxChange}
          value={tax !== "" ? `${tax}%` : ""}
        />
      </div>
      {/* <div className="inline-flex  items-center justify-center gap-2 mb-4">
        <Label htmlFor="paid">Coupon Code:</Label>
        <Input
          id="coupon"
          name="coupon"
          onChange={(e) => setCoupon(e.target.value)}
          value={coupon}
        />
        <Button onClick={handleCoupon}>Apply</Button>
      </div> */}

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

export default TableForm;
