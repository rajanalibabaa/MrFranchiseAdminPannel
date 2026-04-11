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
  CircularProgress
} from "@mui/material";
import axios from "axios";

const PackagePlansTable = ({ range }) => {   // 👈 receive range
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);

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
  }, []);

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
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
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
                          background: "#fafafa"
                        }}
                      >
                        {plan.planName}
                      </TableCell>
                    )}

                    <TableCell>{pkg.investmentRange}</TableCell>

                    <TableCell>{pkg.validityDays} days</TableCell>

                    {/* 👇 multiply leads */}
                    <TableCell>
                      {range * pkg.totalLeads}
                    </TableCell>

                    {/* 👇 multiply amount */}
                    <TableCell>
                      ₹ {range * pkg.amount}
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
};

export default PackagePlansTable;