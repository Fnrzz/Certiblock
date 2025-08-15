import ComponentCard from "@/components/common/ComponentCard";
import ListAdmin from "@/components/tables/ListAdmin";
import React from "react";

const page = () => {
  return (
    <div className="dark:text-white">
      <h2 className="text-xl font-semibold mb-6">List Admin</h2>
      <ComponentCard title={"All Admin"}>
        <ListAdmin />
      </ComponentCard>
    </div>
  );
};

export default page;
