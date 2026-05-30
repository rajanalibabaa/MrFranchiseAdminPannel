import React, { useCallback, useEffect, useState } from "react";
import { GetApiCall } from "../../api/default/GetApi";
import { Api } from "../../api/apiurl";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  MenuItem,
  InputAdornment,
  IconButton,
  Chip,
  Stack,
  Typography,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
// import TableOutlet from "../../ui/TableOutlet";
import PaymentPopup from "../../ui/PaymentPopup";
import { PostApiCall } from "../../api/default/PostApi";
import DefaultPopup from "../../ui/DefaultPopup";
import { useNavigate } from "react-router-dom";
import ViewPackagePopup from "./ViewPackagePopup";

import TableOutlet from "../Brands/paidBrandBrnadstableOutlet"
const PACKAGE_TYPES = ["LEAD", "LISTING", "FREE"];

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

  const [filters, setFilters] = useState({
    search: "",
    packageType: "",
    industry: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

const fetchData = useCallback(
  async (
    page = 1,
    token,
    search = filters.search,
    packageType = filters.packageType,
    industry = filters.industry
  ) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const queryParams = new URLSearchParams({
        page,
        limit: pagination.limit,
      });

      if (search?.trim()) {
        queryParams.append("search", search.trim());
      }

      if (packageType) {
        queryParams.append("packagesType", packageType);
      }

      if (industry) {
        queryParams.append("industry", industry);
      }

      const res = await GetApiCall(
        `${Api.admin.get.brandPackages.getAll}?${queryParams.toString()}`,
        token
      );

      const responseData = res?.data;

      if (responseData?.success) {
        const mappedBrands = (responseData.data || []).map((brand) => {
          const leadPackage = brand.packages?.find(
            (pkg) => pkg.packagesType === "LEAD"
          );

          const listingPackage = brand.packages?.find(
            (pkg) => pkg.packagesType === "LISTING"
          );

          const activePackage =
            leadPackage || listingPackage;

          const firstInvestment =
            activePackage?.investmetPackages?.[0];

          return {
            ...brand,
            brandName: brand.brandName || "",
            brandname: brand.brandName || "",
            uploads: {
              logo: brand.logo || null,
            },
            brandCategories: {
              sub: brand.category || "N/A",
              child: brand.category || "N/A",
            },
            investmentRange:
              firstInvestment?.investmetRageLabel ||
              "N/A",
            fico: {
              investmentRange:
                firstInvestment?.investmetRageLabel ||
                "N/A",
            },
            activePackage: {
              sentLeadsPercentage:
                firstInvestment?.sendingPercentage
                  ? `${firstInvestment.sendingPercentage}%`
                  : "0%",
            },
            payment:
              firstInvestment?.isActive || false,
            isPaidBrandLeadPaused:
              firstInvestment?.isPaused || false,
          };
        });

        setBrands((prev) =>
  page === 1
    ? mappedBrands
    : [...prev, ...mappedBrands]
);

        setPagination({
          total: responseData.total || 0,
          totalPages:
            responseData.totalPages || 0,
          currentPage:
            responseData.page || page,
          limit: pagination.limit,
          hasNext:
            page <
            (responseData.totalPages || 0),
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  },
  [
    pagination.limit,
    filters.search,
    filters.packageType,
    filters.industry,
  ]
);


  
  // ── Helpers ────────────────────────────────────────────────────────────
  const loadMore = () => {
    if (loadingMore || !pagination.hasNext) return;
    fetchData(pagination.currentPage + 1, token);
  };

  const industries = [
    ...new Set(brands.map((b) => b.industry).filter(Boolean)),
  ];

 useEffect(() => {
  if (!token) return;

  const timer = setTimeout(() => {
    fetchData(
      1,
      token,
      filters.search,
      filters.packageType,
      filters.industry
    );
  }, 500);

  return () => clearTimeout(timer);
}, [
  token,
  filters.search,
  filters.packageType,
  filters.industry,
  fetchData,
]);


  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilter = (key) => {
    setFilters((prev) => ({ ...prev, [key]: "" }));
  };

  const clearAllFilters = () => {
    setFilters({ search: "", packageType: "", industry: "" });
  };

  // ── Action handlers ────────────────────────────────────────────────────
  const handlepayment = (brand) => {
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

  const activeFilterCount = [
  filters.search,
  filters.packageType,
  filters.industry,
].filter(Boolean).length;


  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <Box>
      {/* ── Filter Bar ── */}
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          mb: 2.5,
          borderRadius: 2,
          backgroundColor: "#fafafa",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1.5,
          }}
        >
          {/* Filter icon + label */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <FilterListIcon fontSize="small" color="action" />
            <Typography fontSize="13px" fontWeight={600} color="text.secondary">
              Filters
            </Typography>
            {activeFilterCount > 0 && (
              <Chip
                label={activeFilterCount}
                size="small"
                color="primary"
                sx={{ height: 18, fontSize: "11px" }}
              />
            )}
          </Box>

          {/* Search */}
          <TextField
            size="small"
            placeholder="Search brand name…"
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            sx={{ minWidth: 220 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
              endAdornment: filters.search && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => clearFilter("search")}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Package Type */}
          <TextField
            select
            size="small"
            label="Package Type"
            value={filters.packageType}
            onChange={(e) => handleFilterChange("packageType", e.target.value)}
            sx={{ minWidth: 150 }}
            InputProps={{
              endAdornment: filters.packageType && (
                <InputAdornment position="end" sx={{ mr: 2 }}>
                  <IconButton
                    size="small"
                    onClick={() => clearFilter("packageType")}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="">All Types</MenuItem>
            {PACKAGE_TYPES.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>

          {/* Industry */}
          <TextField
            select
            size="small"
            label="Industry"
            value={filters.industry}
            onChange={(e) => handleFilterChange("industry", e.target.value)}
            sx={{ minWidth: 170 }}
            InputProps={{
              endAdornment: filters.industry && (
                <InputAdornment position="end" sx={{ mr: 2 }}>
                  <IconButton
                    size="small"
                    onClick={() => clearFilter("industry")}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="">All Industries</MenuItem>
            {industries.map((ind) => (
              <MenuItem key={ind} value={ind}>
                {ind}
              </MenuItem>
            ))}
          </TextField>

          {/* Clear All */}
          {activeFilterCount > 0 && (
            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={<ClearIcon />}
              onClick={clearAllFilters}
              sx={{ whiteSpace: "nowrap" }}
            >
              Clear All
            </Button>
          )}

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ ml: "auto" }}>
              {filters.search && (
                <Chip
                  label={`Search: "${filters.search}"`}
                  size="small"
                  onDelete={() => clearFilter("search")}
                  color="primary"
                  variant="outlined"
                />
              )}
              {filters.packageType && (
                <Chip
                  label={`Type: ${filters.packageType}`}
                  size="small"
                  onDelete={() => clearFilter("packageType")}
                  color="primary"
                  variant="outlined"
                />
              )}
              {filters.industry && (
                <Chip
                  label={`Industry: ${filters.industry}`}
                  size="small"
                  onDelete={() => clearFilter("industry")}
                  color="primary"
                  variant="outlined"
                />
              )}
            </Stack>
          )}
        </Box>

        {/* Result count */}
        <Box sx={{ mt: 1 }}>
          <Typography fontSize="12px" color="text.secondary">
            Showing{" "}
            <strong>{brands.length}</strong> of{" "}
<strong>{pagination.total}</strong> brands
            {activeFilterCount > 0 && " (filtered)"}
          </Typography>
        </Box>
      </Paper>

      {/* ── Content ── */}
      {loading ? (
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : brands.length > 0 ? (
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
        <Box sx={{ textAlign: "center", py: 6 }}>
          <Typography color="text.secondary" fontSize="15px">
            {activeFilterCount > 0
              ? "No brands match the current filters."
              : "No brands found."}
          </Typography>
          {activeFilterCount > 0 && (
            <Button
              variant="text"
              color="primary"
              onClick={clearAllFilters}
              sx={{ mt: 1 }}
            >
              Clear filters
            </Button>
          )}
        </Box>
      )}

      {/* ── Popups ── */}
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