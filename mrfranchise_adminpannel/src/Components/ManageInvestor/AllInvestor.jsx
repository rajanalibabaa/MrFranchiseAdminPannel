import React, { useState, useEffect } from "react";
import InvestorTableOutlet from "../../ui/InvestorTableOutlet";
import { GetApiCall } from "../../api/default/GetApi";
import { Api } from "../../api/apiurl";
import { categories as brandCategories } from "../Brands/BrandLIstingRegister/BrandCategories";
import { 
  Typography, 
  Button, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  TextField,
} from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const AllInvestor = () => {
  const [investors, setInvestors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  // Date filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Filter options
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedInvestmentRange, setSelectedInvestmentRange] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const handleView = (uuid) => {
    console.log("View Investor:", uuid);
  };

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

  const handleDownloadClick = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    // Reset filters when dialog closes
    setSelectedCategory("");
    setSelectedInvestmentRange("");
    setSelectedLocation("");
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

    setOpenDialog(false);
  };

  // Extract unique values for filter dropdowns
  const getUniqueValues = (data, key) => {
    const values = new Set();
    data.forEach(inv => {
      if (inv.preferences?.[0]?.[key]) {
        if (Array.isArray(inv.preferences[0][key])) {
          inv.preferences[0][key].forEach(item => {
            if (item && typeof item === 'object') {
              Object.values(item).forEach(val => {
                if (val) values.add(val);
              });
            } else if (item) {
              values.add(item);
            }
          });
        } else {
          values.add(inv.preferences[0][key]);
        }
      }
    });
    return Array.from(values).sort();
  };

const categoryOptions = brandCategories.flatMap(cat =>
  cat.children.flatMap(child => child.children) 
);
const investmentRanges = [
  "Below - 50,000",
  "Rs. 50,000 - 2 L",
  "Rs. 2 L - 5 L",
  "Rs. 5 L - 10 L",
  "Rs. 10 L - 20 L",
  "Rs. 20 L - 30 L",
  "Rs. 30 L - 50 L",
  "Rs. 50 L - 1 Cr",
  "Rs. 1 Cr - 2 Crs",
  "Rs. 2 Crs - 5 Crs",
  "Rs. 5Crs - above",
];
  const locations = [
    ...getUniqueValues(investors, 'preferredCity'),
    ...getUniqueValues(investors, 'preferredState')
  ].filter((value, index, self) => self.indexOf(value) === index).sort();

  return (
    <div>
      <div style={{ marginBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography sx={{ textAlign: "center", fontSize: "30px", fontWeight: "bold" }}>
          ALL INVESTORS
        </Typography>

        <Button variant="contained" color="success" onClick={handleDownloadClick}>
          Download Excel
        </Button>
      </div>

      {/* Dialog with download options */}
      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            Download Investor Data
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
            <Box>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
                Filter Options
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
               <FormControl fullWidth>
  <InputLabel>Category</InputLabel>
  <Select
    value={selectedCategory}
    label="Category"
    onChange={(e) => setSelectedCategory(e.target.value)}
  >
    <MenuItem value="">All Categories</MenuItem>
    {categoryOptions.map((subCategory, index) => (
      <MenuItem key={index} value={subCategory}>{subCategory}</MenuItem>
    ))}
  </Select>
</FormControl>                
               <FormControl fullWidth>
  <InputLabel>Investment Range</InputLabel>
  <Select
    value={selectedInvestmentRange}
    label="Investment Range"
    onChange={(e) => setSelectedInvestmentRange(e.target.value)}
  >
    <MenuItem value="">All Ranges</MenuItem>
    {investmentRanges.map((range, index) => (
      <MenuItem key={index} value={range}>
        {range}
      </MenuItem>
    ))}
  </Select>
</FormControl>

                
                <FormControl fullWidth>
                  <InputLabel>Location</InputLabel>
                  <Select
                    value={selectedLocation}
                    label="Location"
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  >
                    <MenuItem value="">All Locations</MenuItem>
                    {locations.map((location, index) => (
                      <MenuItem key={index} value={location}>{location}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

           
            <Box>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
                Date Range Filter
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <TextField
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleDialogClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button 
            onClick={handleDownloadExcel} 
            variant="contained" 
            color="success"
            startIcon={<DownloadIcon />}
          >
            Download Excel
          </Button>
        </DialogActions>
      </Dialog>

      <InvestorTableOutlet
        investors={investors}
        handleView={handleView}
        searchTerm={searchTerm}
      />
    </div>
  );
};

export default AllInvestor;