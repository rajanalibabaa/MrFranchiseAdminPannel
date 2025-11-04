import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFilteredBrands,
  toggleFreeLeadBrandPausePlayId,
} from "../Redux/Slices/FilterBrandSlice";
import { PostApiCall } from "../api/default/PostApi";
import { Api } from "../api/apiurl";

const FreeLeadPausePopup = ({ open = false, onClose, data = null }) => {
  const dispatch = useDispatch();
  const adminData = useSelector((state) => state.admin.adminData);
  const token = adminData?.adminAccessToken || null;

  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  // 🔹 Cleanup on close
  useEffect(() => {
    if (!open) {
      setInputValue("");
      setError("");
      setSuccess("");
      setLoading(false);
      setDisabled(false);
    }
  }, [open]);

  if (!data) return null;

  const isPaused = data?.isFreeLeadPaused;
  const actionLabel = isPaused ? "Resume Free Leads" : "Pause Free Leads";
  const actionColor = isPaused ? "success" : "warning";
  const brandName = (data?.brandName || data?.brandname || "this brand").trim();

  const handleConfirm = async () => {
    const trimmedInput = inputValue.trim();
    const trimmedBrand = brandName.trim();

    if (trimmedInput !== trimmedBrand) {
      setError("Brand name does not match. Please type it exactly to confirm.");
      return;
    }

    try {
      setLoading(true);
      const url = `${Api.admin.post.brand.toggleleadPausedorPlayById}/${data.uuid}`;
      const res = await PostApiCall(url, token);
    //   console.log("==res== :", res.data);
      const msg = res?.data?.message || "Action completed successfully.";

      if (res.data.statuscode === 200) {
        setSuccess(msg);
        dispatch(toggleFreeLeadBrandPausePlayId(data.uuid));
        setLoading(false);
        setDisabled(true);
        setTimeout(() => {
          onClose();
          setSuccess("");
          setDisabled(false);
        }, 1500);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={!loading ? onClose : undefined}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle
        sx={{
          fontWeight: 600,
          textAlign: "center",
          textTransform: "capitalize",
        }}
      >
        {actionLabel}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ textAlign: "center", mt: 1 }}>
          <Typography variant="body1">
            To confirm, please type <strong>{brandName}</strong> below.
          </Typography>

          <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
            {isPaused
              ? "This will resume free leads for this brand."
              : "Pausing will temporarily stop all free leads for this brand."}
          </Typography>

          <TextField
            fullWidth
            size="small"
            margin="normal"
            label="Enter brand name to confirm"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={disabled || loading}
          />

          {error && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mt: 1 }}>
              {success}
            </Alert>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={loading || disabled}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          color={actionColor}
          onClick={handleConfirm}
          disabled={disabled || !inputValue.trim() || loading}
          startIcon={
            loading && (
              <CircularProgress size={18} color="inherit" thickness={5} />
            )
          }
        >
          {loading ? "Processing..." : actionLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FreeLeadPausePopup;
