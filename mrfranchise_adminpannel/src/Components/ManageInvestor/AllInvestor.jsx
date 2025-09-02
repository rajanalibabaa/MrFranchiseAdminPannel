import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        const response = await GetApiCall(Api.admin.investor.getAllInvestors);
        setInvestors(response.data || []);
        setFilteredInvestors(response.data || []);
      } catch (error) {
        console.error("Error fetching Investors:", error);
      }
    };

    fetchInvestors();
  }, []);

  // Apply filters whenever any filter changes
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
      <Box sx={{ marginBottom: "2rem" }}>
        {/* Header */}
        <Box
          sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}
        >
          <Typography sx={{ fontSize: "30px", fontWeight: "bold" }}>
            ALL INVESTORS
          </Typography>

          <Button
            variant="contained"
            color="success"
            onClick={handleDownloadClick}   // ✅ FIXED (was calling handleDownloadExcel directly)
            startIcon={<DownloadIcon />}
          >
            Download Excel
          </Button>
        </Box>

        {/* Filter Options */}
        <FilterOption
          allDetails={investors}
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
      />

      {/* Captcha Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Download</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Please type the word "<strong>DOWNLOAD</strong>" to confirm.
          </Typography>
          <TextField
            fullWidth
            size="small"
            label="Enter Captcha"
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="error">
            Cancel
          </Button>
          <Button onClick={handleConfirmDownload} color="success" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AllInvestor;
