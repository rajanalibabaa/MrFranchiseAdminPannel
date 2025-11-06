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
import { useDispatch, useSelector } from "react-redux";
import { toggleBrandPayment } from "../Redux/Slices/FilterBrandSlice";
import { Api } from "../api/apiurl";
import { PostApiCall } from "../api/default/PostApi";

const PaymentPopup = ({ open, onClose, data, setBrands, brands }) => {
  const adminData = useSelector((state) => state.admin.adminData);
  const token = adminData?.adminAccessToken || null;
  const dispatch = useDispatch();

  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [disable, setDisable] = useState(false);

  const handleConfirmPayment = async () => {
    if (!data?.uuid) {
      setError("Invalid brand data.");
      setShowError(true);
      return;
    }

    try {
      setLoading(true);
      setDisable(true);

      const url = `${Api.admin.post.brand.payment}/${data.uuid}`;
      const res = await PostApiCall(url, token);

      const msg = res?.data?.message || "Payment response received";
      const statuscode = res?.data?.statuscode;

      if (statuscode === 200) {
        dispatch(toggleBrandPayment(data.uuid));

        // Update brand list if passed
        if (Array.isArray(brands) && brands.length > 0) {
          const updated = brands.filter((d) => d.uuid !== data.uuid);
          setBrands(updated);
        }

        setSuccessMessage(msg);
      } else {
        setError(msg || "Payment failed");
        setShowError(true);
        setDisable(false);
      }
    } catch (err) {
      console.error("Payment Error:", err);
      const errMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to process payment. Please try again.";
      setError(errMsg);
      setShowError(true);
      setDisable(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setShowError(false);
    setSuccessMessage("");
    setDisable(false);
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="payment-dialog-title"
        aria-describedby="payment-dialog-description"
      >
        <DialogTitle id="payment-dialog-title">
          {data?.payment ? "Cancel Payment" : "Confirm Payment"}
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="payment-dialog-description">
            Are you sure you want to{" "}
            <strong>{data?.payment ? "cancel" : "confirm"}</strong> the payment
            for <strong>{data?.brandName || data?.brandname}</strong>?
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="inherit" disabled={loading}>
            No
          </Button>
          <Button
            onClick={handleConfirmPayment}
            color="success"
            variant="contained"
            autoFocus
            disabled={disable || loading}
          >
            {loading ? "Loading..." : "Yes"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Snackbar */}
      <Snackbar
        open={showError}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PaymentPopup;
