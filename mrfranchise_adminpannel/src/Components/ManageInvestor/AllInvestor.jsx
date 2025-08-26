import React, { useState, useEffect } from "react";
import InvestorTableOutlet from "../../ui/InvestorTableOutlet";
import { GetApiCall } from "../../api/default/GetApi";
import { Api } from "../../api/apiurl";
import { Typography, Button } from "@mui/material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const AllInvestor = () => {
  const [investors, setInvestors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleView = (uuid) => {
    console.log("View Investor:", uuid);
  };

  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        const response = await GetApiCall(Api.admin.investor.getAllInvestors);
        console.log("Investors API Response:", response);

        setInvestors(response.data || []);
        console.log("Fetched investors:", response.data || []);
      } catch (error) {
        console.error("Error fetching Investors:", error);
      }
    };

    fetchInvestors();
  }, []);

 const handleDownloadExcel = () => {
  if (investors.length === 0) {
    alert("No data to export!");
    return;
  }

 const flattenedData = investors.map(inv => {
  // Get first preference if available
  const firstPref = inv.preferences && inv.preferences.length > 0 ? inv.preferences[0] : {};
  const firstCategory = firstPref.category && firstPref.category.length > 0 ? firstPref.category[0] : {};

  // Get first propertyPreferred if available (inside preferences!)
  const firstProperty = firstPref.propertyPreferred && firstPref.propertyPreferred.length > 0 ? firstPref.propertyPreferred[0] : {};

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

    // Preferences
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

    // Property Preferred
    "Property Type": firstProperty.propertyType || "",
    "Property Size": firstProperty.propertySize || "",
    "Property City": firstProperty.propertyCity || "",
    "Property State": firstProperty.propertyState || "",
    "Property Country": firstProperty.propertyCountry || "",

    // Meta
    "Created At": inv.createdAt ? new Date(inv.createdAt).toLocaleString() : "",
    "Updated At": inv.updatedAt ? new Date(inv.updatedAt).toLocaleString() : "",
    UUID: inv.uuid || "",
  };
});


  // Convert to worksheet
  const worksheet = XLSX.utils.json_to_sheet(flattenedData);

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Investors");

  // Save
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(data, "AllInvestors.xlsx");
};
  return (
    <div>
      <div style={{ marginBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography sx={{ textAlign: "center", fontSize: "30px", fontWeight: "bold" }}>
          ALL INVESTORS
        </Typography>

       
        <Button variant="contained" color="success" onClick={handleDownloadExcel}>
          Download Excel
        </Button>
      </div>

      <InvestorTableOutlet
        investors={investors}
        handleView={handleView}
        searchTerm={searchTerm}
      />
    </div>
  );
};

export default AllInvestor;