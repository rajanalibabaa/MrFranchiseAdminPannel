import React, { useState } from "react";
import { Box } from "@mui/material";
import PaymentPackageForm from "../../Components/Brands/AdvertiseCreationHandling/PaymentPackageForm";
import PaymentPackageList from "../../Components/Brands/AdvertiseCreationHandling/PaymentPackageList";

const PaymentPackagesPage = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);

  return (
    <Box sx={{ p: 3 }}>
      <PaymentPackageForm
        selectedPackage={selectedPackage}
        onSuccess={() => setSelectedPackage(null)}
      />
      <PaymentPackageList onEdit={setSelectedPackage} />
    </Box>
  );
};

export default PaymentPackagesPage;
