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
import { Delete } from "@mui/icons-material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import { Edit } from "lucide-react";

const TableOutlet = ({
  filteredBrands,
  handleDelete,
  searchTerm,
  editShow,
  handleEdit,
  handleApprove,
  handleInfoOpen,
  loadMore,
  hasMore,
  loading,
  pagination,
  handlePauseToggle,
  pauseShow
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

  // Filter brands based on search term
  const filteredBrandList = filteredBrands?.filter(brand => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      (brand.brandname || '').toLowerCase().includes(searchLower) ||
      (brand.brandName || '').toLowerCase().includes(searchLower) ||
      (brand.brandCategories?.sub || '').toLowerCase().includes(searchLower) ||
      (brand.brandCategories?.child || '').toLowerCase().includes(searchLower)
    );
  });

 

  
  return (
    <Paper>
      <TableContainer style={{ maxHeight: !pauseShow ? "64vh" : "80vh", overflow: "auto" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Logo</TableCell>
              <TableCell>Brand Name</TableCell>
              <TableCell>Category (Sub)</TableCell>
              <TableCell>Investment Range</TableCell>
              {!pauseShow && <TableCell>Details</TableCell>}
              
              {editShow && <TableCell>Edit</TableCell>}
              {editShow && <TableCell>Pause</TableCell>}
              {pauseShow && !editShow &&<TableCell>Pause</TableCell>}
              {!pauseShow && <TableCell>Delete</TableCell>}

              {/* <TableCell>Delete</TableCell> */}
              {!editShow && !pauseShow &&<TableCell>Approve</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBrandList?.length > 0 ? (
              filteredBrandList.map((brand, index) => (
                <TableRow
                  key={brand?.uuid || `row-${index}`}
                  ref={index === filteredBrandList.length - 1 ? lastRowRef : null}
                >
                  <TableCell>
                    {brand?.uploads?.logo || brand?.logo ? (
                      <img
                        src={brand.uploads?.logo || brand.logo}
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
                  <TableCell>
                    {brand?.brandname || brand?.brandName || "N/A"}
                  </TableCell>
                  <TableCell>
                    {brand?.brandCategories?.sub ||
                      brand?.brandCategories?.child ||
                      "N/A"}
                  </TableCell>
                  <TableCell>
                    {brand?.brandfranchisedetails?.franchiseDetails?.fico?.investmentRange ||
                      brand?.fico?.investmentRange ||
                      brand?.investmentRange ||
                      "N/A"}
                  </TableCell>
                  {!pauseShow && (
                    <TableCell>
                    <Box>
                      <Button
                        onClick={() => handleInfoOpen(brand?.uuid)}
                        sx={{
                          py: 0,
                          backgroundColor: "#3adf34ff",
                          color: "white",
                        }}
                      >
                        Info
                      </Button>
                    </Box>
                  </TableCell>
                  )}

                  {editShow && (
                    <TableCell>
                      <IconButton
                        sx={{ color: "green" }}
                        onClick={() => handleEdit(brand?.uuid)}
                      >
                        <Edit />
                      </IconButton>
                    </TableCell>
                  )}
                    {
                    pauseShow && (
                       <TableCell>
                    <IconButton
                      onClick={() => handlePauseToggle(brand)}
                      sx={{ color: brand?.isBrandPause ? "#ecc517" : "#5cbe24ff" }}
                    >
                      {brand?.isBrandPause ? (
                        <PauseCircleIcon />
                      ) : (
                        <PlayCircleFilledWhiteIcon />
                      )}
                    </IconButton>
                  </TableCell>
                    )
                  }
                    {
                    editShow && (
                       <TableCell>
                    <IconButton
                      onClick={() => handlePauseToggle(brand)}
                      sx={{ color: brand?.isBrandPause ? "#ecc517" : "#5cbe24ff" }}
                    >
                      {brand?.isBrandPause ? (
                        <PauseCircleIcon />
                      ) : (
                        <PlayCircleFilledWhiteIcon />
                      )}
                    </IconButton>
                  </TableCell>
                    )
                  }
                  {!pauseShow && (
                    <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(brand?.uuid)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                  )}
                  {!editShow && (
                    <TableCell>
                      {brand?.seen === false && (
                        <IconButton onClick={() => handleApprove(brand?.uuid)}>
                          <CheckCircleIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={editShow ? 7 : 7} align="center">
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
          {!hasMore && filteredBrandList?.length > 0 && <p>No more brands</p>}
          {pagination?.total > 0 && (
            <p>
              Showing {filteredBrandList?.length} of {pagination?.total} brands
              (Page {pagination?.currentPage} of {pagination?.totalPages})
            </p>
          )}
        </div>
      </TableContainer>
    </Paper>
  );
};

export default TableOutlet;