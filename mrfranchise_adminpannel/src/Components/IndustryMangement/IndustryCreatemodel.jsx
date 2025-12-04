
import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IndustryForm from "./IndustryForm";

const IndustryCreateModel = ({ onClose }) => {
  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Create Industry</Typography>

        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Actual Form */}
      <IndustryForm onClose={onClose} />
    </Box>
  );
};

export default IndustryCreateModel;

