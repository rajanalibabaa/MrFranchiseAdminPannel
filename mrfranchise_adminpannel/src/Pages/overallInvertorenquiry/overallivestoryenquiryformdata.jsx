// OverallInvestorEnquiryFormData.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  MenuItem,
  InputAdornment,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Avatar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Stack,
  Button,
  Tooltip,
  Pagination,
  Divider,
  Chip,
   Accordion,
  AccordionSummary,
  AccordionDetails,
 
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RefreshIcon from "@mui/icons-material/Refresh";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useDispatch, useSelector } from "react-redux";
import { getInvestorEnquiries } from "../../Redux/Slices/leadHandlingSlice/investorThunk";
import SendLeadDialog from "./SendLeadDialog";

// ─── Debounce Hook ────────────────────────────────────────────────────────────
function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, icon, color = "#1976d2" }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      borderRadius: 4,
      border: "1px solid #e5e7eb",
      background: "linear-gradient(135deg, #ffffff, #f8fafc)",
      transition: "0.3s",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
      },
    }}
  >
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Box>
        <Typography color="text.secondary" fontSize={14}>
          {title}
        </Typography>
        <Typography variant="h4" fontWeight={800} mt={1}>
          {value}
        </Typography>
      </Box>
      <Avatar sx={{ width: 56, height: 56, bgcolor: color }}>{icon}</Avatar>
    </Box>
  </Paper>
);

