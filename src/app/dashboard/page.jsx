import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import React from "react";

const page = () => {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <DashboardMetrics />
        {/* <MonthlySalesChart /> */}
      </div>
    </div>
  );
};

export default page;
