"use client";
import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import axios from "axios";

const CreateListingPackage = ({ onClose, onSuccess }) => {

  const [form, setForm] = useState({
    name: "",
    amount: "",
    validityDays: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/v1/admin/plans/createListing",
        form
      );

      alert("Listing Package Created ✅");
      onSuccess();
      onClose();

    } catch (error) {
      console.error(error);
      alert("Error creating listing");
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={2} mt={1}>

      <TextField
        label="Package Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        fullWidth
      />

      <TextField
        label="Amount"
        name="amount"
        value={form.amount}
        onChange={handleChange}
        fullWidth
      />

      <TextField
        label="Validity Days"
        name="validityDays"
        value={form.validityDays}
        onChange={handleChange}
        fullWidth
      />

      <Button variant="contained" onClick={handleSubmit}>
        Create Listing
      </Button>

    </Box>
  );
};

export default CreateListingPackage;