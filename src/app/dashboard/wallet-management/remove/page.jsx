import ComponentCard from "@/components/common/ComponentCard";
import RemoveWalletUser from "@/components/form/form-elements/RemoveWalletUser";
import React from "react";

export default function page() {
  return (
    <div className="space-y-6">
      <ComponentCard title="Remove User Wallet">
        <RemoveWalletUser />
      </ComponentCard>
    </div>
  );
}
