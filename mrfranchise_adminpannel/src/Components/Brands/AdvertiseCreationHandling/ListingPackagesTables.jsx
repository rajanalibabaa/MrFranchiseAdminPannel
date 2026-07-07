"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  CircularProgress
} from "@mui/material";
import axios from "axios";

const ListingPackagesTable = ({ refresh }) => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchListing = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "https://mrfranchisebackend.mrfranchise.in/api/v1/admin/plans/getAllPlans"
      );
      console.log("res",res)

      const listing = res.data.data[0]?.listingPackage || [];
      setData(listing);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListing();
  }, [refresh]);

  return (
    <Box mt={2}>
      <TableContainer component={Paper}>
        <Table>

          <TableHead>
            <TableRow>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Amount</b></TableCell>
              <TableCell><b>Validity</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>₹ {item.amount}</TableCell>
                  <TableCell>{item.validityDays} days</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>

        </Table>
      </TableContainer>
    </Box>
  );
};

export default ListingPackagesTable;