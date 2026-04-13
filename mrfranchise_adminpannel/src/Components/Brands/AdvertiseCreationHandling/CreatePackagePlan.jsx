"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Grid,
  IconButton
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const CreatePackagePlan = ({ onClose, editData, editId ,onSuccess }) => {

  const initialState = {
    planName: "",
    packages: [
      {
        investmentRange: "",
        validityDays: "",
        amount: "0",
        totalLeads: "0"
      }
    ]
  };

  const [form, setForm] = useState(initialState);

  // ✅ Fill edit data
  useEffect(() => {
    if (editData) {
      setForm({
        planName: editData.planName || "",
        packages: editData.packages?.length
          ? editData.packages
          : initialState.packages
      });
    }
  }, [editData]);

  // plan name change
  const handlePlanChange = (e) => {
    setForm({ ...form, planName: e.target.value });
  };

  // package change
  const handlePackageChange = (index, field, value) => {
    const updated = [...form.packages];
    updated[index][field] = value;
    setForm({ ...form, packages: updated });
  };

  // add package (works in edit also)
  const addPackage = () => {
    setForm(prev => ({
      ...prev,
      packages: [
        ...prev.packages,
        {
          investmentRange: "",
          validityDays: "",
          amount: "0",
          totalLeads: "0"
        }
      ]
    }));
  };

  // delete particular package
  const removePackage = async (index) => {
    try {

      // delete from DB if edit mode
      if (editId) {
        await axios.put(
          `http://localhost:5000/api/v1/admin/plans/${editId}`,
          {
            packageIndex: index,
            deletePackage: true
          }
        );
      }

      const updated = form.packages.filter((_, i) => i !== index);
      setForm({ ...form, packages: updated });

    } catch (err) {
      console.error(err);
      alert("Error deleting package");
    }
  };

  // submit
  const handleSubmit = async () => {
    try {

      // EDIT MODE
      if (editId) {

        // update plan name
        await axios.put(
          `http://localhost:5000/api/v1/admin/plans/${editId}`,
          { planName: form.planName }
        );

        // update / add packages
        for (let i = 0; i < form.packages.length; i++) {

          await axios.put(
            `http://localhost:5000/api/v1/admin/plans/${editId}`,
            {
              packageIndex: i,
            packageData: {
  investmentRange: form.packages[i].investmentRange,
  validityDays: Number(form.packages[i].validityDays || 0),
  amount: Number(form.packages[i].amount || 0),
  totalLeads: Number(form.packages[i].totalLeads || 0)
}
            }
          );
        }

        alert("Plan Updated Successfully ✏️");

      } else {

        // CREATE MODE
        await axios.post(
          "http://localhost:5000/api/v1/admin/plans/create",
          {
            planName: form.planName,
            packages: form.packages.map(pkg => ({
              investmentRange: pkg.investmentRange,
              validityDays: Number(pkg.validityDays),
            amount: Number(pkg.amount || 0),
totalLeads: Number(pkg.totalLeads || 0)
            }))
          }
        );

        alert("Plan Created Successfully ✅");
      }

setForm(initialState);

if (onSuccess) {
  onSuccess();   // refresh table
}

onClose();

    } catch (err) {
      console.error(err);
      alert("Error saving plan");
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
                  handlePackageChange(pkgIndex,"investmentRange",e.target.value)
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
                  handlePackageChange(pkgIndex,"validityDays",e.target.value)
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
                  handlePackageChange(pkgIndex,"amount",e.target.value)
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
                  handlePackageChange(pkgIndex,"totalLeads",e.target.value)
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
          {editId ? "Update Plan" : "Create Plan"}
        </Button>
      </Box>

    </Box>
  );
};

export default CreatePackagePlan;