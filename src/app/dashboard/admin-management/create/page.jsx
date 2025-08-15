import ComponentCard from "@/components/common/ComponentCard";
import CreateUser from "@/components/form/form-elements/CreateUser";
import React from "react";

const page = () => {
  return (
    <div className="dark:text-white">
      <h2 className="text-xl font-semibold mb-6">User Create</h2>
      <ComponentCard title={"Input Data User"}>
        <CreateUser />
      </ComponentCard>
    </div>
  );
};

export default page;
