import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { deleteBrand } from "../Redux/Slices/FilterBrandSlice";

const DeletePopup = ({ open, onClose,brands,newIncomingDeleteId,selectedBrandId,onConfirm}) => {

  const dispatch = useDispatch();
    const handleConfirmDelete = () => {
    if(newIncomingDeleteId){
      onConfirm(newIncomingDeleteId);

    }
    if(selectedBrandId){
      dispatch(deleteBrand(selectedBrandId));
    }

    onClose();
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
