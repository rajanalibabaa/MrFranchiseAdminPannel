import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

const ErrorPop = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Session Expired</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Your session token has expired. Please log in again to continue.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            onClose();
            // Redirect to login page
            window.location.href = "/";
          }}
          color="primary"
          variant="contained"
        >
          Login Again
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ErrorPop;
