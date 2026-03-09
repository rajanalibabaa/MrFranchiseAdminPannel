import React, { useState } from "react";
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
import { toggleBrandPausePlay } from "../Redux/Slices/FilterBrandSlice";
import { PostApiCall } from "../api/default/PostApi";
import { Api } from "../api/apiurl";

const DefaultPopup = ({
  open = false,
  onClose = () => {},
  data = null,
  onConfirmPausePlay = () => {},
  handleplay,
  header,
  handleConformApprove
}) => {
  const adminData = useSelector((state) => state.admin.adminData);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const token = adminData?.adminAccessToken || null;

  // const dispatch = useDispatch();
  if (!data) return null;

  const brandName =
    (data?.brandname || data?.data?.brandName || "this brand")?.trim();

  const handleConfirm = async () => {
    const trimmedInput = inputValue.trim();
    const trimmedBrand = brandName.trim();

    if (trimmedInput !== trimmedBrand) {
      setError("Brand name does not match. Please type it exactly to confirm.");
      return;
    }

    try {
      setLoading(true);
      setDisabled(true);
      setError("");
      setSuccess("");

    //   const url = `${Api.admin.post.brand.pausePlay}/${data.uuid}`;
      const res = await handleConformApprove(data.uuid, token);
    //   console.log("==default== :",res)
      const msg = res?.data?.message || "Action completed successfully.";

      const brandPaused =
        res?.data?.data?.brandDetails?.isBrandPause === true;

      if (!brandPaused) {
        handleplay?.(data.uuid);
      }

      setSuccess(msg);
      // dispatch(toggleBrandPausePlay(data.uuid));
      onConfirmPausePlay(data);

      setTimeout(() => {
        onClose();
        setSuccess("");
        setDisabled(false);
      }, 1500);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setDisabled(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          fontWeight: 600,
          textAlign: "center",
          textTransform: "capitalize",
        }}
      >
        {header}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ textAlign: "center", mt: 1 }}>
          <Typography variant="body1">
            To confirm, please type <strong>{brandName}</strong> below.
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
        <Button variant="outlined" onClick={onClose} disabled={loading}>
          Cancel
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={handleConfirm}
          disabled={!inputValue.trim() || loading || disabled}
          startIcon={
            loading && (
              <CircularProgress size={18} color="inherit" thickness={5} />
            )
          }
        >
          {loading ? "Processing..." : "Confirm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DefaultPopup;
