"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Money } from "@mui/icons-material";
import {
  BarChartIcon,
  FormInput,
  LayoutDashboardIcon,
  Receipt,
  ReceiptIcon,
  Store,
  TicketCheck,
  Users,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import { AiFillProduct } from "react-icons/ai";
import { PiSignOutBold } from "react-icons/pi";

export default function Sidebar({ active, setActive, user }) {
  const [open, setOpen] = useState(true);

  return (
    <aside
      className={cn(
        "bg-gray-50 z-10 flex h-screen flex-col transition-all duration-300 pt-4 md:pt-10 shadow-lg pl-2",
        open ? "w-64 sticky left-0 top-0" : "w-16 sticky left-0 top-0"
      )}
    >
      {/* Sidebar Header with Logo */}
      <div className="flex items-center justify-between px-4 py-4">
        <Image
          src={open ? "/logo.svg" : "/icon.svg"}
          alt=""
          width={open ? 180 : 50}
          height={50}
          className="transition-all duration-300 -my-[68px]"
        />
        {/* <button
          onClick={() => setOpen(!open)}
          className="p-2 bg-blue-600 text-white rounded-md"
        >
          {open ? "Close" : "Open"}
        </button> */}
      </div>

      {/* Navigation Menu */}
      <nav className="flex flex-col gap-2 py-2 text-gray-700">
        <TooltipProvider>
          {[
            "Invoices",
            "Dashboard",
            "Order Form",
            "Coupons",
            "Products",
            "Stores",
            "Users",
            "Expense Table",
            "Quotes",
          ].map((item) => (
            <div
              key={item}
              className={cn(
                "flex items-center gap-3 cursor-pointer px-4 py-3 hover:bg-gray-200 rounded-lg",
                active == item && "bg-blue-600 text-white"
              )}
              onClick={() => setActive(item)}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="#"
                    className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors"
                  >
                    {getIcon(item)}
                  </Link>
                </TooltipTrigger>
                {!open && <TooltipContent side="right">{item}</TooltipContent>}
              </Tooltip>
              {open && <span>{item}</span>}
            </div>
          ))}
        </TooltipProvider>
      </nav>

      {/* Sign out button */}
      <div className="mt-auto px-4 py-4">
        <button
          className="flex items-center gap-2 text-red-600 hover:text-red-800"
          onClick={() => {
            signOut();
            redirect("/auth");
          }}
        >
          <PiSignOutBold className="h-6 w-6" />
          {open && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  );
}

// Function to get icons based on the item
function getIcon(item) {
  switch (item) {
    case "Invoices":
      return <ReceiptIcon className="h-5 w-5" />;
    case "Order Form":
      return <FormInput className="h-5 w-5" />;
    case "Dashboard":
      return <LayoutDashboardIcon className="h-5 w-5" />;
    case "Analytics":
      return <BarChartIcon className="h-5 w-5" />;
    case "Coupons":
      return <TicketCheck className="h-5 w-5" />;
    case "Products":
      return <AiFillProduct className="h-5 w-5" />;
    case "Stores":
      return <Store className="h-5 w-5" />;
    case "Users":
      return <Users className="h-5 w-5" />;
    case "Expense Table":
      return <Money className="h-5 w-5" />;
    case "Quotes":
      return <TicketCheck className="h-4 w-4 md:h-5 md:w-5" />;
    default:
      return null;
  }
}
