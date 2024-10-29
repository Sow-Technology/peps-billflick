"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import FlickeringGrid from "@/components/ui/flickering-grid";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState();
  const session = useSession();
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(email, password);
    // Add your form submission logic here
    await signIn("credentials", { email, password });
  };
  if (session.status == "authenticated") {
    router.push("/");
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 relative rounded-lg w-full overflow-hidden">
      <FlickeringGrid
        className="z-0 absolute inset-0 size-full"
        squareSize={2}
        gridGap={16}
        color="#60A5FA"
        maxOpacity={0.5}
        flickerChance={0.1}
        height={1000}
        width={1800}
      />
      <Card className="w-full z-10 max-w-md p-6 bg-white shadow-md rounded-lg">
        <CardHeader>
          <h1 className="text-2xl font-bold text-gray-900">
            {isRegistering ? "Register" : "Login"}
          </h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
            <div>
              <Label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </Label>
              <Input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>

            <Button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isRegistering ? "Register" : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="mt-4 text-center">
          <Button
            variant="link"
            className="text-blue-500 hover:text-blue-700"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering
              ? "Already have an account? Login"
              : "New user? Register"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
