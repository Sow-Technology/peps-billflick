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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowUpDown,
  Loader,
  MoreHorizontal,
  Pencil,
  PlusIcon,
  Trash,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import EditProductDialog from "./EditProductDialog";
import NewProductDialog from "./NewProductDialog";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import DeleteProductDialog from "./DeleteProductDialog";

export default function Products() {
  const [selectedProduct, setSelectedProduct] = useState();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);

  const {
    data,
    isLoading,
    isError: isProductsError,
    refetch,
  } = useQuery({
    queryKey: ["products", selectedProduct, isNewDialogOpen],
    queryFn: async () => {
      const response = await axios.get("/api/products");
      return response.data;
    },
  });

  const handleProductEdit = (product) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
    refetch();
  };

  const columns = [
    {
      accessorKey: "code",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Product Code <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "productName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Product Name <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "quantity",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quantity <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "unitPrice",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
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
              <DropdownMenuItem onClick={() => handleProductEdit(row.original)}>
                <Pencil className="h-3.5 w-3.5 mr-1.5" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedProduct(row.original);
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
  if (isLoading) return <Loader />;

  return (
    <div className="p-6 bg-slate-50 rounded-xl shadow-md w-full max-lg:max-w-[83vw] max-w-[90vw] lg:min-w-max flex-1 ">
      <Card className="w-full mt-5 h-max mx-auto">
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>
            Manage your products and view their details.
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
                  New Product
                </span>
              </Button>
            </div>
            <DataTable columns={columns} data={data} />
          </div>
        </CardContent>
      </Card>
      {selectedProduct && (
        <>
          <EditProductDialog
            isOpen={isEditDialogOpen}
            setIsOpen={setIsEditDialogOpen}
            product={selectedProduct}
          />
          <DeleteProductDialog
            isOpen={isDeleteDialogOpen}
            setIsOpen={setIsDeleteDialogOpen}
            product={selectedProduct}
          />
        </>
      )}
      <NewProductDialog
        isOpen={isNewDialogOpen}
        setIsOpen={setIsNewDialogOpen}
      />
    </div>
  );
}
