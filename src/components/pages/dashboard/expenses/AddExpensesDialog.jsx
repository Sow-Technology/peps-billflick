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
import { Input } from "@/components/ui/input";

const AddExpensesDialog = ({
  isOpen,
  setIsOpen,
  expense,
  setExpense,
  handleUpdate,
}) => {
  const handleSave = () => {
    handleUpdate();
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Expenses</DialogTitle>
        </DialogHeader>
        <Input
          type="number"
          value={expense}
          onChange={(e) => setExpense(e.target.value)}
          placeholder="Enter expenses"
          className="input"
        />
        <DialogFooter>
          <Button onClick={handleSave}>Save</Button>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpensesDialog;
