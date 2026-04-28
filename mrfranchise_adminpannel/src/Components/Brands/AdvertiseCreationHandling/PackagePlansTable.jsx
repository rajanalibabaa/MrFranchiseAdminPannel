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
  Divider
} from "@mui/material";
import axios from "axios";

const PackagePlansTable = ({ range, onEdit, refresh }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState("");
  const [inputName, setInputName] = useState("");

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
  const leadPlans = plans.filter(p => p.packageType === "LEAD");
  const listingPlans = plans.filter(p => p.packageType === "LISTING");

  /* ================= DELETE ================= */
  const handleOpenDelete = (plan, index) => {
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

      {/* HEADER */}
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

      <TableContainer
        component={Paper}
        elevation={3}
        sx={{
          borderRadius: "0 0 10px 10px",
          overflow: "hidden"
        }}
      >
        <Table size="medium">

          {/* HEAD */}
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

          {/* BODY */}
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress size={28} />
                </TableCell>
              </TableRow>
            ) : (
              data.map((plan, planIndex) =>
                plan.packages.map((pkg, index) => (
                  <TableRow
                    key={index}
                    hover
                    sx={{
                      "&:hover": {
                        backgroundColor: "#f9fafb"
                      }
                    }}
                  >
                    {index === 0 && (
                      <TableCell
                        rowSpan={plan.packages.length}
                        sx={{
                          fontWeight: 600,
                          verticalAlign: "top",
                          background: "#fafafa",
                          minWidth: 160
                        }}
                      >
                        {plan.planName}
                      </TableCell>
                    )}

                    {/* RANGE */}
                    <TableCell>
                      <Typography
                        fontWeight={600}
                        color="primary"
                        fontSize={14}
                      >
                        {pkg.investmentRangeLabel}
                      </Typography>

                      <Stack
                        direction="row"
                        spacing={0.5}
                        flexWrap="wrap"
                        mt={0.5}
                      >
                        {pkg.investmentRange?.map((r) => (
                          <Chip
                            key={r}
                            label={r}
                            size="small"
                            sx={{
                              fontSize: 11,
                              background: "#eef2ff"
                            }}
                          />
                        ))}
                      </Stack>
                    </TableCell>

                    <TableCell>
                      {pkg.validityDays} days
                    </TableCell>

                    <TableCell>
                      {range * pkg.totalLeads}
                    </TableCell>

                    <TableCell>
                      ₹ {range * pkg.amount}
                    </TableCell>

                    {/* ACTIONS */}
                    <TableCell align="center">
                      {index === 0 && (
                        <Box display="flex" gap={1} justifyContent="center">

                          {/* EDIT */}
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => onEdit(plan, planIndex)}
                            sx={{
                              backgroundColor: "#2e7d32",
                              textTransform: "none",
                              px: 2,
                              "&:hover": {
                                backgroundColor: "#1b5e20"
                              }
                            }}
                          >
                            Edit
                          </Button>

                          {/* DELETE */}
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleOpenDelete(plan)}
                            sx={{
                              backgroundColor: "#d32f2f",
                              textTransform: "none",
                              px: 2,
                              "&:hover": {
                                backgroundColor: "#b71c1c"
                              }
                            }}
                          >
                            Delete
                          </Button>

                        </Box>
                      )}
                    </TableCell>

                  </TableRow>
                ))
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
          <Button onClick={handleCloseDelete}>
            Cancel
          </Button>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#d32f2f",
              "&:hover": {
                backgroundColor: "#b71c1c"
              }
            }}
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