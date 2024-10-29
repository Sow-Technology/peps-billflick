"use client";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function RoleAlert() {
  const { data: session } = useSession();
  if (!session) {
    redirect("/auth");
  }
  return (
    <Alert>
      <AlertTitle>Limited Access</AlertTitle>
      <AlertDescription>
        You do not have permission to access this page.
      </AlertDescription>
      <div>
        <Button onClick={signOut}>Logout</Button>
      </div>
    </Alert>
  );
}
