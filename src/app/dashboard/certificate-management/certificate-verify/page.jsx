import ComponentCard from "@/components/common/ComponentCard";
import React from "react";
import DropzoneVerifyComponent from "@/components/form/form-elements/DropZoneVerify";

const page = () => {
  return (
    <div className="dark:text-white">
      <h2 className="text-xl font-semibold mb-6">Certificate Verify</h2>
      <ComponentCard title={"Input JSON"}>
        <DropzoneVerifyComponent />
      </ComponentCard>
    </div>
  );
};

export default page;
