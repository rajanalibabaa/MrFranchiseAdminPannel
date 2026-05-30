import React, { useRef, useCallback, useMemo } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const actionButtonSx = (color) => (theme) => ({
  width: 36,
  height: 36,
  borderRadius: 2.5,
  bgcolor: alpha(theme.palette[color].main, 0.12),
  color: theme.palette[color].main,
  border: `1px solid ${alpha(theme.palette[color].main, 0.18)}`,
  "&:hover": {
    bgcolor: alpha(theme.palette[color].main, 0.2),
  },
});

const TableOutlet = ({
  filteredBrands,
  handleDelete,
  searchTerm,
  editShow,
  editNewincomingShow,
  handleEdit,
  handlePackageEdit,
  handleApprove,
  handleInfoOpen,
  loadMore,
  hasMore,
  loading,
  pagination,
  handlePauseToggle,
  pauseShow,
  handlepayment,
  paidShow,
  handleOpenFreeLeadPausePopup,
  handlePaidLeadPause,
  handleNavigation,
  handleViewPackage,
}) => {
  const observer = useRef();

  console.log("table outlet data", filteredBrands);

  const lastRowRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            loadMore();
          }
        },
        { rootMargin: "150px" }
      );
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadMore]
  );

  const filteredBrandList = useMemo(() => {
    return filteredBrands?.filter((brand) => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        (brand.brandname || "").toLowerCase().includes(searchLower) ||
        (brand.brandName || "").toLowerCase().includes(searchLower) ||
        (brand.brandCategories?.sub || "").toLowerCase().includes(searchLower) ||
        (brand.brandCategories?.child || "").toLowerCase().includes(searchLower)
      );
    });
  }, [filteredBrands, searchTerm]);

  const columnCount = useMemo(() => {
    // Logo, Brand Name, Industry, Category = 4 base columns
    let count = 4;
    if (!pauseShow && !paidShow) count += 1; // Details
    if (editNewincomingShow) count += 2;     // Edit, Upgrade
    if (editShow && !paidShow) count += 3;   // Edit, Upgrade, BrandPause
    if (paidShow) count += 1;               // View Package
    if (pauseShow && !editShow && !paidShow) count += 1; // Pause
    if (!editShow && !pauseShow && !paidShow) count += 1; // Approve
    return count;
  }, [pauseShow, paidShow, editNewincomingShow, editShow]);

  const headCellSx = {
    fontWeight: 700,
    bgcolor: "#0f172a",
    color: "#fff",
    whiteSpace: "nowrap",
    borderBottom: "none",
    textAlign: "center",
    py: 1.8,
  };

  const bodyCellSx = {
    py: 1.5,
    textAlign: "center",
    borderColor: "divider",
    verticalAlign: "middle",
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0 10px 30px rgba(2, 6, 23, 0.06)",
        background: "linear-gradient(180deg, #ffffff 0%, #fcfcff 100%)",
      }}
    >
      {/* ── Header Bar ── */}
      <Box
        sx={{
          px: 2.5,
          py: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          Brand List
        </Typography>
        <Chip
          label={`${filteredBrandList?.length || 0} visible`}
          size="small"
          sx={{ fontWeight: 600, borderRadius: 2 }}
        />
      </Box>

      <TableContainer
        sx={{
          maxHeight: !pauseShow ? "64vh" : "80vh",
          overflow: "auto",
          "&::-webkit-scrollbar": { width: 8, height: 8 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(100, 116, 139, 0.35)",
            borderRadius: 999,
          },
        }}
      >
        <Table stickyHeader size="medium">
          {/* ══ HEAD ══════════════════════════════════════════════════════ */}
          <TableHead>
            <TableRow>
              {/* Always-visible columns */}
              <TableCell sx={headCellSx}>Logo</TableCell>
              <TableCell sx={{ ...headCellSx, textAlign: "center" }}>
                Brand Name
              </TableCell>
              <TableCell sx={headCellSx}>Industry</TableCell>
              <TableCell sx={headCellSx}>Category</TableCell>

              

              {/* All-brand edit actions
              {editShow && !paidShow && (
                <TableCell sx={headCellSx}>Edit</TableCell>
              )}
              {editShow && !paidShow && (
                <TableCell sx={headCellSx}>Upgrade / Renew</TableCell>
              )}
              {editShow && !paidShow && (
                <TableCell sx={headCellSx}>Brand Pause</TableCell>
              )} */}

              {/* Paid-brand view */}
              {paidShow && (
                <TableCell sx={headCellSx}>View Package</TableCell>
              )}

             
            </TableRow>
          </TableHead>

          {/* ══ BODY ══════════════════════════════════════════════════════ */}
          <TableBody>
            {filteredBrandList?.length > 0 ? (
              filteredBrandList.map((brand, index) => {
                const brandName = brand?.brandname || brand?.brandName || "N/A";
                const logo = brand?.uploads?.logo || brand?.logo;

                return (
                  <TableRow
                    key={brand?.uuid || `row-${index}`}
                    ref={
                      index === filteredBrandList.length - 1 ? lastRowRef : null
                    }
                    hover
                    sx={{
                      transition: "all 0.2s ease",
                      "& td": { borderColor: "divider" },
                      "&:hover td": { backgroundColor: "#f8fafc" },
                    }}
                  >
                    {/* ── Logo ── */}
                    <TableCell sx={bodyCellSx}>
                      <Avatar
                        src={logo}
                        alt={brandName}
                        // variant="rounded"
                        sx={{
                          width: 102,
                          height: 72,
                          mx: "auto",
                          borderRadius: 2.5,
                          bgcolor: "#f1f5f9",
                          color: "#0f172a",
                          fontWeight: 700,
                        }}
                      >
                        {brandName?.charAt(0)?.toUpperCase()}
                      </Avatar>
                    </TableCell>

                    {/* ── Brand Name ── */}
                    <TableCell sx={{ ...bodyCellSx, textAlign: "center" }}>
                      <Typography fontWeight={700} color="text.primary">
                        {brandName}
                      </Typography>
                    </TableCell>

                    {/* ── Industry ── */}
                    <TableCell sx={bodyCellSx}>
                      <Chip
                        label={brand?.industry || "N/A"}
                        size="small"
                        variant="outlined"
                        sx={{ borderRadius: 2 }}
                      />
                    </TableCell>

                    {/* ── Category ── */}
                    <TableCell sx={bodyCellSx}>
                      <Chip
                        label={brand?.category || "N/A"}
                        size="small"
                        variant="outlined"
                        sx={{ borderRadius: 2 }}
                      />
                    </TableCell>

                    

                      <TableCell sx={bodyCellSx}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleViewPackage(brand)}
                          sx={{
                            fontSize: "12px",
                            textTransform: "none",
                            borderRadius: 2.5,
                            fontWeight: 600,
                          }}
                        >
                          View Package
                        </Button>
                      </TableCell>
                    
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columnCount}
                  align="center"
                  sx={{ py: 8 }}
                >
                  <Stack spacing={1} alignItems="center">
                    <Typography variant="h6" fontWeight={700}>
                      {searchTerm
                        ? "No matching brands found"
                        : "No brands available"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {searchTerm
                        ? "Try changing the search term."
                        : "Brand records will appear here once available."}
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* ── Footer ── */}
        <Box
          sx={{
            textAlign: "center",
            py: 2,
            px: 2,
            borderTop: "1px solid",
            borderColor: "divider",
            bgcolor: "#fafafa",
          }}
        >
          {loading && <CircularProgress size={24} />}

          {!hasMore && filteredBrandList?.length > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              No more brands
            </Typography>
          )}

          {pagination?.total > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Showing <strong>{filteredBrandList?.length}</strong> of{" "}
              <strong>{pagination?.total}</strong> brands • Page{" "}
              <strong>{pagination?.currentPage}</strong> of{" "}
              <strong>{pagination?.totalPages}</strong>
            </Typography>
          )}
        </Box>
      </TableContainer>
    </Paper>
  );
};

export default TableOutlet;