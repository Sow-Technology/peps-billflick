"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CouponsTable from "../CouponsTable";
import { createCoupon } from "@/app/_actions/coupon";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function CreateCouponsDialog({
  isNewCouponDialogOpen,
  setIsNewCouponDialogOpen,
}) {
  const formSchema = z.object({
    couponCode: z
      .string()
      .min(4, {
        message: "Coupon code must be at least 4 characters",
      })
      .max(16, {
        message: "Coupon code must be at most 16 characters",
      }),
    discount: z.coerce.number(),
    validity: z.date(),
    couponType: z.string(),
    maxDiscount: z.coerce.number(),
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      couponCode: "",
      discount: "",
      validity: new Date(),
      couponType: "",
      maxDiscount: "",
    },
  });
  const onSubmit = async (values) => {
    console.log(values);
    toast.loading("Creating new coupon...", {
      id: "creating-coupon",
    });
    try {
      const response = await createCoupon(values);
      console.log(response);
      if (response.success) {
        toast.success("Coupon created successfully!", {
          id: "creating-coupon",
        });
        setIsNewCouponDialogOpen(false);
      } else {
        toast.error(response.message, {
          id: "creating-coupon",
        });
      }
    } catch (err) {
      toast.error("Internal server error!, try again later", {
        id: "creating-coupon",
      });
    }
  };
  return (
    <Dialog
      open={isNewCouponDialogOpen}
      onOpenChange={setIsNewCouponDialogOpen}
    >
      <div className="w-full  flex items-end justify-end">
        {" "}
        <DialogTrigger className=" ml-auto justify-self-end ">
          <Button className="ml-auto">Create Coupon</Button>
        </DialogTrigger>
      </div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new Coupon</DialogTitle>
          <DialogDescription>
            Enter the details for the new coupon
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-1 flex-col sm:gap-4 sm:py-4">
          <div className="">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col sm:gap-2 w-full">
                  <div className=" flex  gap-2  flex-col">
                    <FormField
                      control={form.control}
                      name="couponCode"
                      render={({ field }) => (
                        <FormItem className="">
                          <FormLabel>Coupon Code</FormLabel>
                          <FormControl>
                            <Input placeholder="JOC334" {...field} />
                          </FormControl>
                          <FormDescription>
                            This coupon code can be used while making invoices.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="discount"
                      render={({ field }) => (
                        <FormItem className="">
                          <FormLabel>Discount Percent</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="10" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter the percentage of discount to be given
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex  flex-col  ">
                    <FormField
                      control={form.control}
                      name="validity"
                      render={({ field }) => (
                        <FormItem className="flex flex-col ">
                          <FormLabel>Coupon Validity</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-[240px] pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            Select the date until you want the coupon to remain
                            active
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="couponType"
                      render={({ field }) => (
                        <FormItem className="">
                          <FormLabel>Coupon Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select the coupon type" />
                              </SelectTrigger>
                            </FormControl>

                            <SelectContent>
                              {[
                                {
                                  value: "percentage",
                                  label: "Percentage",
                                },
                                { value: "fixed", label: "Fixed" },
                              ].map((item, idx) => (
                                <SelectItem value={item.value} key={idx}>
                                  {item.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Select the coupon type
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className=" flex  flex-col">
                    <FormField
                      control={form.control}
                      name="maxDiscount"
                      render={({ field }) => (
                        <FormItem className="">
                          <FormLabel>Maximum Discount</FormLabel>
                          <FormControl>
                            <Input placeholder="500" {...field} className="" />
                          </FormControl>
                          <FormDescription>
                            Enter maximum discount amount. Enter 0 for no limit
                          </FormDescription>
                        </FormItem>
                      )}
                    />

                    <div></div>
                  </div>
                </div>
                <div className="mt-4 w-full ">
                  {" "}
                  <Button type="submit" className="w-full">
                    Create Coupon
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
