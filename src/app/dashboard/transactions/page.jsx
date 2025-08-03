import ComponentCard from "@/components/common/ComponentCard";
import ListTransactions from "@/components/tables/ListTransactions";
import React from "react";

const page = () => {
  return (
    <div className="dark:text-white">
      <h2 className="text-xl font-semibold mb-6">List Transactions</h2>
      <ComponentCard title={"All Transactions"}>
        <ListTransactions/>
      </ComponentCard>
    </div>
  );
};

export default page;
