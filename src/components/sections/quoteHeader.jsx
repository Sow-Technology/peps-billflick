/* eslint-disable @next/next/no-img-element */
import { storesData } from "@/lib/data";
import { useInvoiceStore } from "@/store/store";
import Image from "next/image";
import React from "react";

const Header = () => {
  const { store } = useInvoiceStore();
  console.log(store);
  return (
    <>
      <header className="flex  items-center  mb-5 flex-row justify-between border-t-8 pt-5 border-[#283592]">
        <div>
          {" "}
          <h1 className="text-3xl text-[#6d64e8] mb-3">{store?.storeName}</h1>
          <p className="text-[#666666] text-sm max-w-[280px] leading-[25px]">
            <div>
              <span>{store?.address}</span>
              <span className="block"> {store?.phoneNumber}</span>
            </div>
          </p>
          <h2 className="font-bold text-[#283592] text-5xl mt-7">Quote</h2>
        </div>
        <div className=" ">
          <img
            src={`/api/files/?id=${store?.logo}`}
            alt="Logo"
            width={200}
            height={200}
            className="p-7 pt-0"
          />
        </div>
      </header>
    </>
  );
};

export default Header;
