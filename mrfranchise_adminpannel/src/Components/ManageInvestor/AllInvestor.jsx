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

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

 

  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        const response = await GetApiCall(Api.admin.investor.getAllInvestors);
        setInvestors(response.data || []);
      } catch (error) {
        console.error("Error fetching Investors:", error);
      }
    };

    fetchInvestors();
  }, []);
  const handleEdit = (investor) => {
  navigate(`/dashboard/edit-investor/${investor._id}`, { state: { investor } });
};

  const handleDownloadExcel = () => {
    if (investors.length === 0) {
      alert("No data to export!");
      return;
    }

    // 1. Filter by date range if selected
    let filteredInvestors = [...investors];
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      filteredInvestors = filteredInvestors.filter(inv => {
        const created = new Date(inv.createdAt);
        return created >= start && created <= end;
      });
    }

    // 2. Filter by category if selected
    if (selectedCategory) {
      filteredInvestors = filteredInvestors.filter(inv => {
        const categories = inv.preferences?.[0]?.category || [];
        return categories.some(cat => cat.main === selectedCategory);
      });
    }

    // 3. Filter by investment range if selected
    if (selectedInvestmentRange) {
      filteredInvestors = filteredInvestors.filter(inv => {
        const investmentRange = inv.preferences?.[0]?.investmentRange || "";
        return investmentRange === selectedInvestmentRange;
      });
    }

    // 4. Filter by location if selected
    if (selectedLocation) {
      filteredInvestors = filteredInvestors.filter(inv => {
        const preferredCity = inv.preferences?.[0]?.preferredCity || "";
        const preferredState = inv.preferences?.[0]?.preferredState || "";
        return preferredCity === selectedLocation || preferredState === selectedLocation;
      });
    }

    if (filteredInvestors.length === 0) {
      alert("No data matches the selected filters!");
      return;
    }

    // 5. Sort the filtered investors
    switch(sortBy) {
      case "date":
        filteredInvestors.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        });
        break;
      case "investment":
        filteredInvestors.sort((a, b) => {
          const amountA = a.preferences && a.preferences[0] ? 
            parseInt(a.preferences[0].investmentAmount || 0) : 0;
          const amountB = b.preferences && b.preferences[0] ? 
            parseInt(b.preferences[0].investmentAmount || 0) : 0;
          return sortOrder === "asc" ? amountA - amountB : amountB - amountA;
        });
        break;
      case "location":
        filteredInvestors.sort((a, b) => {
          const locationA = a.preferences?.[0]?.preferredCity || a.preferences?.[0]?.preferredState || "";
          const locationB = b.preferences?.[0]?.preferredCity || b.preferences?.[0]?.preferredState || "";
          return sortOrder === "asc" 
            ? locationA.localeCompare(locationB) 
            : locationB.localeCompare(locationA);
        });
        break;
      case "category":
        filteredInvestors.sort((a, b) => {
          const categoryA = a.preferences?.[0]?.category?.[0]?.main || "";
          const categoryB = b.preferences?.[0]?.category?.[0]?.main || "";
          return sortOrder === "asc" 
            ? categoryA.localeCompare(categoryB) 
            : categoryB.localeCompare(categoryA);
        });
        break;
      default:
        break;
    }

    // 6. Flatten data for Excel
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
            categoryOptions={categoryOptions}
            loading={loading}
            error={error}
          />
      </Box>

      <InvestorTableOutlet
        investors={investors}
        searchTerm={searchTerm}
        handleEdit={handleEdit}
      />
    </div>
  );
};

export default AllInvestor;