import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { updateInvoice } from "@/app/_actions/invoice";

const UpdateBalanceDialog = ({ isOpen, setIsOpen, invoice }) => {
  const [balance, setBalance] = useState(invoice?.balance);

  // Only update the balance if invoice changes
  useEffect(() => {
    setBalance(invoice?.subTotal - invoice?.amountPaid);
  }, [invoice?.subTotal, invoice?.amountPaid]);

  const handleSave = async () => {
    console.log(invoice);
    const newAmountPaid = invoice?.amountPaid + parseFloat(balance);
    const newBalance = invoice?.subTotal - newAmountPaid;

    await updateInvoice({
      _id: invoice._id,
      balance: newBalance,
      amountPaid: newAmountPaid,
      paymentStatus: newBalance <= 0 ? "Paid" : "Partially Paid",
    });

    setIsOpen(false); // Close the dialog after saving
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Balance</DialogTitle>
        </DialogHeader>
        <p>The remaining balance is {invoice?.balance}</p>
        <Input
          type="number"
          value={balance}
          onChange={(e) => setBalance(parseFloat(e.target.value))}
          placeholder="Enter amount"
          className="input"
        />
        <DialogFooter>
          <Button onClick={handleSave}>Update</Button>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateBalanceDialog;
