"use client";

import { useEffect, useState } from "react";
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
import {
  ArrowUpDown,
  Loader,
  MoreHorizontal,
  Pencil,
  Trash,
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import AddExpensesDialog from "./AddExpensesDialog";
import { updateInvoice } from "@/app/_actions/invoice";

const Expenses = () => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [expense, setExpense] = useState(0);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddExpenseDialogOpen, setIsAddExpenseDialogOpen] = useState(false); // For Add Expense Dialog
  const [invoiceToAddExpenses, setInvoiceToAddExpenses] = useState(null);

  const {
    data: invoices,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const response = await axios.get("/api/storedata");
      return response.data;
    },
  });

  const calculateTotalProfit = (orderValue, orderExpenses) => {
    return orderValue - (parseInt(orderExpenses, 10) || 0);
  };

  const calculateAzspire15 = (orderValue, storeName) => {
    return storeName?.includes("Trinity") ? (orderValue * 15) / 100 : "N/A";
  };

  const calculateRemainingProfit = (totalProfit, azspire15) => {
    return azspire15 !== "N/A" ? totalProfit - azspire15 : totalProfit;
  };

  const handleAddExpensesClick = (invoice) => {
    setInvoiceToAddExpenses(invoice);
    setIsAddExpenseDialogOpen(true);
  };

  const columns = [
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
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Order Date <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const orderDate = new Date(row.original.createdAt);
        return orderDate.toLocaleDateString();
      },
    },
    {
      accessorKey: "orderNumber",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Order Number <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "subTotal",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Order Value <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "orderExpenses",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Order Expenses <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const expenses = row.original.orderExpenses;
        return expenses ? (
          expenses
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleAddExpensesClick(row.original)}
          >
            Add Expenses
          </Button>
        );
      },
    },
    {
      accessorKey: "totalProfit",
      header: "Total Profit",
      cell: ({ row }) => {
        const totalProfit = calculateTotalProfit(
          row.original.subTotal,
          row.original.orderExpenses
        );
        return totalProfit;
      },
    },
    {
      accessorKey: "azspire15",
      header: "Azspire 15%",
      cell: ({ row }) => {
        const totalProfit = calculateTotalProfit(
          row.original.subTotal,
          row.original.orderExpenses
        );
        const azspire15 = calculateAzspire15(
          row.original.subTotal,
          row.original.storeName
        );
        return azspire15;
      },
    },
    {
      accessorKey: "remainingProfit",
      header: "Remaining Profit",
      cell: ({ row }) => {
        const totalProfit = calculateTotalProfit(
          row.original.subTotal,
          row.original.orderExpenses
        );
        const azspire15 = calculateAzspire15(
          totalProfit,
          row.original.storeName
        );
        const remainingProfit = calculateRemainingProfit(
          totalProfit,
          azspire15
        );
        return remainingProfit;
      },
    },
  ];

  const handleUpdate = async () => {
    setIsAddExpenseDialogOpen(false);
    const totalProfit = calculateTotalProfit(
      invoiceToAddExpenses.subTotal,
      expense
    );
    const azspire15 = calculateAzspire15(
      invoiceToAddExpenses.subTotal,
      invoiceToAddExpenses.storeName
    );
    const remainingProfit = calculateRemainingProfit(totalProfit, azspire15);

    await updateInvoice({
      ...invoiceToAddExpenses,
      orderExpenses: expense,
      aspire15: azspire15 === "N/A" ? null : azspire15,
      profit: remainingProfit,
    });

    // Reset states
    setInvoiceToAddExpenses(null);
    setExpense(0); // Reset expense state here
    refetch();
  };

  if (isLoading) return <Loader />;

  return (
    <div className="p-6 bg-slate-50 rounded-xl shadow-md w-full max-lg:max-w-[83vw] max-w-[95vw] overflow-clip lg:min-w-max flex-1">
      <Card className="w-full mt-5 h-max max-w-[75vw] mx-auto">
        <CardHeader>
          <CardTitle>Expenses</CardTitle>
          <CardDescription>
            Manage your invoices and view their details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <DataTable columns={columns} data={invoices} />
          </div>
        </CardContent>
      </Card>

      {invoiceToAddExpenses && (
        <AddExpensesDialog
          isOpen={isAddExpenseDialogOpen}
          setIsOpen={setIsAddExpenseDialogOpen}
          invoice={invoiceToAddExpenses}
          expense={expense}
          setExpense={setExpense}
          handleUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default Expenses;
