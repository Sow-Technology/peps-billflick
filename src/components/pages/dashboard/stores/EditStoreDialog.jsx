import { updateProduct } from "@/app/_actions/product";
import { updateStore } from "@/app/_actions/store";
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

export default function EditStoreDialog({ isOpen, setIsOpen, store }) {
  console.log(store);
  const [storeData, setStoreData] = useState(store);
  const handleUpdate = async () => {
    try {
      await updateStore(storeData);
      toast.success("Store updated successfully!", {
        id: "update-store",
      });
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to update store. Please try again later.", {
        id: "update-store",
      });
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Store</DialogTitle>
          <DialogDescription>Edit the details of the store.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="code" className="text-right">
              Store Code
            </Label>
            <Input
              id="code"
              className="col-span-3"
              value={storeData.code}
              onChange={(e) =>
                setStoreData({ ...storeData, code: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="storeName" className="text-right">
              Store Name
            </Label>
            <Input
              id="storeName"
              className="col-span-3"
              value={storeData.storeName}
              onChange={(e) =>
                setStoreData({ ...storeData, storeName: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phoneNumber" className="text-right">
              Phone Number
            </Label>
            <Input
              id="phoneNumber"
              type="number"
              min="0"
              className="col-span-3"
              value={storeData.phoneNumber}
              onChange={(e) =>
                setStoreData({ ...storeData, phoneNumber: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Address
            </Label>
            <Input
              id="address"
              min="1"
              className="col-span-3"
              value={storeData.address}
              onChange={(e) =>
                setStoreData({ ...storeData, address: e.target.value })
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
