import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchPaymentPackages,
  deletePaymentPackage,
} from "../../../Redux/Slices/AdvertiseHandlingSlices";
import {
  CircularProgress,
  Button,
  Box,
  Typography,
  Divider,
  Grid,
} from "@mui/material";

const PaymentPackageList = ({ onEdit }) => {
  const dispatch = useDispatch();
  const { packages, loading, error } = useSelector(
    (state) => state.paymentPackages
  );

  useEffect(() => {
    dispatch(fetchPaymentPackages());
  }, [dispatch]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        All Payment Packages
      </Typography>

      {packages.length === 0 ? (
        <Typography>No packages found.</Typography>
      ) : (
        packages.map((pkg) => (
          <Box
            key={pkg._id}
            sx={{
              border: "1px solid #ccc",
              p: 3,
              borderRadius: 2,
              mb: 3,
              backgroundColor: "#fafafa",
            }}
          >
            {/* <Typography variant="h6" sx={{ mb: 1 }}>
              UUID: {pkg.uuid}
            </Typography> */}

            {/* ---- PACKAGE DETAILS (Free, Silver, Gold, Platinum, Exclusive) ---- */}
            <Grid container spacing={2}>
              {["free", "silver", "gold", "platinum", "exclusive"].map((tier) => (
                <Grid item xs={12} md={6} key={tier}>
                  <Box
                    sx={{
                      border: "1px solid #ddd",
                      borderRadius: 2,
                      p: 2,
                      mb: 2,
                      backgroundColor: "#fff",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, textTransform: "capitalize" }}
                    >
                      {tier} Package
                    </Typography>
                    <Typography variant="body2">
                      Total Amount: ₹{pkg[tier].totalAmount}
                    </Typography>
                    <Typography variant="body2">
                      Total Months: {pkg[tier].totalMonths}
                    </Typography>
                    <Typography variant="body2">
                      Per Month Lead: {pkg[tier].perMonthLead}
                    </Typography>
                    <Typography variant="body2">
                      Total Leads: {pkg[tier].totalLeads}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            {/* ---- LISTING PACKAGES ---- */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Listing Packages
              </Typography>
              {pkg.listingPackages.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No listing packages
                </Typography>
              ) : (
                pkg.listingPackages.map((list, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      border: "1px dashed #bbb",
                      borderRadius: 2,
                      p: 1.5,
                      mb: 1,
                      backgroundColor: "#fefefe",
                    }}
                  >
                    <Typography variant="body2">
                      Period (Months): {list.periodMonths}
                    </Typography>
                    <Typography variant="body2">Amount: ₹{list.amount}</Typography>
                  </Box>
                ))
              )}
            </Box>

            {/* ---- ACTION BUTTONS ---- */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button
                size="small"
                variant="outlined"
                onClick={() => onEdit(pkg)}
                sx={{ mr: 1 }}
              >
                Edit
              </Button>
              {/* <Button
                size="small"
                variant="contained"
                color="error"
                onClick={() => dispatch(deletePaymentPackage(pkg._id))}
              >
                Delete
              </Button> */}
            </Box>
          </Box>
        ))
      )}
    </Box>
  );
};

export default PaymentPackageList;
