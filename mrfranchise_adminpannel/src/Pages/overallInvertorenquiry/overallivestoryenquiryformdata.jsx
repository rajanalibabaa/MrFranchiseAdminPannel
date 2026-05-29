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
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

import VisibilityIcon from "@mui/icons-material/Visibility";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Divider,
  Stack,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import DownloadIcon from "@mui/icons-material/Download";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import SendLeadDialog from "./SendLeadDialog";

import { useDispatch, useSelector } from "react-redux";

import { getInvestorEnquiries } from "../../Redux/Slices/leadHandlingSlice/investorThunk";

const OverallInvestorEnquiryFormData = () => {
  const dispatch = useDispatch();

  const { loading, enquiries } = useSelector(
    (state) => state.overallInvestorEnquiries,
  );

  const [filters, setFilters] = useState({
    search: "",
    industry: "",
    category: "",
    status: "",
    state: "",
  });

  const [selectedLead, setSelectedLead] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);

  const [sortOrder, setSortOrder] = useState("latest");

  const [dateFilter, setDateFilter] = useState("");
  const [openSendLead, setOpenSendLead] = useState(false);
  const handleClearFilters = () => {
    setFilters({
      search: "",
      industry: "",
      category: "",
      status: "",
      state: "",
    });
  };

  const handleRefresh = () => {
    dispatch(getInvestorEnquiries());
  };

  const handleView = (lead) => {
    setSelectedLead(lead);
    setOpenDialog(true);
  };

  useEffect(() => {
    dispatch(getInvestorEnquiries());
  }, [dispatch]);

  const filteredData = useMemo(() => {
    let data = [...enquiries];

    data = data.filter((item) => {
      const searchMatch =
        !filters.search ||
        item.investorName
          ?.toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        item.investorEmail
          ?.toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        item.investorPhone
          ?.toLowerCase()
          .includes(filters.search.toLowerCase());

      const industryMatch =
        !filters.industry || item.industry === filters.industry;

      const categoryMatch =
        !filters.category || item.category === filters.category;

      const stateMatch = !filters.state || item.state === filters.state;

      const dateMatch =
        !dateFilter || item.createdAt?.split("T")[0].includes(dateFilter);

      return (
        searchMatch && industryMatch && categoryMatch && stateMatch && dateMatch
      );
    });

    if (sortOrder === "az") {
      data.sort((a, b) =>
        (a.investorName || "").localeCompare(b.investorName || ""),
      );
    }

    if (sortOrder === "za") {
      data.sort((a, b) =>
        (b.investorName || "").localeCompare(a.investorName || ""),
      );
    }

    if (sortOrder === "latest") {
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    if (sortOrder === "oldest") {
      data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    return data;
  }, [enquiries, filters, sortOrder, dateFilter]);

  const stats = useMemo(() => {
    return {
      total: filteredData.length,

      newLeads: filteredData.filter((x) => x.status === "new").length,

      followUp: filteredData.filter((x) => x.status === "follow-up").length,

      completed: filteredData.filter((x) => x.status === "deal completed")
        .length,
    };
  }, [filteredData]);

  const states = [...new Set(enquiries.map((item) => item.state))];

  const industries = [...new Set(enquiries.map((item) => item.industry))];

  const categories = [...new Set(enquiries.map((item) => item.category))];

  const StatCard = ({ title, value, icon, color }) => (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        border: "1px solid #e5e7eb",
        background: "linear-gradient(135deg,#ffffff,#f8fafc)",
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

        <Avatar
          sx={{
            width: 56,
            height: 56,
            bgcolor: color,
          }}
        >
          {icon}
        </Avatar>
      </Box>
    </Paper>
  );

  return (
    <Box p={3}>
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
              onClick={handleRefresh}
            >
              Refresh
            </Button>
          </Tooltip>

          <Tooltip title="Clear Filters">
            <Button
              variant="outlined"
              startIcon={<FilterAltOffIcon />}
              onClick={handleClearFilters}
            >
              Reset
            </Button>
          </Tooltip>

          {/* <Button variant="outlined" startIcon={<DownloadIcon />}>
            Export
          </Button> */}
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Total Leads"
            value={stats.total}
            icon={<PeopleAltIcon />}
          />
        </Grid>
      </Grid>

      <Paper
        sx={{
          p: 3,
          mt: 4,
          borderRadius: 4,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Search"
              value={filters.search}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  search: e.target.value,
                })
              }
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
              sx={{ textTransform: "capitalize",minWidth: 100}}
              value={filters.industry}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  industry: e.target.value,
                })
              }
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
                            sx={{ textTransform: "capitalize",minWidth: 120}}

              value={filters.category}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  category: e.target.value,
                })
              }
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
                            sx={{ textTransform: "capitalize",minWidth: 100}}

              onChange={(e) =>
                setFilters({
                  ...filters,
                  state: e.target.value,
                })
              }
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
              InputLabelProps={{
                shrink: true,
              }}
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

      <Paper
        sx={{
          mt: 4,
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
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
                {filteredData.map((row) => (
                  <TableRow hover key={row.uuid}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar>{row.investorName?.[0]}</Avatar>

                        <Box>
                          <Typography fontWeight={600}>
                            {row.investorName}
                          </Typography>

                          <Typography variant="body2" color="text.secondary">
                            {row.investorEmail}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>{row.industry}</TableCell>

                    <TableCell>{row.category}</TableCell>

                    <TableCell>{row.investmentRange}</TableCell>

                    <TableCell>{row.brandName}</TableCell>
                    <TableCell>
                      <Typography fontWeight={600}>
                        {new Date(row.createdAt).toLocaleDateString()}
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        {new Date(row.createdAt).toLocaleTimeString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleView(row)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Investor Details
          <IconButton onClick={() => setOpenDialog(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {selectedLead && (
            <Stack spacing={2}>
              <Typography>
                <b>Name:</b> {selectedLead.investorName}
              </Typography>

              <Divider />

              <Typography>
                <b>Email:</b> {selectedLead.investorEmail}
              </Typography>

              <Typography>
                <b>Phone:</b> {selectedLead.investorPhone}
              </Typography>

              <Typography>
                <b>Industry:</b> {selectedLead.industry}
              </Typography>

              <Typography>
                <b>Category:</b> {selectedLead.category}
              </Typography>

              <Typography>
                <b>State:</b> {selectedLead.state}
              </Typography>

              <Typography>
                <b>Investment:</b> {selectedLead.investmentRange}
              </Typography>
              <Typography>
                <b>Plan to invest:</b> {selectedLead.planToInvest}
              </Typography>
              <Typography>
                <b>Ready to invest:</b> {selectedLead.readyToInvest}
              </Typography>
              <Typography>
                <b>Brand:</b> {selectedLead.brandName}
              </Typography>

              <Typography>
                <b>Created:</b>{" "}
                {new Date(selectedLead.createdAt).toLocaleString()}
              </Typography>
            </Stack>
          )}
        </DialogContent>
        <Box mt={3}>
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={() => setOpenSendLead(true)}
          >
            Send Lead
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default OverallInvestorEnquiryFormData;