// ─── Detail Row ───────────────────────────────────────────────────────────────
const DetailRow = ({ label, value }) => (
  <Box>
    <Typography variant="caption" color="text.secondary" fontWeight={500}>
      {label}
    </Typography>
    <Typography fontWeight={600} mt={0.3}>
      {value || "N/A"}
    </Typography>
  </Box>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const OverallInvestorEnquiryFormData = () => {
  const dispatch = useDispatch();

  const { loading, enquiries, total, totalPages, currentPage } = useSelector(
    (state) => state.overallInvestorEnquiries
  );

  console.log("overall ennquires", enquiries);
  
  const LIMIT = 20;

  // ── Local State ──
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    industry: "",
    category: "",
    investmentRange: "",
  });
  const [sortOrder, setSortOrder] = useState("latest");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSendLead, setOpenSendLead] = useState(false);

  // Debounce search so we don't hit API on every keystroke
  const debouncedSearch = useDebounce(filters.search, 500);

  // ── Fetch Data ──────────────────────────────────────────────────────────────
  const fetchData = useCallback(() => {
    dispatch(
      getInvestorEnquiries({
        page,
        limit: LIMIT,
        search: debouncedSearch,
        industry: filters.industry,
        category: filters.category,
        investmentRange: filters.investmentRange,
      })
    );
  }, [
    dispatch,
    page,
    debouncedSearch,
    filters.industry,
    filters.category,
    filters.investmentRange,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [
    debouncedSearch,
    filters.industry,
    filters.category,
    filters.investmentRange,
  ]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleFilterChange = (field) => (e) => {
    setFilters((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleClearFilters = () => {
    setFilters({ search: "", industry: "", category: "", investmentRange: "" });
    setDateFilter("");
    setSortOrder("latest");
    setPage(1);
  };

  const handlePageChange = (_, value) => {
    setPage(value);
    // Scroll to top of table
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleView = (lead) => {
    setSelectedLead(lead);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedLead(null);
  };

  // ── Client-side sort only (server handles filter/pagination) ────────────────
  const displayData = useMemo(() => {
    let data = [...(enquiries || [])];

    // Date filter (client-side on current page)
    if (dateFilter) {
      data = data.filter((item) =>
        item.createdAt?.split("T")[0] === dateFilter
      );
    }

    // Sort
    if (sortOrder === "az") {
      data.sort((a, b) =>
        (a.investorName || "").localeCompare(b.investorName || "")
      );
    } else if (sortOrder === "za") {
      data.sort((a, b) =>
        (b.investorName || "").localeCompare(a.investorName || "")
      );
    } else if (sortOrder === "oldest") {
      data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else {
      // latest (default — already sorted by server)
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return data;
  }, [enquiries, sortOrder, dateFilter]);

  const hasActiveFilters =
    filters.search ||
    filters.industry ||
    filters.category ||
    filters.investmentRange ||
    dateFilter;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <Box p={3}>
      {/* ── Header ── */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Investor Enquiry Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage all investor enquiries, track leads and monitor conversions.
          </Typography>
        </Box>

        <Box display="flex" gap={2}>
          <Tooltip title="Refresh Data">
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={fetchData}
            >
              Refresh
            </Button>
          </Tooltip>
          <Tooltip title="Clear Filters">
            <Button
              variant="outlined"
              startIcon={<FilterAltOffIcon />}
              onClick={handleClearFilters}
              disabled={!hasActiveFilters}
            >
              Reset
            </Button>
          </Tooltip>
        </Box>
      </Box>

      {/* ── Stat Cards ── */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Leads"
            value={total}
            icon={<PeopleAltIcon />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Current Page"
            value={`${currentPage} / ${totalPages || 1}`}
            icon={<PeopleAltIcon />}
            color="#388e3c"
          />
        </Grid>
      </Grid>

      {/* ── Filters ── */}
      <Paper sx={{ p: 3, borderRadius: 4, mb: 4 }}>
        <Typography variant="subtitle2" fontWeight={600} mb={2} color="text.secondary">
          FILTERS
        </Typography>
        <Grid container spacing={2}>
          {/* Search */}
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Search name / email / phone"
              value={filters.search}
              onChange={handleFilterChange("search")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Industry */}
          <Grid item xs={12} md={2}>
            <TextField
              select
              fullWidth
              label="Industry"
              value={filters.industry}
              onChange={handleFilterChange("industry")}
            >
              <MenuItem value="">All Industries</MenuItem>
              {[
                ...new Set(
                  enquiries?.map((i) => i.industry).filter(Boolean)
                ),
              ].map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Category */}
          <Grid item xs={12} md={2}>
            <TextField
              select
              fullWidth
              label="Category"
              value={filters.category}
              onChange={handleFilterChange("category")}
            >
              <MenuItem value="">All Categories</MenuItem>
              {[
                ...new Set(
                  enquiries?.map((i) => i.category).filter(Boolean)
                ),
              ].map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Investment Range */}
          <Grid item xs={12} md={2}>
            <TextField
              select
              fullWidth
              label="Investment Range"
              value={filters.investmentRange}
              onChange={handleFilterChange("investmentRange")}
            >
              <MenuItem value="">All Ranges</MenuItem>
              {[
                ...new Set(
                  enquiries?.map((i) => i.investmentRange).filter(Boolean)
                ),
              ].map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Date */}
          <Grid item xs={12} md={2}>
            <TextField
              type="date"
              fullWidth
              label="Enquiry Date"
              InputLabelProps={{ shrink: true }}
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </Grid>

          {/* Sort */}
          <Grid item xs={12} md={1}>
            <TextField
              select
              fullWidth
              label="Sort"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <MenuItem value="latest">Latest</MenuItem>
              <MenuItem value="oldest">Oldest</MenuItem>
              <MenuItem value="az">A → Z</MenuItem>
              <MenuItem value="za">Z → A</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        {/* Active filter chips */}
        {hasActiveFilters && (
          <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
            {filters.search && (
              <Chip
                size="small"
                label={`Search: ${filters.search}`}
                onDelete={() =>
                  setFilters((p) => ({ ...p, search: "" }))
                }
              />
            )}
            {filters.industry && (
              <Chip
                size="small"
                label={`Industry: ${filters.industry}`}
                onDelete={() =>
                  setFilters((p) => ({ ...p, industry: "" }))
                }
              />
            )}
            {filters.category && (
              <Chip
                size="small"
                label={`Category: ${filters.category}`}
                onDelete={() =>
                  setFilters((p) => ({ ...p, category: "" }))
                }
              />
            )}
            {filters.investmentRange && (
              <Chip
                size="small"
                label={`Range: ${filters.investmentRange}`}
                onDelete={() =>
                  setFilters((p) => ({ ...p, investmentRange: "" }))
                }
              />
            )}
            {dateFilter && (
              <Chip
                size="small"
                label={`Date: ${dateFilter}`}
                onDelete={() => setDateFilter("")}
              />
            )}
          </Box>
        )}
      </Paper>

      {/* ── Table ── */}
      <Paper sx={{ borderRadius: 4, overflow: "hidden" }}>
        {loading ? (
          <Box p={8} textAlign="center">
            <CircularProgress size={48} />
            <Typography mt={2} color="text.secondary">
              Loading enquiries...
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f8fafc" }}>
                    <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Investor</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Industry</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      Investment Range
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Brand</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Enquiry Date</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {displayData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <Box py={6}>
                          <Typography
                            variant="body1"
                            color="text.secondary"
                            fontWeight={500}
                          >
                            No enquiries found
                          </Typography>
                          {hasActiveFilters && (
                            <Button
                              size="small"
                              sx={{ mt: 1 }}
                              onClick={handleClearFilters}
                            >
                              Clear filters
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayData.map((row, index) => (
                      <TableRow hover key={row._id || row.uuid}>
                        <TableCell>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            fontWeight={600}
                          >
                            {(page - 1) * LIMIT + index + 1}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1.5}>
                            <Avatar
                              sx={{
                                bgcolor: "#1976d2",
                                width: 38,
                                height: 38,
                                fontSize: 14,
                              }}
                            >
                              {row.investorName?.[0]?.toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography fontWeight={600} fontSize={14}>
                                {row.investorName}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {row.investorEmail}
                              </Typography>
                              <br />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {row.investorPhone}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell>{row.industry || "—"}</TableCell>
                        <TableCell>{row.category || "—"}</TableCell>
                        <TableCell>
                          {row.investmentRange ? (
                            <Chip
                              label={row.investmentRange}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          ) : (
                            "—"
                          )}
                        </TableCell>
                        <TableCell>{row.brandName || "—"}</TableCell>

                        <TableCell>
                          <Typography fontSize={13} fontWeight={600}>
                            {new Date(row.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(row.createdAt).toLocaleTimeString(
                              "en-IN",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </Typography>
                        </TableCell>

                        <TableCell align="center">
                          <Tooltip title="View Details">
                            <IconButton
                              color="primary"
                              onClick={() => handleView(row)}
                              size="small"
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                px={3}
                py={2}
                sx={{ borderTop: "1px solid #e5e7eb" }}
              >
                <Typography variant="body2" color="text.secondary">
                  Showing{" "}
                  <strong>
                    {(page - 1) * LIMIT + 1}–
                    {Math.min(page * LIMIT, total)}
                  </strong>{" "}
                  of <strong>{total}</strong> results
                </Typography>

                <Pagination
                  page={page}
                  count={totalPages} // ✅ Now correctly calculated in slice
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                  onChange={handlePageChange}
                />
              </Box>
            )}
          </>
        )}
      </Paper>

      {/* ── Investor Detail Dialog ── */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #e0e0e0",
            pb: 2,
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            Investor Details
          </Typography>
          <IconButton onClick={handleCloseDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

    <DialogContent sx={{ pt: 3 }}>

  {/* Investor Details Accordion */}
  <Accordion defaultExpanded>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography fontWeight={700}>
        Investor Enquiry Details
      </Typography>
    </AccordionSummary>

    <AccordionDetails>
      {selectedLead && (
        <Stack spacing={2} divider={<Divider />}>
          <DetailRow
            label="Investor Name"
            value={selectedLead.investorName}
          />

          <DetailRow
            label="Email"
            value={selectedLead.investorEmail}
          />

          <DetailRow
            label="Phone"
            value={selectedLead.investorPhone}
          />

          <DetailRow
            label="Brand Name"
            value={selectedLead.brandName}
          />

          <DetailRow
            label="Investment Range"
            value={selectedLead.investmentRange}
          />

          <DetailRow
            label="Industry"
            value={selectedLead.industry}
          />

          <DetailRow
            label="Category"
            value={selectedLead.category}
          />

          <DetailRow
            label="Expansion State"
            value={selectedLead.state}
          />

          <DetailRow
            label="Expansion District"
            value={selectedLead.district}
          />

          <DetailRow
            label="Plan To Invest"
            value={selectedLead.planToInvest}
          />

          <DetailRow
            label="Ready To Invest"
            value={selectedLead.readyToInvest}
          />

          <DetailRow
            label="Submitted At"
            value={new Date(
              selectedLead.createdAt
            ).toLocaleString("en-IN")}
          />
        </Stack>
      )}
    </AccordionDetails>
  </Accordion>

  {/* Brands Sent Accordion */}
  {selectedLead?.brandsSent?.length > 0 && (
    <Accordion sx={{ mt: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography fontWeight={700}>
            Brands Sent
          </Typography>

          <Chip
            label={selectedLead.brandsSent.length}
            size="small"
            color="primary"
          />
        </Box>
      </AccordionSummary>

      <AccordionDetails>
        <Stack spacing={2}>
          {selectedLead.brandsSent.map(
            (brand, index) => (
              <Paper
                key={brand.brandId || index}
                elevation={1}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid #e0e0e0",
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Brand Name
                    </Typography>

                    <Typography fontWeight={600}>
                      {brand.brandName}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Brand Email
                    </Typography>

                    <Typography>
                      {brand.brandEmail}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Email Status
                    </Typography>

                    <Box mt={0.5}>
                      <Chip
                        size="small"
                        color={
                          brand.emailSent
                            ? "success"
                            : "error"
                        }
                        label={
                          brand.emailSent
                            ? "Sent"
                            : "Pending"
                        }
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Email Sent Time
                    </Typography>

                    <Typography>
                      {brand.emailSentAt
                        ? new Date(
                            brand.emailSentAt
                          ).toLocaleString(
                            "en-IN"
                          )
                        : "-"}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            )
          )}
        </Stack>
      </AccordionDetails>
    </Accordion>
  )}

</DialogContent>

        <DialogActions
          sx={{ px: 3, py: 2, borderTop: "1px solid #e0e0e0", gap: 1 }}
        >
          <Button variant="outlined" onClick={handleCloseDialog}>
            Close
          </Button>
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={() => setOpenSendLead(true)}
          >
            Send Lead to Brands
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Send Lead Dialog ── */}
      <SendLeadDialog
        open={openSendLead}
        onClose={() => setOpenSendLead(false)}
        investorData={selectedLead}
      />
    </Box>
  );
};

export default OverallInvestorEnquiryFormData;