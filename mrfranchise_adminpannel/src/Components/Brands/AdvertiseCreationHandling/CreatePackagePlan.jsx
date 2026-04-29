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
  "Below 50k",
  "Rs. 50k - 2 Lakhs",
  "Rs. 2 Lakhs - 5 Lakhs",
  "Rs. 5 Lakhs - 10 Lakhs",
  "Rs. 10 Lakhs - 20 Lakhs",
  "Rs. 20 Lakhs - 30 Lakhs",
  "Rs. 30 Lakhs - 50 Lakhs",
  "Rs. 50 Lakhs - 1 Crore",
  "Rs. 1 Crore - 2 Crores",
  "Rs. 2 Crore - 5 Crores",
  "Rs. 5 Crores above",
];

const generateLabel = (selected) => {
  if (!selected || selected.length === 0) return "";

  const first = selected[0];
  const last = selected[selected.length - 1];

  const isBelow = first.toLowerCase().includes("below");
  const isAboveOnly =
    selected.length === 1 && last.toLowerCase().includes("above");

  if (selected.length === 1 && isBelow) {
    const value = first.replace(/below/i, "").trim();
    return `Upto ${value}`;
  }

  if (isAboveOnly) {
    return last.replace("Rs.", "").trim();
  }

  if (last.toLowerCase().includes("above")) {
    const firstValue = first.split("-")[0].replace("Rs.", "").trim();
    const prev = selected[selected.length - 2];
    const upper = prev.split("-")[1].trim();
    return `${firstValue} to ${upper} above`;
  }

  const firstValue = first.includes("-")
    ? first.split("-")[0].replace("Rs.", "").trim()
    : first.replace(/below/i, "").trim();

  const lastValue = last.split("-")[1].trim();

  if (isBelow) return `Upto ${lastValue}`;

  return `${firstValue} to ${lastValue}`;
};

const CreatePackagePlan = ({ onClose, editData, editId, onSuccess }) => {

  const initialState = {
    planName: "",
    packageType: "LEAD",
    packages: [
      {
        investmentRangeLabel: "",
        investmentRange: [],
        validityDays: "",
        amount: "0",
        totalLeads: [],   // ✅ ARRAY
        leadInput: ""     // ✅ TEMP INPUT
      },
    ],
  };

  const [form, setForm] = useState(initialState);

  /* ================= EDIT MODE ================= */
  useEffect(() => {
    if (editData) {
      setForm({
        planName: editData.planName || "",
        packageType: editData.packageType || "LEAD",
        packages: editData.packages?.length
          ? editData.packages.map(pkg => ({
              ...pkg,
              totalLeads: Array.isArray(pkg.totalLeads)
                ? pkg.totalLeads
                : [],
              leadInput: ""
            }))
          : initialState.packages,
      });
    } else {
      setForm(initialState);
    }
  }, [editData]);

  const handlePlanChange = (e) => {
    setForm({ ...form, planName: e.target.value });
  };

  const handlePackageTypeChange = (e) => {
    setForm({ ...form, packageType: e.target.value });
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
          totalLeads: [],
          leadInput: ""
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

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    try {

      const formattedPackages = form.packages.map(pkg => {
        const ordered = investmentRanges.filter(r =>
          pkg.investmentRange.includes(r)
        );

        return {
          investmentRangeLabel: generateLabel(ordered),
          investmentRange: ordered,
          validityDays: Number(pkg.validityDays || 0),
          amount: Number(pkg.amount || 0),
          totalLeads: Array.isArray(pkg.totalLeads)
            ? pkg.totalLeads
            : []
        };
      });

      const payload = {
        planName: form.planName,
        packageType: form.packageType,
        packages: formattedPackages
      };

      if (editId === null) {
        await axios.post(
          "http://localhost:5000/api/v1/admin/plans/create",
          payload
        );
        alert("Plan Created Successfully");
      } else {
        await axios.put(
          `http://localhost:5000/api/v1/admin/plans/${editId}`,
          payload
        );
        alert("Plan Updated Successfully");
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

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Package Name</InputLabel>
        <Select
          value={form.packageType}
          onChange={handlePackageTypeChange}
        >
          <MenuItem value="LISTING">LISTING PACKAGE</MenuItem>
          <MenuItem value="LEAD">LEAD PACKAGE</MenuItem>
          <MenuItem value="FREE">FREE PACKAGE</MenuItem>
        </Select>
      </FormControl>

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

            {/* RANGE */}
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

                    setForm({ ...form, packages: updated });
                  }}
                  renderValue={() =>
                    pkg.investmentRangeLabel || "Select Range"
                  }
                >
                  {investmentRanges.map((range) => (
                    <MenuItem key={range} value={range}>
                      <Checkbox checked={pkg.investmentRange.includes(range)} />
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

            {/* VALIDITY */}
            <Grid item xs={2}>
              <TextField
                fullWidth
                label="Validity"
                type="number"
                value={pkg.validityDays}
                onChange={(e) =>
                  handlePackageChange(pkgIndex, "validityDays", e.target.value)
                }
              />
            </Grid>

            {/* AMOUNT */}
            <Grid item xs={2}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={pkg.amount}
                onChange={(e) =>
                  handlePackageChange(pkgIndex, "amount", e.target.value)
                }
              />
            </Grid>

            {/* ✅ TOTAL LEADS (NEW UI) */}
            <Grid item xs={3}>
              <Box display="flex" gap={1}>
                <TextField
                  fullWidth
                  label="Add Lead"
                  type="number"
                  value={pkg.leadInput || ""}
                  onChange={(e) => {
                    const updated = [...form.packages];
                    updated[pkgIndex].leadInput = e.target.value;
                    setForm({ ...form, packages: updated });
                  }}
                />

                <IconButton
                  color="primary"
                  onClick={() => {
                    const updated = [...form.packages];
                    const value = Number(updated[pkgIndex].leadInput);

                    if (!isNaN(value) && value > 0) {
                      updated[pkgIndex].totalLeads.push(value);
                      updated[pkgIndex].leadInput = "";
                      setForm({ ...form, packages: updated });
                    }
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Box>

              {/* SHOW ARRAY */}
              <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                {pkg.totalLeads.map((lead, i) => (
                  <Box
                    key={i}
                    sx={{
                      px: 1.2,
                      py: 0.5,
                      background: "#e3f2fd",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      fontSize: 12
                    }}
                  >
                    {lead}

                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        const updated = [...form.packages];
                        updated[pkgIndex].totalLeads.splice(i, 1);
                        setForm({ ...form, packages: updated });
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Grid>

            {/* DELETE PACKAGE */}
            <Grid item xs={1}>
              {form.packages.length > 1 && (
                <IconButton color="error" onClick={() => removePackage(pkgIndex)}>
                  <DeleteIcon />
                </IconButton>
              )}
            </Grid>

          </Grid>
        </Paper>
      ))}

      <Box display="flex" justifyContent="space-between">
        <Button variant="contained" startIcon={<AddIcon />} onClick={addPackage}>
          Add Package
        </Button>

        <Button variant="contained" onClick={handleSubmit}>
          {editId !== null ? "Update Plan" : "Create Plan"}
        </Button>
      </Box>
    </Box>
  );
};

export default CreatePackagePlan;