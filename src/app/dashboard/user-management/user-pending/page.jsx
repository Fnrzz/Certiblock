import ComponentCard from "@/components/common/ComponentCard";
import UserPendingTable from "@/components/tables/UserPendingTable";
import React from "react";

export default function page() {
  return (
    <div className="space-y-6">
      <ComponentCard title="User Pending">
        <UserPendingTable />
      </ComponentCard>
    </div>
  );
}
