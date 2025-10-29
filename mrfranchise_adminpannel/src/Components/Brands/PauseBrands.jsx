import React, { useEffect, useState, useCallback } from "react";
import TableOutlet from "../../ui/TableOutlet";
import { GetApiCall } from "../../api/default/GetApi";
import { Api } from "../../api/apiurl";
import PausePlayPopup from "../../ui/PausePlayPopup";
import { Box, Button, CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";

const PauseBrands = () => {
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
  const [data, setData] = useState(null);
  const [openBrandPausepopup, setOpenBrandPausepopup] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchData = useCallback(
    async (page = 1, token) => {
      try {
        if (page === 1) setLoading(true);
        else setLoadingMore(true);

        const res = await GetApiCall(
          `${Api.admin.get.brands.allpauseBrand}?page=${page}&limit=${pagination.limit}`,
          token
        );

        const responseData = res?.data?.data;
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
              pg.totalPages || Math.ceil(pg.total / (pg.limit || 10)),
            currentPage: pg.currentPage || page,
            limit: pg.limit || 10,
            hasNext: pg.hasNext || false,
          });
        }
      } catch (error) {
        console.error("Error fetching paused brands:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [pagination.limit]
  );

  
  useEffect(() => {
    fetchData(1, token);
  }, [token, fetchData]);

  const handlePauseToggle = (brand) => {
    setOpenBrandPausepopup(true);
    setData(brand);
  };

  const handlePlay = (id) => {
    setBrands((prev) => prev.filter((brand) => brand.uuid !== id));
    setPagination((prev) => ({
      ...prev,
      total: Math.max(0, prev.total - 1),
    }));
  };

  const loadMore = () => {
    if (loadingMore || !pagination.hasNext) return;
    fetchData(pagination.currentPage + 1, token);
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
            pauseShow={true}
            pagination={pagination}
            hasMore={pagination.hasNext}
            handlePauseToggle={handlePauseToggle}
            loadMore={loadMore}
            loading={loadingMore}
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
          No paused brands found.
        </p>
      )}

      
      {openBrandPausepopup && (
        <PausePlayPopup
          open={openBrandPausepopup}
          onClose={() => setOpenBrandPausepopup(false)}
          data={data}
          brands={brands}
          handleplay={handlePlay}
        />
      )}
    </Box>
  );
};

export default PauseBrands;
