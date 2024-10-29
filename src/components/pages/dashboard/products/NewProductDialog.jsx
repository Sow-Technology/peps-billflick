import { createProduct, updateProduct } from "@/app/_actions/product";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { toast } from "sonner";

export default function NewProductDialog({ isOpen, setIsOpen }) {
  const [productData, setProductData] = useState({
    code: "",
    productName: "",
    quantity: 0,
    unitPrice: 0,
  });
  const handleSubmit = async () => {
    try {
      const res = await createProduct(productData);
      console.log(res);
      toast.success("Product created successfully!", {
        id: "create-product",
      });
      setIsOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to create product. Please try again later.", {
        id: "create-product",
      });
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new product</DialogTitle>
          <DialogDescription>
            Enter the details of the product.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="code" className="text-right">
              Code
            </Label>
            <Input
              id="code"
              className="col-span-3"
              value={productData.code}
              onChange={(e) =>
                setProductData({ ...productData, code: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="productName" className="text-right">
              Product Name
            </Label>
            <Input
              id="productName"
              className="col-span-3"
              value={productData.productName}
              onChange={(e) =>
                setProductData({ ...productData, productName: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">
              Quantity
            </Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              className="col-span-3"
              value={productData.quantity}
              onChange={(e) =>
                setProductData({ ...productData, quantity: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Price
            </Label>
            <Input
              id="price"
              type="number"
              min="1"
              className="col-span-3"
              value={productData.unitPrice}
              onChange={(e) =>
                setProductData({ ...productData, unitPrice: e.target.value })
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
