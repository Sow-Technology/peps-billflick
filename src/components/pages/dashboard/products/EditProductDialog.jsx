import { updateProduct } from "@/app/_actions/product";
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

export default function EditProductDialog({ isOpen, setIsOpen, product }) {
  const [productData, setProductData] = useState(product);
  const handleUpdate = async () => {
    try {
      await updateProduct(productData);
      toast.success("Product updated successfully!", {
        id: "update-product",
      });
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to update product. Please try again later.", {
        id: "update-product",
      });
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Edit the details of the product.
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
          <Button type="submit" onClick={handleUpdate}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
