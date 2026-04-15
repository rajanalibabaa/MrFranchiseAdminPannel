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
  TextField
} from "@mui/material";
import axios from "axios";

const PackagePlansTable = ({ range, onEdit, refresh }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ delete dialog state
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState("");
  const [inputName, setInputName] = useState("");

  const fetchPlans = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://localhost:5000/api/v1/admin/plans/getAllPlans"
      );

      setPlans(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [refresh]);

  // open delete popup
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

  // confirm delete
  const handleDelete = async () => {
    try {
      if (inputName !== deleteName) {
        alert("Plan name does not match!");
        return;
      }

      await axios.delete(
        `http://localhost:5000/api/v1/admin/plans/${deleteId}`
      );

      alert("Plan deleted successfully 🗑️");

      handleCloseDelete();
      fetchPlans();

    } catch (error) {
      console.error(error);
      alert("Error deleting plan");
    }
  };

  return (
    <Box p={2}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ background: "#f5f5f5" }}>
            <TableRow>
              <TableCell><b>Plans</b></TableCell>
              <TableCell><b>Investment Range</b></TableCell>
              <TableCell><b>Validity</b></TableCell>
              <TableCell><b>Total Leads</b></TableCell>
              <TableCell><b>Amount</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : (
              plans.map((plan) =>
                plan.packages.map((pkg, index) => (
                  <TableRow key={index}>
                    {index === 0 && (
                      <TableCell
                        rowSpan={plan.packages.length}
                        sx={{
                          fontWeight: 600,
                          verticalAlign: "top",
                          background: "#fafafa",
                        }}
                      >
                        {plan.planName}
                      </TableCell>
                    )}

                    <TableCell>{pkg.investmentRange}</TableCell>
                    <TableCell>{pkg.validityDays} days</TableCell>
                    <TableCell>{range * pkg.totalLeads}</TableCell>
                    <TableCell>₹ {range * pkg.amount}</TableCell>

                    <TableCell>
                      {index === 0 && (
                        <Box display="flex" gap={1}>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => onEdit(plan)}
                            sx={{
                              backgroundColor: "#3cba42",
                              "&:hover": {
                                backgroundColor: "#34a53a",
                              },
                            }}
                          >
                            Edit
                          </Button>

                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleOpenDelete(plan)}
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

      {/* ✅ Delete Confirmation Dialog */}
      <Dialog open={openDelete} onClose={handleCloseDelete}>
        <DialogTitle>
          Delete Plan
        </DialogTitle>

        <DialogContent>
          <Typography mb={1}>
            Type <b>{deleteName}</b> to confirm deletion
          </Typography>

          <TextField
            fullWidth
            size="small"
            placeholder="Enter plan name"
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