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
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import EditUserDialog from "./EditUserDialog";
// import NewUserDialog from "./NewUserDialog";
import DeleteUserDialog from "./DeleteUserDialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function Users() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);

  const {
    data: users,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["users", selectedUser, isEditDialogOpen, isDeleteDialogOpen],
    queryFn: async () => {
      const response = await axios.get("/api/getUsers");
      return response.data;
    },
  });

  const handleUserEdit = (user) => {
    if (user.role == "superuser") return toast.error("Cannot edit superuser.");
    setSelectedUser(user);
    setIsEditDialogOpen(true);
    refetch();
  };

  const handleUserDelete = (user) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const columns = [
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "storeAccess",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Store Access <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex gap-2 flex-wrap">
          {row.original.storeAccess.map((store) => {
            console.log(store);
            return <Badge key={store}>{store}</Badge>;
          })}
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleUserEdit(row.original)}>
              <Pencil className="h-3.5 w-3.5 mr-1.5" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleUserDelete(row.original)}>
              <Trash className="h-3.5 w-3.5 mr-1.5" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  if (isLoading) return <Loader />;

  return (
    <div className="p-6 bg-slate-50 rounded-xl shadow-md w-fullmax-lg:max-w-[83vw] max-w-[90vw] lg:min-w-max flex-1 ">
      <Card className="w-full mt-5 h-max mx-auto">
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Manage your users and view their details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <DataTable columns={columns} data={users} />
          </div>
        </CardContent>
      </Card>
      {selectedUser && (
        <>
          <EditUserDialog
            isOpen={isEditDialogOpen}
            setIsOpen={setIsEditDialogOpen}
            user={selectedUser}
          />
          <DeleteUserDialog
            isOpen={isDeleteDialogOpen}
            setIsOpen={setIsDeleteDialogOpen}
            user={selectedUser}
          />
        </>
      )}
    </div>
  );
}
