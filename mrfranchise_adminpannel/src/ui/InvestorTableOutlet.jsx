import React, { useState } from "react";
import {
  TextField,
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
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Visibility, Download, Edit, Delete } from "@mui/icons-material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axios from "axios";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const InvestorTableOutlet = ({ investors, searchTerm, onInvestorDelete }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [deleteCaptcha, setDeleteCaptcha] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleView = (investor) => {
    setSelectedInvestor(investor);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedInvestor(null);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedInvestor(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const flattenInvestor = (inv) => {
    const firstPref = inv?.preferences?.[0] || {};
    const firstCategory = firstPref?.category?.[0] || {};
    const firstProperty = firstPref?.propertyPreferred?.[0] || {};

    return {
      "Investor ID": inv.inveterID || "",
      Name: inv.firstName || "",
      Email: inv.email || "",
      Mobile: inv.mobileNumber || "",
      Whatsapp: inv.whatsappNumber || "",
      Occupation: inv.occupation || "",
      Address: inv.address || "",
      Pincode: inv.pincode || "",
      City: inv.city || "",
      State: inv.state || "",
      Country: inv.country || "",
      "Category Main": firstCategory.main || "",
      "Category Sub": firstCategory.sub || "",
      "Category Child": firstCategory.child || "",
      "Investment Amount": firstPref.investmentAmount || "",
      "Investment Range": firstPref.investmentRange || "",
      "Location Type": firstPref.locationType || "",
      "Preferred City": firstPref.preferredCity || "",
      "Preferred District": firstPref.preferredDistrict || "",
      "Preferred State": firstPref.preferredState || "",
      "Preferred Country": firstPref.preferredCountry || "",
      "Property Type": firstProperty.propertyType || "",
      "Property Size": firstProperty.propertySize || "",
      "Property City": firstProperty.propertyCity || "",
      "Property State": firstProperty.propertyState || "",
      "Property Country": firstProperty.propertyCountry || "",
      "Created At": inv.createdAt
        ? new Date(inv.createdAt).toLocaleString()
        : "",
      "Updated At": inv.updatedAt
        ? new Date(inv.updatedAt).toLocaleString()
        : "",
      UUID: inv.uuid || "",
    };
  };

  // const handleDownload = (investor) => {
  //   const investorData = flattenInvestor(investor);

  //   const worksheet = XLSX.utils.json_to_sheet([investorData]);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Investor");

  //   const excelBuffer = XLSX.write(workbook, {
  //     bookType: "xlsx",
  //     type: "array",
  //   });
  //   const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  //   saveAs(data, `Investor_${investor._id || "data"}.xlsx`);
  // };

  const handleEdit = (investor) => {
    navigate(`/dashboard/edit-investor/${investor._id}`, { state: { investor } });
  };

  const handleDelete = (investor) => {
    setSelectedInvestor(investor);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedInvestor?.uuid) {
      setSnackbar({
        open: true,
        message: "Cannot delete investor: UUID not found",
        severity: "error",
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `https://mrfranchisebackend.mrfranchise.in/api/v1/investor/deleteInvestor/${selectedInvestor.uuid}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setSnackbar({
          open: true,
          message: "Investor deleted successfully",
          severity: "success",
        });
        
        // Call the parent component's callback to refresh the list
        if (onInvestorDelete) {
          onInvestorDelete(selectedInvestor.uuid);
        }
      } else {
        throw new Error(response.data.message || "Failed to delete investor");
      }
    } catch (error) {
      console.error("Error deleting investor:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to delete investor",
        severity: "error",
      });
    } finally {
      handleCloseDeleteDialog();
    }
  };

  return (
    <>
      {/* Table */}
      <TableContainer  component={Paper}>
        <Table>
          <TableHead >
            <TableRow  sx={{ backgroundColor: "#ff9800" }}>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>S No</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Category</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Location</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Investment Range</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Registered Date</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {investors?.length > 0 ? (
              investors.map((investor, index) => (
                <TableRow key={investor?._id || index}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="center">{investor?.firstName || "N/A"}</TableCell>
                  <TableCell align="center">
                    {investor?.preferences?.length > 0 &&
                    investor.preferences[0]?.category?.length > 0
                      ? investor.preferences[0].category
                          .map((cat) => cat.sub)
                          .filter(Boolean)
                          .join(", ")
                      : "N/A"}
                  </TableCell>
                  <TableCell align="center">
                    {[investor?.city, investor?.state, investor?.country]
                      .filter(Boolean)
                      .join(", ") || "N/A"}
                  </TableCell>
                  <TableCell align="center">
                    {investor?.preferences?.length > 0 &&
                    investor.preferences[0]?.investmentAmount
                      ? investor.preferences[0].investmentAmount
                      : "N/A"}
                  </TableCell>
                  <TableCell align="center">
                    {investor?.createdAt
                      ? new Date(investor.createdAt).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell sx={{ gap: 1, display: "flex" }}>
                    <IconButton
                      sx={{ color: "#ff9800" }}
                      onClick={() => handleView(investor)}
                    >
                      <Visibility />
                    </IconButton>
                    {/* <IconButton
                      sx={{ color: "#1976d2" }}
                      onClick={() => handleDownload(investor)}
                    >
                      <Download />
                    </IconButton> */}
                    <IconButton
                      sx={{ color: "#7ad03a" }}
                      onClick={() => handleEdit(investor)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      sx={{ color: "#d32f2f" }}
                      onClick={() => handleDelete(investor)}
                    >
                      <Delete />
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

      {/* View Details Dialog */}
    <Dialog
  open={open}
  onClose={handleClose}
  maxWidth="sm"
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: 3,
      p: 2,
      bgcolor: "#f9fafb",
      boxShadow: "0px 8px 25px rgba(0,0,0,0.2)",
    },
  }}
>
  <DialogTitle
    sx={{
      fontWeight: "bold",
      fontSize: "22px",
      textAlign: "center",
      color: "#2c3e50",
      pb: 1,
    }}
  >
    Investor Details
  </DialogTitle>

  <DialogContent dividers sx={{ px: 3, py: 2 }}>
    {selectedInvestor ? (
      <>
        {/* Personal Info */}
        <Typography
          variant="h6"
          sx={{ mb: 1, color: "#7ad03a", fontWeight: "600" }}
        >
          Personal Information
        </Typography>
        <Box sx={{ pl: 1, mb: 2 }}>
          <Typography><b>Investor ID:</b> {selectedInvestor.inveterID || "N/A"}</Typography>
          <Typography><b>Name:</b> {selectedInvestor.firstName || "N/A"}</Typography>
          <Typography><b>Email:</b> {selectedInvestor.email || "N/A"}</Typography>
          <Typography><b>Mobile Number:</b> {selectedInvestor.mobileNumber || "N/A"}</Typography>
          <Typography><b>WhatsApp Number:</b> {selectedInvestor.whatsappNumber || "N/A"}</Typography>
          <Typography><b>Occupation:</b> {selectedInvestor.occupation || "N/A"}</Typography>
        </Box>
        <Divider sx={{ my: 2 }} />

        {/* Address Info */}
        <Typography
          variant="h6"
          sx={{ mb: 1, color: "#7ad03a", fontWeight: "600" }}
        >
          Address
        </Typography>
        <Box sx={{ pl: 1, mb: 2 }}>
          <Typography><b>Address:</b> {selectedInvestor.address || "N/A"}</Typography>
          <Typography><b>City:</b> {selectedInvestor.city || "N/A"}</Typography>
          <Typography><b>District:</b> {selectedInvestor.preferredDistrict || "N/A"}</Typography>
          <Typography><b>State:</b> {selectedInvestor.state || "N/A"}</Typography>
          <Typography><b>Country:</b> {selectedInvestor.country || "N/A"}</Typography>
          <Typography><b>Pincode:</b> {selectedInvestor.pincode || "N/A"}</Typography>
        </Box>
        <Divider sx={{ my: 2 }} />

        {/* Preferences */}
        <Typography
          variant="h6"
          sx={{ mb: 1, color: "#7ad03a", fontWeight: "600" }}
        >
          Preferences
        </Typography>
        <Box sx={{ pl: 1, mb: 2 }}>
          <Typography>
            <b>Category:</b>{" "}
            {selectedInvestor?.preferences?.[0]?.category?.length > 0
              ? selectedInvestor.preferences[0].category
                  .map((cat) =>
                    [cat.main, cat.sub, cat.child].filter(Boolean).join(" > ")
                  )
                  .join(", ")
              : "N/A"}
          </Typography>
          <Typography><b>Investment Amount:</b> {selectedInvestor?.preferences?.[0]?.investmentAmount || "N/A"}</Typography>
          <Typography><b>Investment Range:</b> {selectedInvestor?.preferences?.[0]?.investmentRange || "N/A"}</Typography>
          <Typography><b>Location Type:</b> {selectedInvestor?.preferences?.[0]?.locationType || "N/A"}</Typography>
          <Typography><b>Preferred State:</b> {selectedInvestor?.preferences?.[0]?.preferredState || "N/A"}</Typography>
          <Typography><b>Preferred City:</b> {selectedInvestor?.preferences?.[0]?.preferredCity || "N/A"}</Typography>
          <Typography><b>Preferred Country:</b> {selectedInvestor?.preferences?.[0]?.preferredCountry || "N/A"}</Typography>
        </Box>
        <Divider sx={{ my: 2 }} />

        {/* Property Preferences */}
        {selectedInvestor?.preferences?.[0]?.propertyPreferred?.length > 0 && (
          <>
            <Typography
              variant="h6"
              sx={{ mb: 1, color: "#7ad03a", fontWeight: "600" }}
            >
              Property Preferences
            </Typography>
            <Box sx={{ pl: 1, mb: 2 }}>
              {selectedInvestor.preferences[0].propertyPreferred.map((prop, idx) => (
                <Box
                  key={idx}
                  sx={{
                    mb: 1,
                    p: 1,
                    border: "1px solid #e0e0e0",
                    borderRadius: 2,
                    bgcolor: "#ffffff",
                  }}
                >
                  <Typography><b>Type:</b> {prop.propertyType || "N/A"}</Typography>
                  <Typography><b>Size:</b> {prop.propertySize || "N/A"}</Typography>
                  <Typography><b>City:</b> {prop.propertyCity || "N/A"}</Typography>
                  <Typography><b>State:</b> {prop.propertyState || "N/A"}</Typography>
                  <Typography><b>Country:</b> {prop.propertyCountry || "N/A"}</Typography>
                </Box>
              ))}
            </Box>
          </>
        )}

        {/* Dates */}
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" sx={{ mb: 1, color: "#7ad03a", fontWeight: "600" }}>
          Registration Info
        </Typography>
        <Box sx={{ pl: 1 }}>
          <Typography>
            <b>Registered Date:</b>{" "}
            {selectedInvestor?.createdAt
              ? new Date(selectedInvestor.createdAt).toLocaleDateString()
              : "N/A"}
          </Typography>
          <Typography>
            <b>Last Updated:</b>{" "}
            {selectedInvestor?.updatedAt
              ? new Date(selectedInvestor.updatedAt).toLocaleDateString()
              : "N/A"}
          </Typography>
        </Box>
      </>
    ) : (
      <Typography>No data available</Typography>
    )}
  </DialogContent>

  <DialogActions sx={{ justifyContent: "center", py: 2 }}>
    <Button
      onClick={handleClose}
      variant="contained"
      color="error"
      sx={{ borderRadius: 2, px: 4 }}
    >
      Close
    </Button>
  </DialogActions>
</Dialog>
      {/* Delete Confirmation Dialog */}
     <Dialog
  open={deleteDialogOpen}
  onClose={handleCloseDeleteDialog}
  maxWidth="xs"
  PaperProps={{
    sx: {
      borderRadius: 3,
      p: 2,
      bgcolor: "#fff8f8",
      boxShadow: "0px 6px 20px rgba(0,0,0,0.25)",
    },
  }}
>
  <DialogTitle
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 1,
      fontWeight: "bold",
      fontSize: "20px",
      color: "#d32f2f",
    }}
  >
    <WarningAmberIcon sx={{ color: "#d32f2f", fontSize: 28 }} />
    Confirm Delete
  </DialogTitle>

  <DialogContent>
    <Typography
      align="center"
      sx={{ fontSize: "15px", color: "#444", mb: 2 }}
    >
      Are you sure you want to delete investor{" "}
      <strong>{selectedInvestor?.firstName || "this investor"}</strong>?  
      <br />
      <span style={{ color: "#d32f2f", fontWeight: "bold" }}>
        This action cannot be undone.
      </span>
    </Typography>

    {/* Captcha Instruction */}
    <Typography align="center" sx={{ mt: 2, mb: 1, fontWeight: 500 }}>
      Type <span style={{ color: "#d32f2f" }}>DELETE</span> to confirm:
    </Typography>

    {/* Captcha Input */}
    <TextField
      fullWidth
      size="small"
      variant="outlined"
      placeholder="Type DELETE"
      value={deleteCaptcha}
      onChange={(e) => setDeleteCaptcha(e.target.value)}
    />
  </DialogContent>

  <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 2 }}>
    <Button
      onClick={handleCloseDeleteDialog}
      variant="outlined"
      color="primary"
      sx={{ borderRadius: 2, px: 3 }}
    >
      Cancel
    </Button>
    <Button
      onClick={confirmDelete}
      color="error"
      variant="contained"
      sx={{ borderRadius: 2, px: 3 }}
      disabled={deleteCaptcha !== "DELETE"} 
    >
      Delete
    </Button>
  </DialogActions>
</Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default InvestorTableOutlet;