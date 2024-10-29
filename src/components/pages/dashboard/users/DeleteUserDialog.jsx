// import { deleteUser } from "@/app/_actions/user"; // Assuming a deleteUser function exists
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

export default function DeleteUserDialog({ isOpen, setIsOpen, user }) {
  const handleDelete = async () => {
    try {
      // await deleteUser(user._id);
      toast.success("User deleted successfully!", {
        id: "delete-user",
      });
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to delete user. Please try again later.", {
        id: "delete-user",
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
            {user.username} account.
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
