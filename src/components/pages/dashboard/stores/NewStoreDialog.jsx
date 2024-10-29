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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createStore } from "../../../../app/_actions/store";
import { useRouter } from "next/navigation";

// Validation schema with zod
const storeSchema = z.object({
  code: z.string().min(1, "Store code is required"),
  storeName: z.string().min(1, "Store name is required"),
  phoneNumber: z.string().min(10, "Phone number is required").max(15),
  address: z.string().min(1, "Address is required"),
  logo: z.any().optional(),
});

export default function NewStoreDialog({ isOpen, setIsOpen }) {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      code: "",
      storeName: "",
      phoneNumber: "",
      address: "",
      logo: null,
    },
  });
  const handleSubmit = async (data) => {
    try {
      const formData = new FormData();
      console.log(data);
      console.log(data.logo); // Log to ensure the logo is correctly captured
      if (data.logo && data.logo.length > 0) {
        formData.append("file", data.logo[0]);
      }

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      console.log("Response from server:", result);
      console.log(result);

      await createStore({ ...data, logo: result.fileId });
      toast.success("Store created successfully!", {
        id: "create-store",
      });

      window.location.reload();

      setIsOpen(false);
    } catch (error) {
      console.error("File upload error:", error.message); // Log any error
      toast.error("Failed to create store. Please try again later.", {
        id: "create-store",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Store</DialogTitle>
          <DialogDescription>Enter the details of the store.</DialogDescription>
        </DialogHeader>

        {/* Start the form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* Store Code Field */}
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Store code" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Store Name Field */}
            <FormField
              control={form.control}
              name="storeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Store name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Phone Number Field */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone number" type="tel" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Address Field */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Address" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Logo Upload Field */}
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Logo</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => field.onChange(e.target.files)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <DialogFooter>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
