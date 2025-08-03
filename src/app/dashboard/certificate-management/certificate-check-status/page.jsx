import ComponentCard from "@/components/common/ComponentCard";
import CheckStatusTransaction from "@/components/form/form-elements/CheckStatusTransaction";
import React from "react";

const page = () => {
  return (
    <div className="dark:text-white">
      <h2 className="text-xl font-semibold mb-6">Certificate Check Status</h2>
      <ComponentCard title={"Input Transaction Hash"}>
        <CheckStatusTransaction />
      </ComponentCard>
    </div>
  );
};

export default page;
