import React, { useState } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";

const InvestorTableOutlet = ({ investors, searchTerm }) => {
  const [open, setOpen] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState(null);

  const handleView = (investor) => {
    setSelectedInvestor(investor);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedInvestor(null);
  };

  return (
    <>
      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Investment Range</TableCell>
              <TableCell>Registered Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {investors?.length > 0 ? (
              investors.map((investor, index) => (
                <TableRow key={investor?._id || index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{investor?.firstName || "N/A"}</TableCell>
                  <TableCell>
                    {investor?.preferences?.length > 0 &&
                    investor.preferences[0]?.category?.length > 0
                      ? investor.preferences[0].category
                          .map((cat) => cat.child) // only child
                          .filter(Boolean)
                          .join(", ")
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {[investor?.city, investor?.state, investor?.country]
                      .filter(Boolean)
                      .join(", ") || "N/A"}
                  </TableCell>
                  <TableCell>
                    {investor?.preferences?.length > 0 &&
                    investor.preferences[0]?.investmentAmount
                      ? investor.preferences[0].investmentAmount
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {investor?.createdAt
                      ? new Date(investor.createdAt).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="secondary"
                      onClick={() => handleView(investor)}
                    >
                      <Visibility />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  {searchTerm
                    ? "No matching investors found"
                    : "No investors available"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Popup Dialog */}
     <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
  <DialogTitle>Investor Details</DialogTitle>
  <DialogContent dividers>
    {selectedInvestor ? (
      <>
        {/* Basic Info */}
        <Typography variant="subtitle1">
          <b>Investor ID:</b> {selectedInvestor.inveterID || "N/A"}
        </Typography>
        <Typography variant="subtitle1">
          <b>Name:</b> {selectedInvestor.firstName || "N/A"}
        </Typography>
        <Typography variant="subtitle1">
          <b>Email:</b> {selectedInvestor.email || "N/A"}
        </Typography>
        <Typography variant="subtitle1">
          <b>Mobile Number:</b> {selectedInvestor.mobileNumber || "N/A"}
        </Typography>
        <Typography variant="subtitle1">
          <b>WhatsApp Number:</b> {selectedInvestor.whatsappNumber || "N/A"}
        </Typography>
        <Typography variant="subtitle1">
          <b>Occupation:</b> {selectedInvestor.occupation || "N/A"}
        </Typography>
        <Divider sx={{ my: 1 }} />

        {/* Address Info */}
        <Typography variant="subtitle1">
          <b>Address:</b> {selectedInvestor.address || "N/A"}
        </Typography>
        <Typography variant="subtitle1">
          <b>City:</b> {selectedInvestor.city || "N/A"}
        </Typography>
        <Typography variant="subtitle1">
          <b>District:</b> {selectedInvestor.preferredDistrict || "N/A"}
        </Typography>
        <Typography variant="subtitle1">
          <b>State:</b> {selectedInvestor.state || "N/A"}
        </Typography>
        <Typography variant="subtitle1">
          <b>Country:</b> {selectedInvestor.country || "N/A"}
        </Typography>
        <Typography variant="subtitle1">
          <b>Pincode:</b> {selectedInvestor.pincode || "N/A"}
        </Typography>
        <Divider sx={{ my: 1 }} />

        {/* Preferences */}
        <Typography variant="subtitle1">
          <b>Category:</b>{" "}
          {selectedInvestor?.preferences?.[0]?.category?.length > 0
            ? selectedInvestor.preferences[0].category
                .map((cat) => {
                  const main = cat.main || "";
                  const sub = cat.sub || "";
                  const child = cat.child || "";
                  return [main, sub, child].filter(Boolean).join(" > ");
                })
                .join(", ")
            : "N/A"}
        </Typography>

        <Typography variant="subtitle1">
          <b>Investment Amount:</b>{" "}
          {selectedInvestor?.preferences?.[0]?.investmentAmount || "N/A"}
        </Typography>
        <Typography variant="subtitle1">
          <b>Investment Range:</b>{" "}
          {selectedInvestor?.preferences?.[0]?.investmentRange || "N/A"}
        </Typography>
        <Typography variant="subtitle1">
          <b>Location Type:</b>{" "}
          {selectedInvestor?.preferences?.[0]?.locationType || "N/A"}
        </Typography>
        <Typography variant="subtitle1">
          <b>Preferred State:</b> {selectedInvestor?.preferences?.[0]?.preferredState || "N/A"}
        </Typography>
        <Typography variant="subtitle1">
          <b>Preferred City:</b> {selectedInvestor?.preferences?.[0]?.preferredCity || "N/A"}
        </Typography>
         <Typography variant="subtitle1">
          <b>Preferred Country:</b> {selectedInvestor?.preferences?.[0]?.preferredCountry || "N/A"}
        </Typography>
        <Divider sx={{ my: 1 }} />

        {/* Property Preferences */}
       {selectedInvestor?.preferences?.[0]?.propertyPreferred?.length > 0 && (
  <>
    <Typography variant="h6" sx={{ mt: 1 }}>Property Preferences:</Typography>
    {selectedInvestor.preferences[0].propertyPreferred.map((prop, idx) => (
      <div key={idx}>
        <Typography><b>Type:</b> {prop.propertyType}</Typography>
        <Typography><b>Size:</b> {prop.propertySize}</Typography>
        <Typography><b>City:</b> {prop.propertyCity}</Typography>
        <Typography><b>State:</b> {prop.propertyState}</Typography>
        <Typography><b>Country:</b> {prop.propertyCountry}</Typography>
      </div>
    ))}
  </>
)}


        {/* Audit Info */}
        <Typography variant="subtitle1">
          <b>Registered Date:</b>{" "}
          {selectedInvestor?.createdAt
            ? new Date(selectedInvestor.createdAt).toLocaleDateString()
            : "N/A"}
        </Typography>
        <Typography variant="subtitle1">
          <b>Last Updated:</b>{" "}
          {selectedInvestor?.updatedAt
            ? new Date(selectedInvestor.updatedAt).toLocaleDateString()
            : "N/A"}
        </Typography>
      </>
    ) : (
      <Typography>No data available</Typography>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose} variant="contained" color="primary">
      Close
    </Button>
  </DialogActions>
</Dialog>

    </>
  );
};

export default InvestorTableOutlet;
