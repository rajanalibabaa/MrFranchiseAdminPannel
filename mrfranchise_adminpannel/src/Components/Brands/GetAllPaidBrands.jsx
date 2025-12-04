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
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchData = useCallback(
    async (page = 1, token) => {
      try {
        if (page === 1) setLoading(true);
        else setLoadingMore(true);

        const res = await GetApiCall(
          `${Api.admin.get.brands.getallpaidbrands}?page=${page}&limit=${pagination.limit}`,
          token
        );

        const responseData = res?.data?.data;
        console.log("responseData:", responseData);

        if (responseData) {
          setBrands((prev) =>
            page === 1
              ? responseData.brands || []
              : [...prev, ...(responseData.brands || [])]
          );

          const pg = responseData.pagination || {};
          setPagination({
            total: pg.total || 0,
            totalPages:
              pg.totalPages || Math.ceil((pg.total || 0) / (pg.limit || 10)),
            currentPage: pg.currentPage || page,
            limit: pg.limit || 10,
            hasNext: pg.hasNext ?? false,
          });
        }
      } catch (error) {
        console.error("Error fetching paid brands:", error);
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
    console.log("===brandId=== :", brandId);
    // setData(brand)
    // setopenDefaultBrandPopup(true);

    const res = await PostApiCall(
      `${Api.admin.post.brand.togglePaidBrandLeadpausePlayById}/${brandId}`
    );
    if (res?.data?.statuscode === 200) {
      const apiBrand = res?.data?.data;
      console.log("apiBrand :", apiBrand);
      // console.log("brand :", brands);

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
    navigate(`leads/${brand.uuid}`,{ state: { brand } });
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
          No paid brands found.
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
          // onConfirm={confirmDelete}
          // newIncomingDeleteId={selectedBrandId}
        />
      )}
    </Box>
  );
};

export default GetAllPaidBrands;
