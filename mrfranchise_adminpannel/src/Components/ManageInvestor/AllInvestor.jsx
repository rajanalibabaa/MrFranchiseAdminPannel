import React, { useState, useEffect } from "react";
import InvestorTableOutlet from "../../ui/InvestorTableOutlet";
import { GetApiCall } from "../../api/default/GetApi";
import { Api } from "../../api/apiurl";
import { categories as brandCategories } from "../Brands/BrandLIstingRegister/BrandCategories";
import FilterOption from "../../ui/FilterOption";
import { 
  Typography, 
  Button, 
  Box
} from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
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
const [selectedState, setSelectedState] = useState("");   // ✅ ADD THIS

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
  }, [investors, selectedCategory, selectedInvestmentRange, selectedLocation, startDate, endDate, sortBy, sortOrder]);

  const applyFilters = () => {
    let filteredData = [...investors];

    // 1. Filter by date range if selected
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Include the entire end day

      filteredData = filteredData.filter(inv => {
        const created = new Date(inv.createdAt);
        return created >= start && created <= end;
      });
    }

    // 2. Filter by category if selected
    if (selectedCategory) {
      filteredData = filteredData.filter(inv => {
        const categories = inv.preferences?.[0]?.category || [];
        return categories.some(cat => cat.main === selectedCategory || cat.sub === selectedCategory || cat.child === selectedCategory);
      });
    }

   // 3. Filter by investment range if selected
if (selectedInvestmentRange) {
  filteredData = filteredData.filter(inv => {
    const investmentAmount = inv.preferences?.[0]?.investmentAmount || "";
    return investmentAmount === selectedInvestmentRange;
  });
}


   // 4. Filter by state if selected
if (selectedState) {
  filteredData = filteredData.filter(inv => {
    const state = inv.state || inv.preferences?.[0]?.preferredState || "";
    return state === selectedState;
  });
}

// 5. Filter by city/location if selected
if (selectedLocation) {
  filteredData = filteredData.filter(inv => {
    const preferredCity = inv.city || inv.preferences?.[0]?.preferredCity || "";
    const preferredDistrict = inv.preferences?.[0]?.preferredDistrict || "";
    return preferredCity === selectedLocation || preferredDistrict === selectedLocation;
  });
}


    setFilteredInvestors(filteredData);
  };

  const handleEdit = (investor) => {
    navigate(`/dashboard/edit-investor/${investor._id}`, { state: { investor } });
  };

  const handleDownloadExcel = () => {
    if (filteredInvestors.length === 0) {
      alert("No data to export!");
      return;
    }

    // Flatten data for Excel
    const flattenedData = filteredInvestors.map(inv => {
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

  const categoryOptions = brandCategories.flatMap(cat =>
    cat.children.flatMap(child => child.children) 
  );

  return (
    <div>
      <Box sx={{ marginBottom: "2rem" }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography sx={{ fontSize: "30px", fontWeight: "bold" }}>
            ALL INVESTORS
          </Typography>

          <Button 
            variant="contained" 
            color="success" 
            onClick={handleDownloadExcel}
            startIcon={<DownloadIcon />}
          >
            Download Excel
          </Button>
        </Box>

        {/* Filter Options */}
          <FilterOption
            allDetails ={investors}
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
            selectedState={selectedState}              // ✅ PASS
            setSelectedState={setSelectedState}        // ✅ PASS
            loading={loading}
            error={error}
          />
      </Box>

      <InvestorTableOutlet
        investors={filteredInvestors} 
        searchTerm={searchTerm}
        handleEdit={handleEdit}
      />
    </div>
  );
};

export default AllInvestor;