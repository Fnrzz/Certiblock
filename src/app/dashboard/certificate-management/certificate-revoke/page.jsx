import ComponentCard from "@/components/common/ComponentCard";
import DropzoneRevokeComponent from "@/components/form/form-elements/DropZoneRevoke";
import React from "react";

const page = () => {
  return (
    <div className="dark:text-white">
      <h2 className="text-xl font-semibold mb-6">Certificate Revoke</h2>
      <ComponentCard title={"Input JSON"}>
        <DropzoneRevokeComponent />
      </ComponentCard>
    </div>
  );
};

export default page;
