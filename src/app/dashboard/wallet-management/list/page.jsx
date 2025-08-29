import ComponentCard from "@/components/common/ComponentCard";
import ListWallet from "@/components/tables/ListWallet";
import React from "react";

const page = () => {
  return (
    <div className="dark:text-white">
      <h2 className="text-xl font-semibold mb-6">List Wallet</h2>
      <ComponentCard title={"All Wallet"}>
        <ListWallet />
      </ComponentCard>
    </div>
  );
};

export default page;
