import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Divider,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  IconButton,
  Tooltip,
  Popover,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
const LocationPopover = ({ investmentranges }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const open = Boolean(anchorEl);

  return (
    <>
      <Tooltip title="View Locations">
        <IconButton size="small" onClick={handleOpen} color="primary">
          <VisibilityIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          sx: { p: 2, maxWidth: 320, maxHeight: 400, overflow: "auto" },
        }}
      >
        <Typography fontWeight="bold" fontSize="13px" sx={{ mb: 1 }}>
          Investment Ranges & Locations
        </Typography>

        {investmentranges?.length > 0 ? (
          investmentranges.map((range, rIndex) => (
            <Box
              key={rIndex}
              sx={{
                mb: 1.5,
                p: 1,
                backgroundColor: "#f5f5f5",
                borderRadius: 1,
              }}
            >
              {/* RANGE LABEL */}
              <Typography fontSize="12px" fontWeight="600" sx={{ mb: 0.5 }}>
                {range.selectedPlanInvestmetrange || "N/A"}
              </Typography>

              {/* STATES + DISTRICTS */}
              {range.selectedPlanStateAndDistrict?.length > 0 ? (
                range.selectedPlanStateAndDistrict.map((s, sIndex) => (
                  <Box key={sIndex} sx={{ ml: 1, mb: 0.5 }}>
                    <Typography fontSize="12px" fontWeight="500">
                     {s.state}
                    </Typography>
                    {/* {s.district?.length > 0 && (
                      <Typography fontSize="11px" color="gray" sx={{ ml: 1 }}>
                        {s.district.join(", ")}
                      </Typography>
                    )} */}
                  </Box>
                ))
              ) : (
                <Typography fontSize="11px" color="gray">
                  No states
                </Typography>
              )}

              {rIndex < investmentranges.length - 1 && (
                <Divider sx={{ mt: 1 }} />
              )}
            </Box>
          ))
        ) : (
          <Typography fontSize="12px" color="gray">
            No locations found
          </Typography>
        )}
      </Popover>
    </>
  );
};

const ViewPackagePopup = ({ open, onClose, data }) => {
  if (!data) return null;

  const packages = data.packages || [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
     <DialogTitle>
  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <Typography variant="h6" fontWeight="bold">
      {data.brandName || data.brandname || "Brand"} — Packages
    </Typography>
    <IconButton onClick={onClose} size="small">  {/* THIS IS TOP RIGHT */}
      <CloseIcon />
    </IconButton>
  </Box>
</DialogTitle>

      <DialogContent dividers>
        {packages.length === 0 ? (
          <Typography color="gray" textAlign="center">
            No packages found
          </Typography>
        ) : (
          packages.map((pkg, pkgIndex) => (
            <Box key={pkgIndex} sx={{ mb: 4 }}>

              {/* PACKAGE TYPE HEADER */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                <Chip
                  label={pkg.packagesType}
                  color={
                    pkg.packagesType === "LEAD"
                      ? "primary"
                      : pkg.packagesType === "LISTING"
                      ? "success"
                      : "default"
                  }
                  sx={{ fontWeight: "bold", mr: 1 }}
                />
                <Typography variant="subtitle1" fontWeight="bold">
                  Package Details
                </Typography>
              </Box>

              {/* INVESTMENT PACKAGES TABLE */}
              {pkg.investmetPackages?.length > 0 ? (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableCell sx={{ fontWeight: "bold" }}>Package Name</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Investment Range</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Validity</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Amount</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Total Leads</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Remaining</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Sent</TableCell>
                        {/* <TableCell sx={{ fontWeight: "bold" }}>Send %</TableCell> */}
                        <TableCell sx={{ fontWeight: "bold" }}>Start Date</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>End Date</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Locations</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pkg.investmetPackages.map((inv, invIndex) => (
                        <TableRow
                          key={invIndex}
                          sx={{
                            "&:nth-of-type(odd)": {
                              backgroundColor: "#fafafa",
                            },
                          }}
                        >
                          <TableCell>
                            <Typography fontSize="13px" fontWeight="500">
                              {inv.packagesName || "N/A"}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                              {inv.isActive && <Chip label="Active" color="success" size="small" />}
                              {inv.isPending && <Chip label="Pending" color="warning" size="small" />}
                              {inv.isExperied && <Chip label="Expired" color="error" size="small" />}
                              {inv.isPaused && <Chip label="Paused" color="default" size="small" />}
                              {!inv.isActive && !inv.isPending && !inv.isExperied && !inv.isPaused && (
                                <Chip label="InActive" color="default" size="small" />
                              )}
                            </Box>
                          </TableCell>

                          <TableCell>
                            <Typography fontSize="13px">
                              {inv.investmetRageLabel || "N/A"}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography fontSize="13px">
                              {inv.validity ? `${inv.validity} Days` : "N/A"}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography fontSize="13px">
                              {inv.totalAmount
                                ? `₹ ${inv.totalAmount.toLocaleString()}`
                                : "N/A"}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography fontSize="13px">
                              {inv.totalLeads ?? "N/A"}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography fontSize="13px">
                              {inv.remainingLeads ?? "N/A"}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography fontSize="13px">
                              {inv.sendingLeads ?? "N/A"}
                            </Typography>
                          </TableCell>

                          {/* <TableCell>
                            <Typography fontSize="13px">
                              {inv.sendingPercentage
                                ? `${inv.sendingPercentage}%`
                                : "0%"}
                            </Typography>
                          </TableCell> */}

                          <TableCell>
                            <Typography fontSize="13px">
                              {inv.packageStartDate
                                ? new Date(inv.packageStartDate).toLocaleDateString()
                                : "N/A"}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography fontSize="13px">
                              {inv.packageEndDate
                                ? new Date(inv.packageEndDate).toLocaleDateString()
                                : "N/A"}
                            </Typography>
                          </TableCell>

                          {/* EYE ICON FOR LOCATIONS */}
                          <TableCell align="center">
                            {inv.investmentranges?.length > 0 ? (
                              <LocationPopover
                                investmentranges={inv.investmentranges}
                              />
                            ) : (
                              <Typography fontSize="12px" color="gray">
                                N/A
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography color="gray" fontSize="13px">
                  No investment packages
                </Typography>
              )}

              {pkgIndex < packages.length - 1 && (
                <Divider sx={{ my: 3 }} />
              )}
            </Box>
          ))
        )}
      </DialogContent>

      {/* <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions> */}
    </Dialog>
  );
};

export default ViewPackagePopup;