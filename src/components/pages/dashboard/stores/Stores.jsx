import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  ArrowUpDown,
  MoreHorizontal,
  Pencil,
  PlusIcon,
  Trash,
} from "lucide-react";
import Link from "next/link";
import React, { Suspense, useState } from "react";
import EditStoreDialog from "./EditStoreDialog";
import DeleteStoreDialog from "./DeleteStoreDialog";
import NewStoreDialog from "./NewStoreDialog";

export default function Stores({}) {
  const [selectedStore, setSelectedStore] = useState();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);

  // Utility function to truncate text
  const truncateText = (text, maxLength) => {
    if (!text) return "";
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  const columns = [
    {
      accessorKey: "code",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Store Code <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "storeName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Store Name <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ cell }) => truncateText(cell.getValue(), 20), // Truncate store name to 20 characters
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone Number",
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ cell }) => truncateText(cell.getValue(), 30), // Truncate address to 30 characters
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Modified <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ cell }) => new Date(cell.row.original.updatedAt).toDateString(),
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
                  setSelectedStore(row.original);
                  setIsEditDialogOpen(true);
                }}
              >
                <Pencil className="h-3.5 w-3.5 mr-1.5" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedStore(row.original);
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

  const { data, isLoading, error } = useQuery({
    queryKey: ["store", isEditDialogOpen, isDeleteDialogOpen],
    queryFn: async () => {
      const response = await axios.get("/api/getStores");
      return response.data;
    },
  });

  if (isLoading) return "Loading...";

  return (
    <div className="p-6 bg-slate-50 rounded-xl shadow-md w-full max-lg:max-w-[83vw] max-w-[90vw] overflow-clip lg:min-w-max flex-1">
      <Card className="w-full mt-5 h-max max-w-[75vw] mx-auto">
        <CardHeader>
          <CardTitle>Stores</CardTitle>
          <CardDescription>
            Manage your stores and view their details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-end">
              <Button
                size="sm"
                className="h-8 gap-1"
                onClick={() => setIsNewDialogOpen(true)}
              >
                <PlusIcon className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  New Store
                </span>
              </Button>
            </div>
            <Suspense isLoading={isLoading}>
              <DataTable columns={columns} data={data} />
            </Suspense>
          </div>
        </CardContent>
      </Card>
      {selectedStore && (
        <>
          <EditStoreDialog
            isOpen={isEditDialogOpen}
            setIsOpen={setIsEditDialogOpen}
            store={selectedStore}
          />
          <DeleteStoreDialog
            isOpen={isDeleteDialogOpen}
            setIsOpen={setIsDeleteDialogOpen}
            store={selectedStore}
          />
        </>
      )}
      <NewStoreDialog isOpen={isNewDialogOpen} setIsOpen={setIsNewDialogOpen} />
    </div>
  );
}
