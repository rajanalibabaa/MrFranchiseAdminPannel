import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Divider,
} from "@mui/material";

const InstantApplyDialog = ({ selectedItem, onClose }) => {
  return (
    <Dialog
      open={!!selectedItem}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0px 8px 24px rgba(0,0,0,0.15)",
          backgroundColor: "#fafafa",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          px: 2,
          py: 1.5,
          borderBottom: "1px solid #eee",
          bgcolor: "warning.main",
          color: "#fff",
        }}
      >
        <Box sx={{ width: 6, height: "100%", bgcolor: "warning", mr: 2 }} />
        <DialogTitle sx={{ flexGrow: 1, p: 0, fontWeight: 600 }}>
          Investor Application Details
        </DialogTitle>
      </Box>

      {/* Content */}
      <DialogContent
        dividers
        sx={{
          backgroundColor: "#fff",
          py: 3,
        }}
      >
        {selectedItem && (
          <Grid container spacing={2}>
            {[
              { label: "Investor Name", value: selectedItem?.fullName },
              { label: "Mobile Number", value: selectedItem?.investorMobileNumber },
              { label: "Email", value: selectedItem?.email },
              { label: "Plan to Invest", value: selectedItem?.planToInvest },
              { label: "Ready to Invest", value: selectedItem?.readyToInvest },
              { label: "State", value: selectedItem?.state },
              { label: "District", value: selectedItem?.district },
              { label: "City", value: selectedItem?.city || "-" },
              { label: "Brand Email", value: selectedItem?.brandEmail },
              { label: "Apply By", value: selectedItem?.apply?.applyBy },
            ].map((item, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontWeight: 500 }}
                >
                  {item.label}
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "text.primary", fontWeight: 600 }}
                >
                  {item.value}
                </Typography>
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>

      {/* Footer */}
      <Divider />
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          color="error"
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InstantApplyDialog;
