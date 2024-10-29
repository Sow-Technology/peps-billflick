"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

export default function UserPanel() {
  const { data: session, status } = useSession(); // Destructure session and status
  const [users, setUsers] = useState([]); // Initialize as an empty array

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user?.role !== "superuser") {
        // Redirect if not superuser
        console.log("Not a superuser, redirecting...");
        // window.location.href = '/unauthorized'; // Redirect to unauthorized page
        fetchUsers();
      } else {
        fetchUsers();
      }
    }
  }, [session, status]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users", {
        headers: {
          role: session?.user?.role || "user",
        },
      });

      const data = await res.json();

      // Check if users is an array and set it in state
      if (Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        console.error("Invalid users data", data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const handleRoleChange = async (userId, role) => {
    const res = await fetch("/api/users", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        superuser: session?.user?.role === "superuser", // Pass the superuser status
      },
      body: JSON.stringify({ userId, role }),
    });

    const updatedUser = await res.json();

    // Update the users state after role change
    if (updatedUser && updatedUser._id) {
      setUsers(
        users.map((user) => (user._id === updatedUser._id ? updatedUser : user))
      );
    }
  };

  const handleStoreAccessChange = async (userId, storeAccess) => {
    const res = await fetch("/api/users", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        superuser: session?.user?.role === "superuser", // Pass the superuser status
      },
      body: JSON.stringify({ userId, storeAccess }),
    });

    const updatedUser = await res.json();

    // Update the users state after store access change
    if (updatedUser && updatedUser._id) {
      setUsers(
        users.map((user) => (user._id === updatedUser._id ? updatedUser : user))
      );
    }
  };

  if (status === "loading") {
    // While status is loading, show a loading indicator or message
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">User Management Panel</h1>
      <Table className="min-w-full bg-white">
        <TableHeader>
          <TableRow>
            <TableHead className="px-4 py-2">Email</TableHead>
            <TableHead className="px-4 py-2">Role</TableHead>
            <TableHead className="px-4 py-2">Store Access</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell className="border px-4 py-2">{user.email}</TableCell>
              <TableCell className="border px-4 py-2">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  className="border p-1"
                >
                  <option value="user">User</option>
                  <option value="superuser">Superuser</option>
                </select>
              </TableCell>
              <TableCell className="border px-4 py-2">
                <input
                  type="text"
                  value={user.storeAccess.join(", ")}
                  onChange={(e) =>
                    handleStoreAccessChange(user._id, e.target.value.split(","))
                  }
                  className="border p-1"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}









