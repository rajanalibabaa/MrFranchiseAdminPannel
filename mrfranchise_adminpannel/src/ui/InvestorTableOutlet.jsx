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
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Visibility, Download, Edit, Delete } from "@mui/icons-material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axios from "axios";

const InvestorTableOutlet = ({ investors, searchTerm, onInvestorDelete }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
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

  const handleDownload = (investor) => {
    const investorData = flattenInvestor(investor);

    const worksheet = XLSX.utils.json_to_sheet([investorData]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Investor");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `Investor_${investor._id || "data"}.xlsx`);
  };

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
        `http://localhost:5000/api/v1/investor/deleteInvestor/${selectedInvestor.uuid}`,
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
                          .map((cat) => cat.child)
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
                  <TableCell sx={{ gap: 1, display: "flex" }}>
                    <IconButton
                      sx={{ color: "#1976d2" }}
                      onClick={() => handleView(investor)}
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      sx={{ color: "#1976d2" }}
                      onClick={() => handleDownload(investor)}
                    >
                      <Download />
                    </IconButton>
                    <IconButton
                      sx={{ color: "#1976d2" }}
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
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Investor Details</DialogTitle>
        <DialogContent dividers>
          {selectedInvestor ? (
            <>
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

              <Typography variant="subtitle1">
                <b>Category:</b>{" "}
                {selectedInvestor?.preferences?.[0]?.category?.length > 0
                  ? selectedInvestor.preferences[0].category
                      .map((cat) =>
                        [cat.main, cat.sub, cat.child].filter(Boolean).join(" > ")
                      )
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
                <b>Preferred State:</b>{" "}
                {selectedInvestor?.preferences?.[0]?.preferredState || "N/A"}
              </Typography>
              <Typography variant="subtitle1">
                <b>Preferred City:</b>{" "}
                {selectedInvestor?.preferences?.[0]?.preferredCity || "N/A"}
              </Typography>
              <Typography variant="subtitle1">
                <b>Preferred Country:</b>{" "}
                {selectedInvestor?.preferences?.[0]?.preferredCountry || "N/A"}
              </Typography>
              <Divider sx={{ my: 1 }} />

              {selectedInvestor?.preferences?.[0]?.propertyPreferred?.length >
                0 && (
                <>
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    Property Preferences:
                  </Typography>
                  {selectedInvestor.preferences[0].propertyPreferred.map(
                    (prop, idx) => (
                      <div key={idx}>
                        <Typography>
                          <b>Type:</b> {prop.propertyType}
                        </Typography>
                        <Typography>
                          <b>Size:</b> {prop.propertySize}
                        </Typography>
                        <Typography>
                          <b>City:</b> {prop.propertyCity}
                        </Typography>
                        <Typography>
                          <b>State:</b> {prop.propertyState}
                        </Typography>
                        <Typography>
                          <b>Country:</b> {prop.propertyCountry}
                        </Typography>
                      </div>
                    )
                  )}
                </>
              )}

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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete investor{" "}
            <strong>{selectedInvestor?.firstName || "this investor"}</strong>?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
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