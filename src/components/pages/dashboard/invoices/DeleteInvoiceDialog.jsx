import { deleteInvoice } from "@/app/_actions/invoice";
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

export default function DeleteInvoiceDialog({ isOpen, setIsOpen, invoice }) {
  const handleDelete = async () => {
    try {
      console.log(invoice);
      await deleteInvoice(invoice._id);
      toast.success("Invoice deleted successfully!", {
        id: "delete-invoice",
      });
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to delete invoice. Please try again later.", {
        id: "delete-invoice",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            {invoice?.orderNumber} invoice
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
