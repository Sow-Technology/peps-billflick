// This is assuming you have an `updateUser` function, and `toast` from a notification library

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multi-select";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { storesData } from "@/lib/data";
import { useState } from "react";
import { updateUser } from "@/app/_actions/user";
import { toast } from "sonner";

export default function EditUserDialog({ isOpen, setIsOpen, user }) {
  const [userData, setUserData] = useState(user);
  const [selectedStores, setSelectedStores] = useState(user.storeAccess || []);
  const [open, setOpen] = useState(false);

  // Function to handle the user update logic
  const handleUpdate = async () => {
    try {
      await updateUser({ ...userData, storeAccess: selectedStores });
      toast.success("User updated successfully!", {
        id: "update-user",
      });
      setIsOpen(false); // Close the dialog on success
    } catch (error) {
      toast.error("Failed to update user. Please try again later.", {
        id: "update-user",
      });
    }
  };

  // Handle store selection
  const handleStoreSelection = (newSelectedStores) => {
    setSelectedStores(newSelectedStores);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Edit the details of the user.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Email field */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              className="col-span-3"
              value={userData.email}
              disabled
            />
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <Select
              defaultValue={userData.role}
              onValueChange={(val) => setUserData({ ...userData, role: val })}
            >
              <SelectTrigger className="min-w-[270px] justify-between flex">
                <SelectValue placeholder="Select user role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {["coSuperAdmin", "admin", "user"].map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Store Access multi-selector */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="storeAccess" className="text-right">
              Store Access
            </Label>

            <MultiSelector
              className="col-span-3"
              onValuesChange={handleStoreSelection}
              values={selectedStores}
            >
              <MultiSelectorTrigger>
                <MultiSelectorInput placeholder="Select stores" />
              </MultiSelectorTrigger>
              <MultiSelectorContent>
                <MultiSelectorList>
                  {storesData.map((service, idx) => (
                    <MultiSelectorItem
                      key={idx}
                      value={service.priority || service.name}
                    >
                      {service.priority || service.name}
                    </MultiSelectorItem>
                  ))}
                </MultiSelectorList>
              </MultiSelectorContent>
            </MultiSelector>
          </div>
        </div>

        {/* Dialog Footer with Save Button */}
        <DialogFooter>
          <Button type="submit" onClick={handleUpdate}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
