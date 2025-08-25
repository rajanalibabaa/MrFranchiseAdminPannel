import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

const DeletePopup = ({ open, onClose,brands,setBrands,selectedBrandId}) => {
    const handleConfirmDelete = () => {
        console.log("Delete brand:", brands.brands);
    const updated = brands.brands.filter(brand => brand.uuid !== selectedBrandId)
    console.log("Updated brands after deletion:", updated);
    setBrands({ brands: updated })
    onClose()
      };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>

      <DialogContent>
        <DialogContentText id="delete-dialog-description">
          Are you sure you want to delete this item? This action cannot be undone.
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeletePopup;
