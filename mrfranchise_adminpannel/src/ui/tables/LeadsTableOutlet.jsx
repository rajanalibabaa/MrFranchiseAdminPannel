import React, { useRef, useCallback } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  CircularProgress,
  Box,
  Button,
} from "@mui/material";

const LeadsTableOutlet = ({
  leads,
  loadMore,
  hasMore = false,
  loading = false,
  pagination,
}) => {
  const observer = useRef();

  const lastRowRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadMore]
  );

  return (
    <Paper>
      <TableContainer style={{ maxHeight: "50vh", overflow: "auto" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f1f1f1" }}>
              <TableCell sx={{ fontWeight: 800 }}>Investor Name</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Mobile</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Match Type</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Sent At</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {leads?.length > 0 ? (
              leads.map((lead, index) => (
                <TableRow
                  key={lead.sentAt}
                  ref={index === leads.length - 1 ? lastRowRef : null}
                >
                  <TableCell>{lead.investorName}</TableCell>
                  <TableCell>{lead.investorEmail}</TableCell>
                  <TableCell>{lead.investorMobile}</TableCell>
                  <TableCell>{lead.matchType}</TableCell>
                  <TableCell>
                    {new Date(lead.sentAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="7" align="center">
                  No leads.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div style={{ textAlign: "center", padding: "10px" }}>
          {loading && <CircularProgress size={24} />}
          {!hasMore && leads?.length > 0 && <p>No more investors</p>}
          {pagination?.totalRecords > 0 && (
            <p>
              Showing {leads.length} of {pagination.totalRecords} investors —
              Page {pagination.currentPage + 1} / {pagination.totalPages}
            </p>
          )}
        </div>
      </TableContainer>
    </Paper>
  );
};

export default LeadsTableOutlet;
