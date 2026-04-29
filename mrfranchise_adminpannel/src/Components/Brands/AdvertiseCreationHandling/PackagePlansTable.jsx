"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Stack,
  Select,
  MenuItem
} from "@mui/material";
import axios from "axios";

const PackagePlansTable = ({ range, onEdit, refresh }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState("");
  const [inputName, setInputName] = useState("");

  // ✅ store selected lead per row
  const [selectedLeads, setSelectedLeads] = useState({});

  /* ================= FETCH ================= */
  const fetchPlans = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://localhost:5000/api/v1/admin/plans/getAllPlans"
      );

      const formatted = res.data.data.map(item => ({
        _id: item._id,
        planName: item.planName,
        packageType: item.packageType,
        packages: item.packages || []
      }));

      setPlans(formatted);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [refresh]);

  /* ================= SPLIT ================= */
  const leadPlans = plans.filter(p => p.packageType === "LEAD" || p.packageType === "FREE");
  const listingPlans = plans.filter(p => p.packageType === "LISTING");

  /* ================= DELETE ================= */
  const handleOpenDelete = (plan) => {
    setDeleteId(plan._id);
    setDeleteName(plan.planName);
    setInputName("");
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setDeleteId(null);
    setDeleteName("");
    setInputName("");
  };

  const handleDelete = async () => {
    try {
      if (inputName !== deleteName) {
        alert("Plan name does not match!");
        return;
      }

      await axios.delete(
        `http://localhost:5000/api/v1/admin/plans/${deleteId}`
      );

      alert("Deleted");
      handleCloseDelete();
      fetchPlans();
    } catch (error) {
      console.error(error);
    }
  };

  /* ================= TABLE ================= */
  const renderTable = (title, data, color) => (
    <Box mb={5}>
      <Box
        sx={{
          background: color,
          color: "#fff",
          px: 2,
          py: 1.2,
          borderRadius: "8px 8px 0 0",
          fontWeight: 600,
          fontSize: 16
        }}
      >
        {title}
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>

          <TableHead sx={{ background: "#f4f6f8" }}>
            <TableRow>
              <TableCell><b>Plans</b></TableCell>
              <TableCell><b>Investment Range</b></TableCell>
              <TableCell><b>Validity</b></TableCell>
              <TableCell><b>Total Leads</b></TableCell>
              <TableCell><b>Amount</b></TableCell>
              <TableCell align="center"><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress size={28} />
                </TableCell>
              </TableRow>
            ) : (
              data.map((plan) =>
                plan.packages.map((pkg, index) => {
                  
                  const key = `${plan._id}-${index}`;
                  const leadsArray = Array.isArray(pkg.totalLeads)
                    ? pkg.totalLeads
                    : [];

                  const selectedLead =
                    selectedLeads[key] || leadsArray[0] || 0;

                  return (
                    <TableRow key={key} hover>

                      {index === 0 && (
                        <TableCell rowSpan={plan.packages.length}>
                          {plan.planName}
                        </TableCell>
                      )}

                      {/* RANGE */}
                      <TableCell>
                        <Typography fontWeight={600}>
                          {pkg.investmentRangeLabel}
                        </Typography>

                        <Stack direction="row" spacing={0.5} flexWrap="wrap">
                          {pkg.investmentRange?.map((r) => (
                            <Chip key={r} label={r} size="small" />
                          ))}
                        </Stack>
                      </TableCell>

                      <TableCell>
                        {pkg.validityDays} days
                      </TableCell>

                      {/* ✅ DROPDOWN */}
                      <TableCell>
                        <Select
                          size="small"
                          value={selectedLead}
                          onChange={(e) => {
                            setSelectedLeads({
                              ...selectedLeads,
                              [key]: e.target.value
                            });
                          }}
                        >
                          {leadsArray.map((lead, i) => (
                            <MenuItem key={i} value={lead}>
                              {lead}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>

                      {/* ✅ CALCULATED */}
                      <TableCell>
                        ₹ {pkg.amount *range }
                      </TableCell>

                      {/* ACTIONS */}
                      <TableCell align="center">
                        {index === 0 && (
                          <Box display="flex" gap={1} justifyContent="center">

                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => onEdit(plan)}
                            >
                              Edit
                            </Button>

                            <Button
                              variant="contained"
                              size="small"
                              color="error"
                              onClick={() => handleOpenDelete(plan)}
                            >
                              Delete
                            </Button>

                          </Box>
                        )}
                      </TableCell>

                    </TableRow>
                  );
                })
              )
            )}
          </TableBody>

        </Table>
      </TableContainer>
    </Box>
  );

  return (
    <Box p={2}>

      {renderTable("LEAD PACKAGES", leadPlans, "#55d25c")}
      {renderTable("LISTING PACKAGES", listingPlans, "#f08c35")}

      {/* DELETE DIALOG */}
      <Dialog open={openDelete} onClose={handleCloseDelete}>
        <DialogTitle>Delete Plan</DialogTitle>

        <DialogContent>
          <Typography mb={1}>
            Type <b>{deleteName}</b> to confirm
          </Typography>

          <TextField
            fullWidth
            size="small"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancel</Button>

          <Button
            variant="contained"
            color="error"
            disabled={inputName !== deleteName}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default PackagePlansTable;