import ComponentCard from "@/components/common/ComponentCard";
import CreateCertificate from "@/components/form/form-elements/CreateCertificate";
import React from "react";

const page = () => {
  return (
    <div className="dark:text-white">
      <h2 className="text-xl font-semibold mb-6">Certificate Create</h2>
      <ComponentCard title={"Input Data Student"}>
        <CreateCertificate />
      </ComponentCard>
    </div>
  );
};

export default page;
