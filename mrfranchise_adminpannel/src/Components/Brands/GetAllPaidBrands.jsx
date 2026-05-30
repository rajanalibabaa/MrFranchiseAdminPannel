import React, { useCallback, useEffect, useState } from "react";
import { GetApiCall } from "../../api/default/GetApi";
import { Api } from "../../api/apiurl";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, CircularProgress } from "@mui/material";
import TableOutlet from "../../ui/TableOutlet";
import PaymentPopup from "../../ui/PaymentPopup";
import { PostApiCall } from "../../api/default/PostApi";
import DefaultPopup from "../../ui/DefaultPopup";
import { useNavigate } from "react-router-dom";
import ViewPackagePopup from "./ViewPackagePopup";

const GetAllPaidBrands = () => {
  const [brands, setBrands] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10,
    hasNext: false,
  });

  const adminData = useSelector((state) => state.admin.adminData);
  const token = adminData?.adminAccessToken || null;

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [data, setData] = useState(null);
  const [openPaymentPopup, setOpenPaymentPopup] = useState(false);
  const [openDefaultBrandPopup, setopenDefaultBrandPopup] = useState(false);

    const [openViewPackagePopup, setOpenViewPackagePopup] = useState(false);
  const [viewPackageData, setViewPackageData] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

const fetchData = useCallback(
  async (page = 1, token) => {
    try {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);

      const res = await GetApiCall(
        `${Api.admin.get.brandPackages.getAll}?page=${page}&limit=${pagination.limit}&packagesType=LEAD,LISTING`,
        token
      );

      console.log("FULL RES:", res);
      console.log("ALL BRANDS:", res?.data?.data);

      const responseData = res?.data;

    if (responseData?.success) {
  const allBrands = responseData.data || [];


  const mappedBrands = allBrands.map((brand) => {
    // get LEAD or LISTING packages only
    const leadPackage = brand.packages?.find(
      (pkg) => pkg.packagesType === "LEAD"
    );
    const listingPackage = brand.packages?.find(
      (pkg) => pkg.packagesType === "LISTING"
    );

    const activePackage = leadPackage || listingPackage;

    // get investment range label from first investment package
    const firstInvestment = activePackage?.investmetPackages?.[0];

    const investmentRange =
      firstInvestment?.investmetRageLabel || "N/A";

    // sending percentage
    const sentLeadsPercentage =
      firstInvestment?.sendingPercentage
        ? `${firstInvestment.sendingPercentage}%`
        : "0%";

    return {
      // keep original data
      ...brand,

      // map to TableOutlet expected fields
      brandName: brand.brandName || "",
      brandname: brand.brandName || "",

      // logo — new API may not have logo, set null for now
     uploads: { logo: brand.logo || null },

      // category mapping
      brandCategories: {
        sub: brand.category || "N/A",
        child: brand.category || "N/A",
      },

      // investment range
      investmentRange: investmentRange,
      fico: { investmentRange: investmentRange },

      // for LeadSend(%) column
      activePackage: {
        sentLeadsPercentage,
      },

      // payment status — from first active investment package
      payment: firstInvestment?.isActive || false,

      // pause status
      isPaidBrandLeadPaused: firstInvestment?.isPaused || false,

      // keep packages
      packages: brand.packages,
    };
  });

  console.log("MAPPED BRANDS:", mappedBrands);

  setBrands((prev) =>
    page === 1 ? mappedBrands : [...prev, ...mappedBrands]
  );

  setPagination({
    total: responseData.total || 0,
    totalPages: responseData.totalPages || 0,
    currentPage: responseData.page || page,
    limit: pagination.limit,
    hasNext: page < (responseData.totalPages || 0),
  });
}
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  },
  [pagination.limit]
);

  useEffect(() => {
    if (token) fetchData(1, token);
  }, [token, fetchData]);

  const loadMore = () => {
    if (loadingMore || !pagination.hasNext) return;
    fetchData(pagination.currentPage + 1, token);
  };

  const handlepayment = async (brand) => {
    console.log(brand);
    setOpenPaymentPopup(true);
    setData(brand);
  };

  const handleConformApprove = async (brandId) => {
    const res = await PostApiCall(
      `${Api.admin.post.brand.togglePaidBrandLeadpausePlayById}/${brandId}`
    );

    if (res?.data?.statuscode === 200) {
      const apiBrand = res?.data?.data;

      setBrands((prev) =>
        prev.map((b) =>
          b.uuid === apiBrand.uuid
            ? {
                ...b,
                isPaidBrandLeadPaused:
                  apiBrand.brandDetails.isPaidBrandLeadPaused,
              }
            : b
        )
      );
    }
    return res;
  };

  const handlePaidLeadPause = (brand) => {
    setopenDefaultBrandPopup(true);
    setData(brand);
  };

  const handleNavigation = (brand) => {
    navigate(`leads/${brand.uuid}`, { state: { brand } });
  };

   const handleViewPackage = (brand) => {
    setViewPackageData(brand);
    setOpenViewPackagePopup(true);
  };

  return (
    <Box>
      {loading ? (
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : brands?.length > 0 ? (
        <Box sx={{ mb: 4 }}>
          <TableOutlet
            filteredBrands={brands}
            paidShow={true}
            pagination={pagination}
            hasMore={pagination.hasNext}
            loadMore={loadMore}
            loading={loadingMore}
            handlepayment={handlepayment}
            handlePaidLeadPause={handlePaidLeadPause}
            handleNavigation={handleNavigation}
            handleViewPackage={handleViewPackage}
          />

          {pagination.hasNext && (
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Button
                variant="outlined"
                onClick={loadMore}
                disabled={loadingMore}
                startIcon={
                  loadingMore && (
                    <CircularProgress size={18} color="inherit" thickness={5} />
                  )
                }
              >
                {loadingMore ? "Loading..." : "Load More"}
              </Button>
            </Box>
          )}
        </Box>
      ) : (
        <p style={{ textAlign: "center", color: "gray" }}>
          No brands found.
        </p>
      )}

      {openPaymentPopup && (
        <PaymentPopup
          open={openPaymentPopup}
          onClose={() => setOpenPaymentPopup(false)}
          data={data}
          brands={brands}
          setBrands={setBrands}
        />
      )}

      {openDefaultBrandPopup && (
        <DefaultPopup
          open={openDefaultBrandPopup}
          data={data}
          handleConformApprove={handleConformApprove}
          onClose={() => setopenDefaultBrandPopup(false)}
          header={"Approved Brand Lead Pause"}
        />
      )}

       {openViewPackagePopup && (
        <ViewPackagePopup
          open={openViewPackagePopup}
          onClose={() => setOpenViewPackagePopup(false)}
          data={viewPackageData}
        />
      )}
    </Box>
  );
};

export default GetAllPaidBrands;