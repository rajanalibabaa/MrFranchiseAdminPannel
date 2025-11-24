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

const TableOutlet = ({
  filteredBrands,
  loadMore,
  hasMore,
  loading,
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
      <TableContainer style={{ maxHeight: "80vh", overflow: "auto" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Brand Name</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredBrands?.length > 0 ? (
              filteredBrands.map((brand, index) => (
                <TableRow
                  key={brand.uuid}
                  ref={index === filteredBrands.length - 1 ? lastRowRef : null}
                >
                  <TableCell>{brand.brandname}</TableCell>
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

        {/* Footer */}
        <div style={{ textAlign: "center", padding: "10px" }}>
          {loading && <CircularProgress size={24} />}
          {!hasMore && filteredBrands?.length > 0 && <p>No more brands</p>}
          {pagination?.total > 0 && (
            <p>
              Showing {filteredBrands.length} of {pagination.total} brands (Page{" "}
              {pagination.currentPage} of {pagination.totalPages})
            </p>
          )}
        </div>
      </TableContainer>
    </Paper>
  );
};

export default TableOutlet;
