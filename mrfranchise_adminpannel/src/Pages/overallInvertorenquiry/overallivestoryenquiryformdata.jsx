import React, { useEffect, useMemo, useState } from "react";
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
  Chip,
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
} from "@mui/material";

// Icons
import SearchIcon from "@mui/icons-material/Search";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RefreshIcon from "@mui/icons-material/Refresh";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { getInvestorEnquiries } from "../../Redux/Slices/leadHandlingSlice/investorThunk";

// Component
import SendLeadDialog from "./SendLeadDialog";

const OverallInvestorEnquiryFormData = () => {
  const dispatch = useDispatch();

  const { loading, enquiries } = useSelector(
    (state) => state.overallInvestorEnquiries
  );

  // State management
  const [filters, setFilters] = useState({
    search: "",
    industry: "",
    category: "",
    state: "",
  });

  const [selectedLead, setSelectedLead] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [sortOrder, setSortOrder] = useState("latest");
  const [dateFilter, setDateFilter] = useState("");
  const [openSendLead, setOpenSendLead] = useState(false);

  // Handlers
  const handleClearFilters = () => {
    setFilters({
      search: "",
      industry: "",
      category: "",
      state: "",
    });
    setDateFilter("");
    setSortOrder("latest");
  };

  const handleRefresh = () => {
    dispatch(getInvestorEnquiries());
  };

  const handleView = (lead) => {
    setSelectedLead(lead);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedLead(null);
  };

  const handleOpenSendLead = () => {
    setOpenSendLead(true);
  };

  const handleCloseSendLead = () => {
    setOpenSendLead(false);
  };

  // Initial data fetch
  useEffect(() => {
    dispatch(getInvestorEnquiries());
  }, [dispatch]);

  // Filtered and sorted data
  const filteredData = useMemo(() => {
    let data = [...(enquiries || [])];

    // Apply filters
    data = data.filter((item) => {
      const searchMatch =
        !filters.search ||
        item.investorName?.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.investorEmail?.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.investorPhone?.toLowerCase().includes(filters.search.toLowerCase());

      const industryMatch = !filters.industry || item.industry === filters.industry;
      const categoryMatch = !filters.category || item.category === filters.category;
      const stateMatch = !filters.state || item.state === filters.state;
      const dateMatch = !dateFilter || item.createdAt?.split("T")[0].includes(dateFilter);

      return searchMatch && industryMatch && categoryMatch && stateMatch && dateMatch;
    });

    // Apply sorting
    if (sortOrder === "az") {
      data.sort((a, b) => (a.investorName || "").localeCompare(b.investorName || ""));
    } else if (sortOrder === "za") {
      data.sort((a, b) => (b.investorName || "").localeCompare(a.investorName || ""));
    } else if (sortOrder === "latest") {
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOrder === "oldest") {
      data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    return data;
  }, [enquiries, filters, sortOrder, dateFilter]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: filteredData.length,
    };
  }, [filteredData]);

  // Unique values for filters
  const states = useMemo(() => [...new Set(enquiries?.map((item) => item.state).filter(Boolean))], [enquiries]);
  const industries = useMemo(() => [...new Set(enquiries?.map((item) => item.industry).filter(Boolean))], [enquiries]);
  const categories = useMemo(() => [...new Set(enquiries?.map((item) => item.category).filter(Boolean))], [enquiries]);

  // Stat Card Component
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
        <Avatar sx={{ width: 56, height: 56, bgcolor: color }}>
          {icon}
        </Avatar>
      </Box>
    </Paper>
  );

  return (
    <Box p={3}>
      {/* Header */}
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
            <Button variant="contained" startIcon={<RefreshIcon />} onClick={handleRefresh}>
              Refresh
            </Button>
          </Tooltip>

          <Tooltip title="Clear Filters">
            <Button variant="outlined" startIcon={<FilterAltOffIcon />} onClick={handleClearFilters}>
              Reset
            </Button>
          </Tooltip>
        </Box>
      </Box>

      {/* Stats */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <StatCard title="Total Leads" value={stats.total} icon={<PeopleAltIcon />} />
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 3, mt: 4, borderRadius: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Search"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              select
              fullWidth
              label="Industry"
              value={filters.industry}
              onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
            >
              <MenuItem value="">All</MenuItem>
              {industries.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              select
              fullWidth
              label="Category"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <MenuItem value="">All</MenuItem>
              {categories.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              select
              fullWidth
              label="State"
              value={filters.state}
              onChange={(e) => setFilters({ ...filters, state: e.target.value })}
            >
              <MenuItem value="">All</MenuItem>
              {states.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              type="date"
              fullWidth
              label="Date"
              InputLabelProps={{ shrink: true }}
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              select
              fullWidth
              label="Sort"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <MenuItem value="latest">Latest First</MenuItem>
              <MenuItem value="oldest">Oldest First</MenuItem>
              <MenuItem value="az">A-Z</MenuItem>
              <MenuItem value="za">Z-A</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Data Table */}
      <Paper sx={{ mt: 4, borderRadius: 4, overflow: "hidden" }}>
        {loading ? (
          <Box p={5} textAlign="center">
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Investor</TableCell>
                  <TableCell>Industry</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Investment</TableCell>
                  <TableCell>Brand</TableCell>
                  <TableCell>Enquiry Date</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body2" color="text.secondary" py={4}>
                        No enquiries found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((row) => (
                    <TableRow hover key={row.uuid}>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar>{row.investorName?.[0]}</Avatar>
                          <Box>
                            <Typography fontWeight={600}>{row.investorName}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {row.investorEmail}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{row.industry || "N/A"}</TableCell>
                      <TableCell>{row.category || "N/A"}</TableCell>
                      <TableCell>{row.investmentRange || "N/A"}</TableCell>
                      <TableCell>{row.brandName || "N/A"}</TableCell>
                      <TableCell>
                        <Typography fontWeight={600}>
                          {new Date(row.createdAt).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(row.createdAt).toLocaleTimeString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton color="primary" onClick={() => handleView(row)}>
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Investor Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Investor Details
          </Typography>
          <IconButton onClick={handleCloseDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          {selectedLead && (
            <Stack spacing={2} disableGutters divider={<Box sx={{ borderBottom: "1px solid #e0e0e0" }} />} >
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Investor Name
                </Typography>
                <Typography fontWeight={600}>{selectedLead.investorName}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Investor Email
                </Typography>
                <Typography fontWeight={600}>{selectedLead.investorEmail}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Investor Phone
                </Typography>
                <Typography fontWeight={600}>{selectedLead.investorPhone}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Brand Name
                </Typography>
                <Typography fontWeight={600}>{selectedLead.brandName || "N/A"}</Typography>
              </Box>

 <Box>
                <Typography variant="caption" color="text.secondary">
                 Brand Investment Range
                </Typography>
                <Typography fontWeight={600}>{selectedLead.investmentRange}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                 Brand Industry
                </Typography>
                <Typography fontWeight={600}>{selectedLead.industry}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                 Brand Category
                </Typography>
                <Typography fontWeight={600}>{selectedLead.category}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                 Brand Expansion State
                </Typography>
                <Typography fontWeight={600}>{selectedLead.state}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                 Brand Expansion District
                </Typography>
                <Typography fontWeight={600}>{selectedLead.district || "N/A"}</Typography>
              </Box>

             

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Plan to Invest
                </Typography>
                <Typography fontWeight={600}>{selectedLead.planToInvest}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Ready to Invest
                </Typography>
                <Typography fontWeight={600}>{selectedLead.readyToInvest}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Created At
                </Typography>
                <Typography fontWeight={600}>
                  {new Date(selectedLead.createdAt).toLocaleString()}
                </Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid #e0e0e0" }}>
          <Button variant="outlined" onClick={handleCloseDialog}>
            Close
          </Button>
          <Button variant="contained" startIcon={<SendIcon />} onClick={handleOpenSendLead}>
            Send Lead to Brands
          </Button>
        </DialogActions>
      </Dialog>

      {/* Send Lead Dialog */}
      <SendLeadDialog
        open={openSendLead}
        onClose={handleCloseSendLead}
        investorData={selectedLead}
      />
    </Box>
  );
};

export default OverallInvestorEnquiryFormData;