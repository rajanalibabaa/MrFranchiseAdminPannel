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
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const TableOutlet = ({
  filteredBrands,
  handleDelete,
  searchTerm,
  handleApprove,
  handleInfoOpen,
  loadMore,
  hasMore,
  loading,
}) => {
  const observer = useRef();

  const lastRowRef = useCallback((node) => {
    // console.log("🔍 Observing last row:", node);
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          console.log("👀 Last row visible, loading more...");
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
              <TableCell>Logo</TableCell>
              <TableCell>Brand Name</TableCell>
              <TableCell>Category (Sub)</TableCell>
              <TableCell>Investment Range</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBrands.length > 0 ? (
              filteredBrands.map((brand, index) => (
                <TableRow
                  key={brand?.uuid || `row-${index}`}
                  ref={index === filteredBrands.length - 1 ? lastRowRef : null} // 👈 last row observed
                >
                  <TableCell>
                    {brand?.logo ? (
                      <img
                        src={brand.logo}
                        alt={brand.brandname || brand.brandName || "Brand"}
                        style={{
                          width: 50,
                          height: 50,
                          objectFit: "contain",
                          borderRadius: 6,
                        }}
                      />
                    ) : (
                      "No logo"
                    )}
                  </TableCell>
                  <TableCell>{brand?.brandname || brand?.brandName || "N/A"}</TableCell>
                  <TableCell>
                    {brand?.brandCategories?.sub ||
                      brand?.brandCategories?.child ||
                      "N/A"}
                  </TableCell>
                  <TableCell>
                    {brand?.fico?.investmentRange ||
                      brand?.investmentRange ||
                      "N/A"}
                  </TableCell>
                  <TableCell>
                    <button onClick={() => handleInfoOpen(brand?.uuid)}>
                      info
                    </button>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(brand?.uuid)}
                    >
                      <Delete />
                    </IconButton>
                    {brand?.seen === false && (
                      <IconButton onClick={() => handleApprove(brand?.uuid)}>
                        <CheckCircleIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  {searchTerm
                    ? "No matching brands found"
                    : "No brands available"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Loader & End message */}
        <div style={{ textAlign: "center", padding: "10px" }}>
          {loading && <CircularProgress size={24} />}
          {!hasMore && filteredBrands.length > 0 && <p>No more brands</p>}
        </div>
      </TableContainer>
    </Paper>
  );
};

export default TableOutlet;
