import React from "react";
import { Button } from "@/components/ui/button";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90vw] max-w-md">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-left">Are you absolutely sure?</h3>
          <p className="text-left mt-2 text-gray-600">{message}</p>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
