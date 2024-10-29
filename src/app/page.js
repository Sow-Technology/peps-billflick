import React, { Suspense } from "react";
import Dashboard from "../components/pages/Dashboard";

const page = () => {
  return (
    <Suspense>
      <Dashboard />
    </Suspense>
  );
};

export default page;
