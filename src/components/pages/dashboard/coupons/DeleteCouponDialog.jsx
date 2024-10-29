import { deleteCoupon } from "@/app/_actions/coupon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import { toast } from "sonner";

export default function DeleteCouponDialog({ isOpen, setIsOpen, coupon }) {
  const handleDelete = async () => {
    try {
      await deleteCoupon(coupon._id);
      toast.success("Coupon deleted successfully!", {
        id: "delete-coupon",
      });
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to delete coupon. Please try again later.", {
        id: "delete-coupon",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the{" "}
            {coupon.couponCode} coupon.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
