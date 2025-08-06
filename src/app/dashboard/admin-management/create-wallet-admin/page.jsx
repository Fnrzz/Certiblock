import ComponentCard from "@/components/common/ComponentCard";
import AddWalletUser from "@/components/form/form-elements/AddWalletUser";
import React from "react";

export default function page() {
  return (
    <div className="space-y-6">
      <ComponentCard title="Add User Wallet">
        <AddWalletUser />
      </ComponentCard>
    </div>
  );
}
