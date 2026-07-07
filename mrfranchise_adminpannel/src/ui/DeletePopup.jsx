import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { deleteBrand } from "../Redux/Slices/FilterBrandSlice";
import axios from "axios";

const DeletePopup = ({ open, onClose, brands, newIncomingDeleteId, selectedBrandId, onConfirm }) => {
  console.log(newIncomingDeleteId,'newIncomingDeleteId');

  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  
  const handleConfirmDelete = async () => {
    try {
      if (newIncomingDeleteId) {
        onConfirm(newIncomingDeleteId);
      }
      
      if (newIncomingDeleteId || selectedBrandId) {
        console.log("Delete ID:", newIncomingDeleteId || selectedBrandId);
        const deleteId = newIncomingDeleteId || selectedBrandId;
        try {
         
          
          // Proceed with deletion
          const deleteUrl = `https://mrfranchisebackend.mrfranchise.in/api/v1/deleteBrandListingByUUID/${deleteId}`;
          const response = await axios.delete(deleteUrl);
          
          console.log("Delete response:", response.data);
          alert(response.data.message || "Item deleted successfully");
          
          // Update the Redux store
          dispatch(deleteBrand(deleteId));
          onClose();
        } catch (apiError) {
          if (apiError.response?.status === 404) {
            console.warn("Brand not found in database, but removing from UI anyway");
            dispatch(deleteBrand(deleteId));
            onClose();
          } else {
            throw apiError;
          }
        }
      } else {
        setError("No ID provided for deletion");
        setShowError(true);
      }
    } catch (error) {
      console.error("Error deleting brand:", error);
      
      let errorMessage = "Failed to delete item";
      if (error.response) {
        console.error("Response error data:", error.response?.data);
        console.error("Response error status:", error.response?.status);
        errorMessage = error.response?.data?.error || "Server error occurred";
      } else if (error.request) {
        errorMessage = "Server not responding. Check your connection.";
      } else {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      setShowError(true);
    }
  };
  
  const handleCloseError = () => {
    setShowError(false);
  };
  
  return (
    <>
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
      
      <Snackbar open={showError} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DeletePopup;
