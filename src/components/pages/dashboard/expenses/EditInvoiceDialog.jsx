import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const EditInvoiceDialog = ({ isOpen, setIsOpen, invoice }) => {
  const [formData, setFormData] = useState({
    orderNumber: invoice.orderNumber || "",
    subTotal: invoice.subTotal || "",
  });

  const mutation = useMutation({
    mutationFn: async (updatedData) => {
      await axios.put(`/api/invoices/${invoice.id}`, updatedData);
    },
    onSuccess: () => {
      setIsOpen(false); // Close dialog after successful edit
    },
  });

  const handleSubmit = () => {
    mutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Invoice</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            value={formData.orderNumber}
            onChange={(e) =>
              setFormData({ ...formData, orderNumber: e.target.value })
            }
            placeholder="Order Number"
            className="input"
          />
          <input
            type="number"
            value={formData.subTotal}
            onChange={(e) =>
              setFormData({ ...formData, subTotal: e.target.value })
            }
            placeholder="Subtotal"
            className="input"
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Save</Button>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditInvoiceDialog;
