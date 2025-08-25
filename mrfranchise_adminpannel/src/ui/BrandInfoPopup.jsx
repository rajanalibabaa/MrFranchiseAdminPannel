import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Avatar,
  Divider,
} from "@mui/material";

const BrandInfoPopup = ({ open, onClose, brandDetails }) => {
  if (!brandDetails) return null;

  const { brandDetails: bd, franchiseDetails, uploads } = brandDetails;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      {/* Header */}
      <DialogTitle>
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <Avatar
              src={uploads?.brandLogo?.[0]}
              alt={bd?.brandName}
              sx={{ width: 60, height: 60 }}
            />
          </Grid>
          <Grid item>
            <Typography variant="h6">{bd?.brandName}</Typography>
            <Typography variant="body2" color="textSecondary">
              {bd?.tagLine}
            </Typography>
          </Grid>
        </Grid>
      </DialogTitle>

      <Divider />

      {/* Content */}
      <DialogContent dividers>
        <Grid container spacing={2}>
          {/* Company Info */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              Company Info
            </Typography>
            <Typography>Name: {bd?.fullName}</Typography>
            <Typography>Email: {bd?.email}</Typography>
            <Typography>Mobile: {bd?.mobileNumber}</Typography>
            <Typography>Company: {bd?.companyName}</Typography>
            <Typography>CEO: {bd?.ceoName}</Typography>
            <Typography>CEO Mobile: {bd?.ceoMobile}</Typography>
            <Typography>CEO Email: {bd?.ceoEmail}</Typography>
            <Typography>Office Email: {bd?.officeEmail}</Typography>
            <Typography>Office Mobile: {bd?.officeMobile}</Typography>
          </Grid>

          {/* Location Info */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              Location
            </Typography>
            <Typography>Address: {bd?.headOfficeAddress}</Typography>
            <Typography>
              {bd?.city}, {bd?.district}, {bd?.state}, {bd?.country} -{" "}
              {bd?.pincode}
            </Typography>
            <Typography>Website: {bd?.website}</Typography>
          </Grid>

          {/* Franchise Info */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" fontWeight="bold">
              Franchise Details
            </Typography>
            <Typography>
              Category: {franchiseDetails?.brandCategories?.main} →{" "}
              {franchiseDetails?.brandCategories?.sub} (
              {franchiseDetails?.brandCategories?.child})
            </Typography>
            <Typography>
              Outlets: {franchiseDetails?.totalOutlets} (Franchise:{" "}
              {franchiseDetails?.franchiseOutlets}, Company-owned:{" "}
              {franchiseDetails?.companyOwnedOutlets})
            </Typography>
            <Typography>
              Established: {franchiseDetails?.establishedYear}
            </Typography>
            <Typography sx={{ mt: 1 }}>
              {franchiseDetails?.brandDescription}
            </Typography>
          </Grid>

          {/* Media Preview */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" fontWeight="bold">
              Media
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {uploads?.exteriorOutlet?.map((img, i) => (
                <Grid item key={i}>
                  <Avatar
                    src={img}
                    alt="Outlet"
                    variant="rounded"
                    sx={{ width: 80, height: 80 }}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>

      {/* Footer */}
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BrandInfoPopup;
