import axios from "axios";
import { useInvoiceStore } from "@/store/store";
import { useEffect, useState } from "react";
import PrintInvoiceDialog from "./invoices/PrintInvoiceDialog";
import { DataTable } from "@/components/ui/data-table";
import {
  ArrowUpDown,
  MoreHorizontalIcon,
  PlusIcon,
  PrinterIcon,
  EditIcon,
  TrashIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteInvoiceDialog from "./invoices/DeleteInvoiceDialog";
import { useRouter } from "next/navigation";


export default function Invoices({ data }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isPrintInvoiceDialogOpen, setIsPrintInvoiceDialogOpen] =
    useState(false);
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()


  // Zustand global store hooks
  const {
    setOrderNumber,
    setCustomerName,
    setPhoneNumber,
    setSubTotal,
    setEmailId,
    setProducts,
    setNotes,
    setPaymentMode,
    setTax,
    setTaxValue,
    setPaymentStatus,
    setPaid,

    setInvoiceDate,
    setStore, // Store setter
  } = useInvoiceStore();

  // Function to fetch all stores
  const getStores = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/getStores");
      setStores(response.data);
    } catch (error) {
      console.error("Error fetching stores:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter the store using storeName from invoice
  const findStoreDetails = (storeName) => {
    const storeDetails = stores.find((store) => store.code === storeName);
    return storeDetails || null;
  };

  useEffect(() => {
    getStores();
  }, []);
  const printInvoice = async (invoice) => {
    if (stores.length === 0) {
      await getStores();
    }

    const storeDetails = findStoreDetails(invoice.storeName);

    setOrderNumber(invoice.orderNumber);
    setCustomerName(invoice.customerName);
    setPhoneNumber(invoice.phoneNumber);
    setSubTotal(invoice.subTotal);
    setEmailId(invoice.emailId);
    setPaymentMode(invoice.paymentMode);
    setInvoiceDate(new Date(invoice.createdAt).toLocaleDateString());
    setPaid(invoice.amountPaid);
    setTax(invoice.tax);
    setTaxValue(invoice.taxValue);
    setProducts(invoice.items); // Assuming `items` is the products list
    setNotes(invoice.notes);

    if (storeDetails) {
      setStore(storeDetails);
      setIsPrintInvoiceDialogOpen(true);
    } else {
      console.warn(
        `Store details not found for store name: ${invoice.storeName}`
      );
    }
  };

  const handleDeleteClick = (invoice) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  const columns = [
    {
      accessorKey: "orderNumber",
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
      accessorKey: "customerName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Customer Name <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone Number",
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ cell }) => {
        return new Date(cell.row.original.createdAt).toDateString();
      },
    },
    {
      accessorKey: "subTotal",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount <ArrowUpDown className="ml-2 h-4 w-4" />
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
    },
    {
      accessorKey: "clientSource",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Client Source <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <MoreHorizontalIcon className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => printInvoice(row.original)}>
              <PrinterIcon className="mr-2 h-4 w-4" />
              <span>Print</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/edit/id=${row.original.orderNumber}`)}>
              <EditIcon className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDeleteClick(row.original)}>
              <TrashIcon className="mr-2 h-4 w-4 text-red-500" />
              <span className="text-red-500">Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="max-lg:max-w-[83vw] max-w-[90vw] flex-1 custom-scrollbar p-6 bg-slate-50 rounded-xl shadow-md w-full">
      <Card className="w-full mt-5 h-max mx-auto">
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>
            Manage your invoices and view their details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-end">
              <Link href="/invoice">
                <Button size="sm" className="h-8 gap-1">
                  <PlusIcon className="h-4 w-4" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    New Invoice
                  </span>
                </Button>
              </Link>
            </div>
            <DataTable
              columns={columns}
              data={data}
              initialSorting={[
                {
                  id: "createdAt",
                  desc: true,
                },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      <DeleteInvoiceDialog
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        invoice={selectedInvoice}
      />

      <PrintInvoiceDialog
        isOpen={isPrintInvoiceDialogOpen}
        setIsOpen={setIsPrintInvoiceDialogOpen}
      />
    </div>
  );
}
