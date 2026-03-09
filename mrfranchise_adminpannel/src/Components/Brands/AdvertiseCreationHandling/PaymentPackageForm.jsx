import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Divider,
  Paper,
  Modal,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const BASE_URL = "http://localhost:5000/api/v1/brandadvertise/payment-packages";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  boxShadow: 24,
  p: 3,
  borderRadius: 2,
};

const confirmStyle = {
  ...style,
  width: 350,
  textAlign: "center",
};

const PaymentPackageForm = ({ selectedPackage, onSuccess }) => {
  const [form, setForm] = useState(null);

  // Add Modal
  const [open, setOpen] = useState(false);
  const [addType, setAddType] = useState("");
  const [addIndex, setAddIndex] = useState(0);
  const [newRow, setNewRow] = useState({});

  // DELETE CONFIRMATION MODAL
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState({ type: "", index: null });

  useEffect(() => {
    if (selectedPackage) {
      setForm(JSON.parse(JSON.stringify(selectedPackage)));
    }
  }, [selectedPackage]);

  if (!form) return <Typography>Select a package to edit</Typography>;

  // Open Add Row Modal
  const handleAddClick = (type) => {
    setAddType(type);
    setAddIndex(0);

    setNewRow(
      type === "packages"
        ? {
            packageName: "",
            totalAmount: 0,
            totalMonths: 0,
            perMonthLead: 0,
            totalLeads: 0,
          }
        : {
            periodMonths: 0,
            amount: 0,
          }
    );

    setOpen(true);
  };

  // Add New Row
  const addNewRow = async () => {
    await axios.post(
      `${BASE_URL}/${form.uuid}/add/${addType}/${addIndex}`,
      newRow
    );

    const updated = [...form[addType]];
    updated.splice(addIndex, 0, newRow);

    setForm({ ...form, [addType]: updated });
    setOpen(false);
  };

  // Handle field changes
  const handleChange = (index, field, value) => {
    const updated = [...form.packages];
    updated[index][field] = Number(value);
    setForm({ ...form, packages: updated });
  };

  const handleListingChange = (index, field, value) => {
    const updated = [...form.listingPackages];
    updated[index][field] = Number(value);
    setForm({ ...form, listingPackages: updated });
  };

  // Update single row
  const updateSingleRow = async (type, index, data) => {
    await axios.put(`${BASE_URL}/${form.uuid}/${type}/${index}`, data);
  };

  // DELETE ROW FUNCTION
  const deleteRow = async () => {
    const { type, index } = deleteInfo;

    await axios.delete(`${BASE_URL}/${form.uuid}/${type}/${index}`);

    const updated = [...form[type]];
    updated.splice(index, 1);

    setForm({ ...form, [type]: updated });
    setConfirmOpen(false);
    alert("Deleted Successfully!");
  };

  // Open Confirmation Popup
  const confirmDelete = (type, index) => {
    setDeleteInfo({ type, index });
    setConfirmOpen(true);
  };

  // Save All
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      for (let i = 0; i < form.packages.length; i++) {
        await updateSingleRow("packages", i, form.packages[i]);
      }

      for (let i = 0; i < form.listingPackages.length; i++) {
        await updateSingleRow("listingPackages", i, form.listingPackages[i]);
      }

      alert("All changes saved!");
      if (onSuccess) onSuccess();
    } catch (error) {
      alert("Error updating");
      console.log(error);
    }
  };

  return (
    <>
      {/* ADD NEW ROW MODAL */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6">Add New {addType}</Typography>
            <CloseIcon onClick={() => setOpen(false)} />
          </Box>

          <TextField
            label="Insert at Index"
            type="number"
            fullWidth
            sx={{ mt: 2 }}
            value={addIndex}
            onChange={(e) => setAddIndex(Number(e.target.value))}
          />

          {/* Dynamic Fields */}
          {Object.keys(newRow).map((field) => (
            <TextField
              key={field}
              label={field}
              type="text"
              fullWidth
              sx={{ mt: 2 }}
              value={newRow[field]}
              onChange={(e) =>
                setNewRow({
                  ...newRow,
                  [field]:
                    field === "packageName"
                      ? e.target.value
                      : Number(e.target.value),
                })
              }
            />
          ))}

          <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={addNewRow}>
            Add
          </Button>
        </Box>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <Box sx={confirmStyle}>
          <Typography variant="h6">Are you sure?</Typography>
          <Typography sx={{ mt: 1 }}>
            Do you really want to delete this item?
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button fullWidth variant="outlined" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>

            <Button
              fullWidth
              variant="contained"
              color="error"
              onClick={deleteRow}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* MAIN FORM */}
      <Box component="form" onSubmit={handleSubmit}>
        <Typography variant="h5">Edit Payment Packages</Typography>

        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={() => handleAddClick("packages")}
        >
          + Add New Package
        </Button>

        {form.packages.map((pkg, index) => (
          <Paper key={index} sx={{color: "#e89b28ff", p: 2, mt: 2,}}>
            <Typography mb={2}>{pkg.packageName}</Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Total Amount"
                  type="number"
                  value={pkg.totalAmount}
                  onChange={(e) =>
                    handleChange(index, "totalAmount", e.target.value)
                  }
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="Total Months"
                  type="number"
                  value={pkg.totalMonths}
                  onChange={(e) =>
                    handleChange(index, "totalMonths", e.target.value)
                  }
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="Per Month Lead"
                  type="number"
                  value={pkg.perMonthLead}
                  onChange={(e) =>
                    handleChange(index, "perMonthLead", e.target.value)
                  }
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="Total Leads"
                  type="number"
                  value={pkg.totalLeads}
                  onChange={(e) =>
                    handleChange(index, "totalLeads", e.target.value)
                  }
                />
              </Grid>
            </Grid>

            <Button
              color="error"
              sx={{ mt: 2 }}
              onClick={() => confirmDelete("packages", index)}
            >
              Delete
            </Button>
          </Paper>
        ))}

        <Divider sx={{ mt: 4, mb: 2 }} />

        <Button
          variant="outlined"
          onClick={() => handleAddClick("listingPackages")}
        >
          + Add Listing Package
        </Button>

        {form.listingPackages.map((list, index) => (
          <Paper key={index} sx={{ p: 2, mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Months"
                  type="number"
                  value={list.periodMonths}
                  onChange={(e) =>
                    handleListingChange(index, "periodMonths", e.target.value)
                  }
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="Amount"
                  type="number"
                  value={list.amount}
                  onChange={(e) =>
                    handleListingChange(index, "amount", e.target.value)
                  }
                />
              </Grid>
            </Grid>

            <Button
              color="error"
              sx={{ mt: 2 }}
              onClick={() => confirmDelete("listingPackages", index)}
            >
              Delete
            </Button>
          </Paper>
        ))}

        <Button type="submit" variant="contained" sx={{ mt: 3 ,mb:5}}>
          Save All
        </Button>
      </Box>
    </>
  );
};

export default PaymentPackageForm;
