import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updatePaymentPackage } from "../../../Redux/Slices/AdvertiseHandlingSlices";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Divider,
} from "@mui/material";

const PaymentPackageForm = ({ selectedPackage, onSuccess }) => {
  const dispatch = useDispatch();

  const [form, setForm] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedPackage) {
      setForm(selectedPackage);
    }
  }, [selectedPackage]);

  if (!form) return <Typography>Select a package to edit</Typography>;

  const handleChange = (tier, field, value) => {
    setForm({
      ...form,
      [tier]: {
        ...form[tier],
        [field]: Number(value),
      },
    });
  };

  const handleListingChange = (index, field, value) => {
    const updatedListings = [...form.listingPackages];
    updatedListings[index][field] = Number(value);
    setForm({ ...form, listingPackages: updatedListings });
  };

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    setError(null);
    try {
      await dispatch(updatePaymentPackage({ uuid: form.uuid, data: form })).unwrap();
      
      if (onSuccess) onSuccess();
    } catch (err) {
      // err may be a string (rejectWithValue) or an Error object
      console.error("Error updating package", err);
      setError(typeof err === "string" ? err : err.message || "Error updating package");
    }
  };

  const tiers = ["free", "silver", "gold", "platinum", "exclusive"];

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Edit Payment Package
      </Typography>

      <TextField
        label="UUID"
        value={form.uuid}
        fullWidth
        margin="normal"
        disabled
      />

      {tiers.map((tier) => (
        <Box key={tier} sx={{ mb: 3, p: 2, border: "1px solid #ddd", borderRadius: 2 }}>
          <Typography variant="subtitle1" sx={{ textTransform: "capitalize", mb: 1 }}>
            {tier} Package
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <TextField
                label="Total Amount"
                type="number"
                value={form[tier].totalAmount}
                onChange={(e) => handleChange(tier, "totalAmount", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                label="Total Months"
                type="number"
                value={form[tier].totalMonths}
                onChange={(e) => handleChange(tier, "totalMonths", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                label="Per Month Lead"
                type="number"
                value={form[tier].perMonthLead}
                onChange={(e) => handleChange(tier, "perMonthLead", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                label="Total Leads"
                type="number"
                value={form[tier].totalLeads}
                onChange={(e) => handleChange(tier, "totalLeads", e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>
        </Box>
      ))}

      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" gutterBottom>
        Listing Packages
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {form.listingPackages.map((pkg, index) => (
        <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <TextField
              label="Period (Months)"
              type="number"
              value={pkg.periodMonths}
              onChange={(e) => handleListingChange(index, "periodMonths", e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Amount"
              type="number"
              value={pkg.amount}
              onChange={(e) => handleListingChange(index, "amount", e.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>
      ))}

      <Button type="submit" variant="contained" color="primary">
        Update Package
      </Button>
    </Box>
  );
};

export default PaymentPackageForm;
