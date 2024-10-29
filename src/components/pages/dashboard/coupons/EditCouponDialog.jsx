"use client";

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import React, { useState } from "react";
import { toast } from "sonner";
import { updateCoupon } from "@/app/_actions/coupon";

export default function EditCouponDialog({ isOpen, setIsOpen, coupon }) {
  const [couponData, setCouponData] = useState(coupon);

  const handleUpdate = async () => {
    try {
      const res = await updateCoupon(couponData);
      console.log(res);
      toast.success("Coupon updated successfully!", {
        id: "update-coupon",
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to update coupon. Please try again later.", {
        id: "update-coupon",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Coupon</DialogTitle>
          <DialogDescription>Edit the details of the coupon.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="couponCode" className="text-right">
              Coupon Code
            </Label>
            <Input
              id="couponCode"
              className="col-span-3"
              value={couponData.couponCode}
              onChange={(e) =>
                setCouponData({ ...couponData, couponCode: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="discount" className="text-right">
              Discount Percent
            </Label>
            <Input
              id="discount"
              type="number"
              className="col-span-3"
              value={couponData.discount}
              onChange={(e) =>
                setCouponData({ ...couponData, discount: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="maxDiscount" className="text-right">
              Max Discount
            </Label>
            <Input
              id="maxDiscount"
              type="number"
              className="col-span-3"
              value={couponData.maxDiscount}
              onChange={(e) =>
                setCouponData({ ...couponData, maxDiscount: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="couponType" className="text-right">
              Coupon Type
            </Label>
            <Select
              onValueChange={(value) =>
                setCouponData({ ...couponData, couponType: value })
              }
              defaultValue={couponData.couponType}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select Coupon Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="fixed">Fixed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="validity" className="text-right">
              Validity
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[240px] pl-3 text-left">
                  {couponData.validity
                    ? format(new Date(couponData.validity), "PPP")
                    : "Pick a date"}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={new Date(couponData.validity)}
                  onSelect={(date) =>
                    setCouponData({ ...couponData, validity: date })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
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
