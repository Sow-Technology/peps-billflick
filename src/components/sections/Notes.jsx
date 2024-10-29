import { useInvoiceStore } from "@/store/store";
import React from "react";

const Notes = () => {
  const { notes } = useInvoiceStore();
  return (
    <>
      <section className="mt-10 mb-5 flex flex-col max-w-full">
        <h3>Additional notes</h3>
        <p className=" max-w-full break-words whitespace-normal text-wrap">
          {notes}
        </p>
      </section>
    </>
  );
};

export default Notes;
