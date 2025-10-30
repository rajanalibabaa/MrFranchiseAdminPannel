import React, { useState, useEffect, useCallback } from "react";
import InvestorTableOutlet from "../../ui/InvestorTableOutlet";
import { GetApiCall } from "../../api/default/GetApi";
import { Api } from "../../api/apiurl";
import FilterOption from "../../ui/FilterOption";
import {
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";

const AllInvestor = () => {
  const navigate = useNavigate();
  const [investors, setInvestors] = useState([]);
  const [filteredInvestors, setFilteredInvestors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  // Date filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Other filters
  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedInvestmentRange, setSelectedInvestmentRange] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedState, setSelectedState] = useState("");

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Dialog State
  const [openDialog, setOpenDialog] = useState(false);
  const [captchaInput, setCaptchaInput] = useState("");
  const CAPTCHA_WORD = "DOWNLOAD";

  // Add refresh counter for force re-render
  const [refreshKey, setRefreshKey] = useState(0);

  // Memoize the fetch function
  const fetchInvestors = useCallback(async () => {
    setLoading(true);
    try {
      const response = await GetApiCall(Api.admin.investor.getAllInvestors);
      const investorData = response.data || [];
      setInvestors(investorData);
      setFilteredInvestors(investorData);
      setError("");
    } catch (error) {
      console.error("Error fetching Investors:", error);
      setError("Failed to fetch investors");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvestors();
  }, [fetchInvestors, refreshKey]);

  useEffect(() => {
    applyFilters();
  }, [
    investors,
    selectedCategory,
    selectedInvestmentRange,
    selectedLocation,
    selectedState,
    startDate,
    endDate,
    sortBy,
    sortOrder,
  ]);

  const applyFilters = () => {
    let filteredData = [...investors];

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filteredData = filteredData.filter((inv) => {
        const created = new Date(inv.createdAt);
        return created >= start && created <= end;
      });
    }

    if (selectedCategory) {
      filteredData = filteredData.filter((inv) => {
        const categories = inv.preferences?.[0]?.category || [];
        return categories.some(
          (cat) =>
            cat.main === selectedCategory ||
            cat.sub === selectedCategory ||
            cat.child === selectedCategory
        );
      });
    }

    if (selectedInvestmentRange) {
      filteredData = filteredData.filter((inv) => {
        const investmentAmount = inv.preferences?.[0]?.investmentAmount || "";
        return investmentAmount === selectedInvestmentRange;
      });
    }

    if (selectedState) {
      filteredData = filteredData.filter((inv) => {
        const state = inv.state || inv.preferences?.[0]?.preferredState || "";
        return state === selectedState;
      });
    }

    if (selectedLocation) {
      filteredData = filteredData.filter((inv) => {
        const preferredCity = inv.city || inv.preferences?.[0]?.preferredCity || "";
        const preferredDistrict = inv.preferences?.[0]?.preferredDistrict || "";
        return (
          preferredCity === selectedLocation ||
          preferredDistrict === selectedLocation
        );
      });
    }

    setFilteredInvestors(filteredData);
  };

  const handleEdit = (investor) => {
    navigate(`/dashboard/edit-investor/${investor._id}`, { state: { investor } });
  };

  // Handle delete operation
  const handleDelete = useCallback(async (investorId) => {
    try {
      // Optimistically update the UI immediately
      setInvestors(prev => prev.filter(inv => inv._id !== investorId));
      setFilteredInvestors(prev => prev.filter(inv => inv._id !== investorId));
      
      console.log("Investor deleted successfully, UI updated");
      
      // Optionally refresh from server after a short delay
      setTimeout(() => {
        setRefreshKey(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error("Delete operation failed:", error);
      // If delete fails, refresh to restore the data
      setRefreshKey(prev => prev + 1);
    }
  }, []);

  // Force refresh function
  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  // Excel Download function
  const downloadExcel = () => {
    if (filteredInvestors.length === 0) {
      alert("No data to export!");
      return;
    }

    const flattenedData = filteredInvestors.map((inv) => {
      const firstPref = inv.preferences?.[0] || {};
      const firstCategory = firstPref.category?.[0] || {};
      const firstProperty = firstPref.propertyPreferred?.[0] || {};

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
        "Created At": inv.createdAt ? new Date(inv.createdAt).toLocaleString() : "",
        "Updated At": inv.updatedAt ? new Date(inv.updatedAt).toLocaleString() : "",
        UUID: inv.uuid || "",
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(flattenedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Investors");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "AllInvestors.xlsx");
  };

  // Open dialog when user clicks download
  const handleDownloadClick = () => {
    setCaptchaInput("");
    setOpenDialog(true);
  };

  // Validate captcha then download
  const handleConfirmDownload = () => {
    if (captchaInput.trim().toUpperCase() === CAPTCHA_WORD) {
      setOpenDialog(false);
      downloadExcel();
    } else {
      alert("Captcha incorrect. Please type DOWNLOAD exactly.");
    }
  };

  return (
    <>
      <Box
        sx={{
          mb: { xs: 2, sm: 3 },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "row", sm: "row" },
            gap: { xs: 1, sm: 0 },
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: { xs: "20px", sm: "30px" },
                fontWeight: "bold",
                mb: { xs: 1, sm: 2 },
              }}
            >
              ALL INVESTORS
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "12px", sm: "14px" },
                color: "gray",
              }}
            >
              Showing {filteredInvestors.length} of {investors.length}
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              [theme => theme.breakpoints.down("sm")]: {
                alignSelf: "flex-end",
                width: "100%",
                justifyContent: "flex-end",
              },
            }}
          >
            {/* Refresh Button */}
            <Button
              variant="outlined"
              color="primary"
              onClick={handleRefresh}
              disabled={loading}
              sx={{
                px: { xs: 1, sm: 2 },
                py: { xs: 0.7, sm: 1 },
                fontSize: { xs: "0.65rem", sm: "0.875rem" },
                minWidth: { xs: "70px", sm: "100px" },
              }}
            >
              {loading ? "Loading..." : "Refresh"}
            </Button>

            {/* Download Excel Button */}
            <Button
              variant="contained"
              color="success"
              onClick={handleDownloadClick}
              startIcon={<DownloadIcon />}
              sx={{
                px: { xs: 0.7, sm: 3 },
                py: { xs: 0.7, sm: 1 },
                fontSize: { xs: "0.65rem", sm: "0.875rem" },
                minWidth: { xs: "80px", sm: "120px" },
              }}
            >
              Download Excel
            </Button>
          </Box>
        </Box>

        {/* Filter Options */}
        <FilterOption
          allDetails={investors}
          selectedMainCategory={selectedMainCategory}
          setSelectedMainCategory={setSelectedMainCategory}
          selectedSubCategory={selectedSubCategory}
          setSelectedSubCategory={setSelectedSubCategory}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedInvestmentRange={selectedInvestmentRange}
          setSelectedInvestmentRange={setSelectedInvestmentRange}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          loading={loading}
          error={error}
        />
      </Box>

      <InvestorTableOutlet
        investors={filteredInvestors}
        searchTerm={searchTerm}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        onRefresh={handleRefresh}
        loading={loading}
      />

      {/* Captcha Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: { xs: 1, sm: 2 },
            width: { xs: "90%", sm: 400 },
            maxWidth: "100%",
            bgcolor: "#f9fafb",
            boxShadow: "0px 6px 20px rgba(0,0,0,0.2)",
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: { xs: "16px", sm: "20px" },
            color: "#2c3e50",
          }}
        >
          Confirm Download
        </DialogTitle>

        <DialogContent>
          <Box sx={{ textAlign: "center", mb: { xs: 1, sm: 2 } }}>
            <Typography sx={{ mb: 1, fontSize: { xs: "12px", sm: "14px" } }}>
              Please type the word below to confirm:
            </Typography>

            {/* Captcha Box */}
            <Box
              sx={{
                display: "inline-block",
                px: { xs: 2, sm: 4 },
                py: { xs: 1, sm: 1.5 },
                borderRadius: 2,
                bgcolor: "#eaf4ff",
                border: "1px dashed #1976d2",
                fontSize: { xs: "16px", sm: "18px" },
                fontWeight: "bold",
                letterSpacing: "3px",
                color: "#1976d2",
                mb: { xs: 1, sm: 2 },
              }}
            >
              {CAPTCHA_WORD}
            </Box>

            {/* Input */}
            <TextField
              fullWidth
              size="small"
              label="Enter Captcha"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              sx={{ fontSize: { xs: "12px", sm: "14px" } }}
            />
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "space-between",
            px: { xs: 2, sm: 3 },
            pb: { xs: 1, sm: 2 },
          }}
        >
          <Button
            onClick={() => setOpenDialog(false)}
            color="error"
            variant="outlined"
            sx={{
              borderRadius: 2,
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDownload}
            color="success"
            variant="contained"
            sx={{
              borderRadius: 2,
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            }}
            disabled={captchaInput.trim().toUpperCase() !== CAPTCHA_WORD}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AllInvestor;
