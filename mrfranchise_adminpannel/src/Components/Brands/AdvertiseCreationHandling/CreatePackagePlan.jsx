"use client";
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  IconButton
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const CreatePackagePlan = ({ onClose }) => {

  const initialState = {
    planName: "",
    packages: [
      {
        investmentRange: "",
        validityDays: "",
        amount: "",
        totalLeads: ""
      }
    ]
  };

  const [form, setForm] = useState(initialState);

  // plan name
  const handlePlanChange = (e) => {
    setForm({ ...form, planName: e.target.value });
  };

  // package change
  const handlePackageChange = (index, field, value) => {
    const updated = [...form.packages];
    updated[index][field] = value;
    setForm({ ...form, packages: updated });
  };

  // add package
  const addPackage = () => {
    setForm({
      ...form,
      packages: [
        ...form.packages,
        {
          investmentRange: "",
          validityDays: "",
          amount: "",
          totalLeads: ""
        }
      ]
    });
  };

  // remove package
  const removePackage = (index) => {
    const updated = form.packages.filter((_, i) => i !== index);
    setForm({ ...form, packages: updated });
  };

  // submit
  const handleSubmit = async () => {
    try {

      const payload = {
        planName: form.planName,
        packages: form.packages.map(pkg => ({
          investmentRange: pkg.investmentRange,
          validityDays: Number(pkg.validityDays),
          amount: Number(pkg.amount),
          totalLeads: Number(pkg.totalLeads)
        }))
      };

      await axios.post(
        "http://localhost:5000/api/v1/admin/plans/create",
        payload
      );

      alert("Plan Created Successfully ✅");

      setForm(initialState);

      if (onClose) onClose();

    } catch (err) {
      console.error(err);
      alert("Error creating plan");
    }
  };

  return (
    <Box p={1}>
  
      <TextField
        fullWidth
        label="Plan Name"
        value={form.planName}
        onChange={handlePlanChange}
        sx={{ mb: 3 }}
      />

      {form.packages.map((pkg, pkgIndex) => (
        <Paper key={pkgIndex} sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <TextField
                fullWidth
                label="Investment Range"
                value={pkg.investmentRange}
                onChange={(e) =>
                  handlePackageChange(
                    pkgIndex,
                    "investmentRange",
                    e.target.value
                  )
                }
              />
            </Grid>

            <Grid item xs={2}>
              <TextField
                fullWidth
                label="Validity Days"
                type="number"
                value={pkg.validityDays}
                onChange={(e) =>
                  handlePackageChange(
                    pkgIndex,
                    "validityDays",
                    e.target.value
                  )
                }
              />
            </Grid>

            <Grid item xs={2}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={pkg.amount}
                onChange={(e) =>
                  handlePackageChange(
                    pkgIndex,
                    "amount",
                    e.target.value
                  )
                }
              />
            </Grid>

            <Grid item xs={2}>
              <TextField
                fullWidth
                label="Total Leads"
                type="number"
                value={pkg.totalLeads}
                onChange={(e) =>
                  handlePackageChange(
                    pkgIndex,
                    "totalLeads",
                    e.target.value
                  )
                }
              />
            </Grid>

            <Grid item xs={1}>
              {form.packages.length > 1 && (
                <IconButton
                  color="error"
                  onClick={() => removePackage(pkgIndex)}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Grid>
          </Grid>
        </Paper>
      ))}

      <Box display="flex" justifyContent="space-between">
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addPackage}
        >
          Add Package
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
        >
          Create Plan
        </Button>
      </Box>
    </Box>
  );
};

export default CreatePackagePlan;