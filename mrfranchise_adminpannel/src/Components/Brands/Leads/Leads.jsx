import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { GetApiCall } from "../../../api/default/GetApi";
import { Api } from "../../../api/apiurl";

import PackageCard from "../../../ui/cards/PackageCard";
import LeadsTableOutlet from "../../../ui/tables/LeadsTableOutlet";

import { Box, Typography, CircularProgress } from "@mui/material";

const Leads = () => {
  const token = useSelector((state) => state.admin.adminData?.adminAccessToken);
  const { id } = useParams();

  const [brandPackage, setBrandPackage] = useState(null);
  const [leads, setLeads] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null); // <-- selected state

  useEffect(() => {
    if (!id || !token) return;

    (async () => {
      try {
        const res = await GetApiCall(
          `${Api.admin.brand.getBrandByID}/${id}`,
          token,
          { paymentHistory: true }
        );

        const responseData = res?.data;
        setBrandPackage(responseData?.data || null);

        if (responseData?.statuscode === 200) {
          const res2 = await GetApiCall(
            `${Api.admin.get.brands.getleadsbybrandid}/${id}`,
            token,
            {
              packageStartDate:
                responseData?.data?.activePackage?.packageUpdatedTime,
            }
          );

          if (res2?.data?.statuscode === 200) {
            setLeads(res2?.data?.data.leads);
            setPagination(res2?.data?.data.pagination);
          }
        }
      } catch (error) {
        console.error("Error fetching brand:", error);
      }
    })();
  }, [id, token]);

  if (!brandPackage)
    return (
      <Box p={4} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );

  const handlePackageClick = async (pkg) => {
     setSelectedPackage(pkg);
    // console.log("Selected package:", pkg);
    // console.log("Selected package:", pkg);
    // if (pkg?.packageUpdatedTime === selectedPackage?.packageUpdatedTime || pkg?.packageStartTime === selectedPackage?.packageStartTime) {
    //   return
    // }
   
    let queryParams = {};
    if (pkg.packageType === "free") {
      queryParams = {
        status: pkg?.isActive,
        leadType: pkg?.packageType,
      };
    } else {
      queryParams = {
        packageStartDate: pkg?.packageUpdatedTime || pkg.packageStartTime,
        status: pkg?.isActive,
        leadType: "paid",
      };
    }

    // console.log("queryParams :", queryParams);
    const res2 = await GetApiCall(
      `${Api.admin.get.brands.getleadsbybrandid}/${id}`,
      token,
      queryParams
    );

    console.log("res2 :",res2.data)
    if (res2?.data?.statuscode === 200) {
      setLeads(res2?.data?.data?.leads);
      setPagination(res2?.data?.data?.pagination);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="600" mb={2}>
        Packages
      </Typography>

      <Box
        display="flex"
        gap={2}
        sx={{
          overflowX: "auto",
          pb: 1,
          "&::-webkit-scrollbar": { height: 6 },
          "&::-webkit-scrollbar-thumb": { background: "#ccc", borderRadius: 2 },
        }}
      >
        {/* Active Package */}
        {brandPackage.activePackage && (
          <Box
            sx={{
              // minWidth: 260,
              cursor: "pointer",
              border:
                selectedPackage === brandPackage.activePackage
                  ? "2px solid #08612c"
                  : "2px solid transparent",
              borderRadius: 2,
              // transition: "border 0.2s",
            }}
            onClick={() => handlePackageClick(brandPackage.activePackage)}
          >
            <PackageCard
              data={brandPackage.activePackage}
              background="#08612cff"
              color="white"
            />
          </Box>
        )}

        {/* Old Packages */}
        {brandPackage.oldPackageHistory?.length > 0 &&
          brandPackage.oldPackageHistory.map((pkg, i) => (
            <Box
              key={i}
              sx={{
                // minWidth: 260,
                cursor: "pointer",
                border:
                  selectedPackage === pkg
                    ? "2px solid #08612c"
                    : "2px solid transparent",
                borderRadius: 2,
                transition: "border 0.2s",
              }}
              onClick={() => handlePackageClick(pkg)}
            >
              <PackageCard data={pkg} />
            </Box>
          ))}
      </Box>

      {/* Leads Table */}
      <Box mt={4}>
        {Array.isArray(leads) && leads.length > 0 ? (
          <LeadsTableOutlet
            leads={leads}
            setpagination={setPagination}
            pagination={pagination}
          />
        ) : (
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            mt={3}
          >
            No leads found
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Leads;
