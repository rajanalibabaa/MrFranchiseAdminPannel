import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IndustryForm from "./IndustryForm";

const IndustryModal = ({ data, isEdit, onClose, onSaveSuccess }) => {
  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">
          {isEdit ? "Edit Industry" : "Create Industry"}
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      {/* Actual Form */}
      <IndustryForm
        initialData={data}
        isEdit={isEdit}
        onClose={onClose}
        onSaveSuccess={onSaveSuccess}
      />
    </Box>
  );
};

export default IndustryModal;