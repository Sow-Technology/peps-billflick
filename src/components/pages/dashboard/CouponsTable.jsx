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
import { ArrowUpDown, PlusIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import CreateCouponsDialog from "./coupons/CreateCouponsDialog";
const columns = [
  {
    accessorKey: "couponCode",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Invoice <ArrowUpDown className="ml-2 h-4 w-4" />
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
      return cell.row.original.validity.toLocaleDateString();
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
];
export default function CouponsTable({ data }) {
  return (
    <Card className="col-span-2 lg:col-span-3  w-full">
      <CardHeader>
        <CardTitle>Coupons</CardTitle>
        <CardDescription>
          Manage your coupons and view their details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CreateCouponsDialog data={data} />
        <div className="flex flex-col gap-4 w-full my-4">
          <DataTable columns={columns} data={data} />
        </div>
      </CardContent>
    </Card>
  );
}
