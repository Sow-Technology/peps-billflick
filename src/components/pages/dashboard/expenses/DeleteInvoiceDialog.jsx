import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const DeleteInvoiceDialog = ({ isOpen, setIsOpen, invoice }) => {
  const mutation = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/invoices/${invoice.id}`);
    },
    onSuccess: () => {
      setIsOpen(false); // Close dialog after successful deletion
    },
  });

  const handleDelete = () => {
    mutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Invoice</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete this invoice?</p>
        <DialogFooter>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteInvoiceDialog;
