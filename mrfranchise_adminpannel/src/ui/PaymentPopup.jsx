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

const PaymentPopup = ({ open, onClose, data }) => {
  const adminData = useSelector((state) => state.admin.adminData);
  const token = adminData?.adminAccessToken || null;
  const dispatch = useDispatch();

  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [disable, setdisable] = useState(false);
 

  const handleConfirmPayment = async () => {
    try {
      setLoading(true);
      const url = `${Api.admin.post.brand.payment}/${data.uuid}`;
      const res = await PostApiCall(url, token);
    //   console.log("Payment Response:", res.data);

      const msg = res.data?.message || "Payment response received";

      if (res.data.statuscode === 200) {
        dispatch(toggleBrandPayment(data.uuid));
        setSuccessMessage(msg);
        setLoading(false);
        setdisable(true)
      } else {
        setError(msg || "Payment failed");
        setShowError(true);
      }
    } catch (err) {
      console.error("Payment Error:", err);

      const errMsg =
        err.response?.data?.error ||
        err.message ||
        "Failed to process payment. Please try again.";
      setError(errMsg);
      setShowError(true);
    }
  };

  const handleCloseError = () => {
    setShowError(false);
    setSuccessMessage("");
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
          {data.payment ? "Cancel Payment" : "Confirm Payment"}
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="payment-dialog-description">
            <span>
              Are you sure you want to{" "}
              <strong>{data.payment ? "cancel" : "confirm"}</strong> the payment
              for <strong>{data?.brandName || data.brandname}</strong>?
            </span>
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="inherit">
            No
          </Button>
          <Button
            onClick={handleConfirmPayment}
            color="success"
            variant="contained"
            autoFocus
            disabled={disable === true}          >
            {loading ? "loading..." :"Yes"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showError}
        autoHideDuration={1000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={1000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseError}
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
