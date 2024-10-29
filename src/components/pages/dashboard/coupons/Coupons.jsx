import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { cn } from "@/lib/utils";
import {
  ArrowUpDown,
  MoreHorizontal,
  Pencil,
  PlusIcon,
  Trash,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import CreateCouponsDialog from "./CreateCouponsDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditCouponDialog from "./EditCouponDialog";
import DeleteCouponDialog from "./DeleteCouponDialog";

export default function Coupons({}) {
  const [selectedCoupon, setSelectedCoupon] = useState();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState();
  const [isNewCouponDialogOpen, setIsNewCouponDialogOpen] = useState(false);
  const { data, isLoading, error } = useQuery({
    queryKey: [
      "store",
      isDeleteDialogOpen,
      isNewCouponDialogOpen,
      isEditDialogOpen,
    ],
    queryFn: async () => {
      const response = await axios.get("/api/coupon");
      return response.data;
    },
  });
  const columns = [
    {
      accessorKey: "couponCode",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Coupon Code <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "couponType",
      header: "Coupon Type",
    },
    {
      accessorKey: "validity",
      header: "Validity",
      cell: ({ cell }) => {
        return new Date(cell.row.original.validity).toLocaleDateString();
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ cell }) => (
        <Badge
          className={cn(
            cell.row.original.status == "Active"
              ? "bg-green-700 "
              : "bg-rose-700",
            "px-5 py-1.5"
          )}
        >
          {cell.row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedCoupon(row.original);
                  setIsEditDialogOpen(true);
                }}
              >
                <Pencil className="h-3.5 w-3.5 mr-1.5" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedCoupon(row.original);
                  setIsDeleteDialogOpen(true);
                }}
              >
                <Trash className="h-3.5 w-3.5 mr-1.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  console.log(data);
  if (isLoading) return "Loading...";
  if (error) return "err...";
  return (
    <div className="p-6 bg-slate-50 rounded-xl shadow-md w-full max-lg:max-w-[83vw] max-w-[90vw] lg:min-w-max flex-1">
      <Card className="w-full mt-5 h-max  mx-auto">
        {" "}
        <CardHeader>
          <CardTitle>Coupons</CardTitle>
          <CardDescription>
            Manage your coupons and view their details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateCouponsDialog
            data={data}
            isNewCouponDialogOpen={isNewCouponDialogOpen}
            setIsNewCouponDialogOpen={setIsNewCouponDialogOpen}
          />
          <div className="flex flex-col gap-4 w-full my-4">
            <DataTable columns={columns} data={data} />
          </div>
        </CardContent>
      </Card>
      {selectedCoupon && (
        <>
          <EditCouponDialog
            isOpen={isEditDialogOpen}
            setIsOpen={setIsEditDialogOpen}
            coupon={selectedCoupon}
          />
          <DeleteCouponDialog
            isOpen={isDeleteDialogOpen}
            setIsOpen={setIsDeleteDialogOpen}
            coupon={selectedCoupon}
          />
        </>
      )}
    </div>
  );
}
