"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const investmentRanges = [
  "Below - 50k",
  "Rs. 50k - 2 Lakhs",
  "Rs. 2 Lakhs - 5 Lakhs",
  "Rs. 5 Lakhs - 10 Lakhs",
  "Rs. 10 Lakhs - 20 Lakhs",
  "Rs. 20 Lakhs - 30 Lakhs",
  "Rs. 30 Lakhs - 50 Lakhs",
  "Rs. 50 Lakhs - 1 Crore",
  "Rs. 1 Crore - 2 Crores",
  "Rs. 2 Crore - 5 Crores",
  "Rs. 5 Crores - above",
];

const generateLabel = (selected) => {
  if (!selected || selected.length === 0) return "";

  const first = selected[0];
  const last = selected[selected.length - 1];
  const lastIsAbove = last.toLowerCase().includes("above");

  if (selected.length === 1 && lastIsAbove) {
    const value = last.split("-")[0].replace("Rs.", "").trim();
    return `Above ${value}`;
  }

  const firstLower = first.split("-")[0].replace("Rs.", "").trim();

  if (lastIsAbove) {
    const prev = selected[selected.length - 2] || first;
    const upper = prev.split("-")[1].trim();
    return `${firstLower} to ${upper} above`;
  }

  const lastUpper = last.split("-")[1].trim();

  if (first.includes("Below")) {
    return `Upto ${lastUpper}`;
  }

  return `${firstLower} to ${lastUpper}`;
};

const CreatePackagePlan = ({ onClose, editData, editId, onSuccess }) => {

  const initialState = {
    planName: "",
    packages: [
      {
        investmentRangeLabel: "",
        investmentRange: [],
        validityDays: "",
        amount: "0",
        totalLeads: "0",
      },
    ],
  };

  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (editData) {
      setForm({
        planName: editData.planName || "",
        packages: editData.packages?.length
          ? editData.packages
          : initialState.packages,
      });
    } else {
      setForm(initialState);
    }
  }, [editData]);

  const handlePlanChange = (e) => {
    setForm({ ...form, planName: e.target.value });
  };

  const handlePackageChange = (index, field, value) => {
    const updated = [...form.packages];
    updated[index][field] = value;
    setForm({ ...form, packages: updated });
  };

  const addPackage = () => {
    setForm((prev) => ({
      ...prev,
      packages: [
        ...prev.packages,
        {
          investmentRangeLabel: "",
          investmentRange: [],
          validityDays: "",
          amount: "0",
          totalLeads: "0",
        },
      ],
    }));
  };

  const removePackage = async (index) => {
    try {
      if (editId !== null) {
        await axios.put(
          `http://localhost:5000/api/v1/admin/plans/${editId}`,
          {
            packageIndex: index,
            deletePackage: true,
          }
        );
      }

      const updated = form.packages.filter((_, i) => i !== index);
      setForm({ ...form, packages: updated });

    } catch (err) {
      console.error(err);
    }
  };

const handleSubmit = async () => {
  try {

    // ================= EDIT =================
    if (editId !== null) {

      // update each package
      for (let i = 0; i < form.packages.length; i++) {

        const pkg = form.packages[i];

        const ordered = investmentRanges.filter(r =>
          pkg.investmentRange.includes(r)
        );

        const packageData = {
          investmentRangeLabel: generateLabel(ordered),
          investmentRange: ordered,
          validityDays: Number(pkg.validityDays || 0),
          amount: Number(pkg.amount || 0),
          totalLeads: Number(pkg.totalLeads || 0),
        };

        await axios.put(
          `http://localhost:5000/api/v1/admin/plans/${editId}`,
          {
            packageIndex: i,
            packageData
          }
        );
      }

      // update plan name
      await axios.put(
        `http://localhost:5000/api/v1/admin/plans/${editId}`,
        {
          planName: form.planName
        }
      );

      alert("Plan Updated Successfully");
    }

    // ================= CREATE =================
    else {

      const formattedPackages = form.packages.map(pkg => {

        const ordered = investmentRanges.filter(r =>
          pkg.investmentRange.includes(r)
        );

        return {
          investmentRangeLabel: generateLabel(ordered),
          investmentRange: ordered,
          validityDays: Number(pkg.validityDays || 0),
          amount: Number(pkg.amount || 0),
          totalLeads: Number(pkg.totalLeads || 0),
        };
      });

      await axios.post(
        "http://localhost:5000/api/v1/admin/plans/create",
        {
          planName: form.planName,
          packages: formattedPackages
        }
      );

      alert("Plan Created Successfully");
    }

    onSuccess();
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

            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel shrink>Investment Range</InputLabel>

                <Select
                  multiple
                  value={pkg.investmentRange}
                  displayEmpty
                  onChange={(e) => {

                    const value = e.target.value;

                    const ordered =
                      investmentRanges.filter(r =>
                        value.includes(r)
                      );

                    const updated = [...form.packages];

                    updated[pkgIndex].investmentRange = ordered;
                    updated[pkgIndex].investmentRangeLabel =
                      generateLabel(ordered);

                    setForm({
                      ...form,
                      packages: updated
                    });
                  }}
                  renderValue={() =>
                    pkg.investmentRangeLabel || "Select Range"
                  }
                >
                  {investmentRanges.map((range) => (
                    <MenuItem key={range} value={range}>
                      <Checkbox
                        checked={
                          pkg.investmentRange.indexOf(range) > -1
                        }
                      />
                      <ListItemText primary={range} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Auto Label"
                value={pkg.investmentRangeLabel || ""}
                InputProps={{ readOnly: true }}
                sx={{ mt: 1 }}
              />
            </Grid>

            <Grid item xs={2}>
              <TextField
                fullWidth
                label="Validity"
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
                label="Leads"
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
          variant="contained"
          startIcon={<AddIcon />}
          onClick={addPackage}
        >
          Add Package
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
        >
          {editId !== null ? "Update Plan" : "Create Plan"}
        </Button>
      </Box>
    </Box>
  );
};

export default CreatePackagePlan;