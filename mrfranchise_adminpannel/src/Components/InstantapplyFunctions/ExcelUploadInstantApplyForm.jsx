import React, { useState, useCallback } from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  Select,
  LinearProgress,
  Alert,
  Chip,
  TextField,
} from "@mui/material";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { CloudUpload, UploadFile, Download, Refresh } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUploadProgress,
  resetBulkUpload,
} from "../../Redux/Slices/InstantApplyCreationSlice";

const ExcelUploadForm = () => {
  const dispatch = useDispatch();
  const { isUploading, uploadProgress, error } = useSelector(
    (state) => state.applications
  );

  const [excelHeaders, setExcelHeaders] = useState([]);
  const [fieldMapping, setFieldMapping] = useState({});
  const [parsedData, setParsedData] = useState([]);
  const [showMapping, setShowMapping] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [googleSheetUrl, setGoogleSheetUrl] = useState("");

  // ✅ Backend Fields
  const backendFields = [
    { key: "fullName", label: "Full Name" },
    { key: "email", label: "Email" },
    { key: "mobileNumber", label: "Mobile Number" },
    { key: "state", label: "State" },
    { key: "district", label: "District" },
    { key: "city", label: "City" },
    { key: "investmentRange", label: "Investment Range" },
    { key: "planToInvest", label: "Plan to Invest" },
    { key: "readyToInvest", label: "Ready to Invest" },
    { key: "mainCategory", label: "Industry" },
    { key: "subCategory", label: "Category" },
    { key: "childCategory", label: "Specific Business" },
  ];

  // ✅ Reset / Refresh
  const handleRefresh = () => {
    setExcelHeaders([]);
    setFieldMapping({});
    setParsedData([]);
    setShowMapping(false);
    setShowResults(false);
    setGoogleSheetUrl("");
    dispatch(resetBulkUpload());
  };

  // ✅ File Upload Handler (CSV + Excel)
  const handleFileUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileExt = file.name.split(".").pop().toLowerCase();

    if (fileExt === "csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          if (!result.data.length) return alert("⚠️ CSV file is empty.");
          const headers = Object.keys(result.data[0]);
          const initialMapping = Object.fromEntries(headers.map((h) => [h, ""]));
          setExcelHeaders(headers);
          setFieldMapping(initialMapping);
          setParsedData(result.data);
          setShowMapping(true);
          setShowResults(false);
        },
      });
    } else if (fileExt === "xlsx" || fileExt === "xls") {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = new Uint8Array(evt.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
          const headers = Object.keys(rows[0]);
          const initialMapping = Object.fromEntries(headers.map((h) => [h, ""]));
          setExcelHeaders(headers);
          setFieldMapping(initialMapping);
          setParsedData(rows);
          setShowMapping(true);
          setShowResults(false);
        } catch (error) {
          console.error("Excel parsing error:", error);
          alert("❌ Invalid Excel format.");
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("❌ Unsupported file type!");
    }
  }, []);

  // ✅ Google Sheet Import
  const handleGoogleSheetImport = async () => {
    try {
      if (!googleSheetUrl.trim()) return alert("Please enter a valid Google Sheet URL.");

      // Extract Sheet ID
      const match = googleSheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
      if (!match) return alert("Invalid Google Sheet link.");
      const sheetId = match[1];

      const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

      const response = await fetch(csvUrl);
      const csvText = await response.text();

      const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });

      if (!parsed.data.length) return alert("⚠️ Google Sheet is empty.");

      const headers = Object.keys(parsed.data[0]);
      const initialMapping = Object.fromEntries(headers.map((h) => [h, ""]));
      setExcelHeaders(headers);
      setFieldMapping(initialMapping);
      setParsedData(parsed.data);
      setShowMapping(true);
      setShowResults(false);
    } catch (err) {
      console.error("Google Sheet fetch error:", err);
      alert("❌ Unable to load Google Sheet. Make sure it's shared publicly.");
    }
  };

  const handleMappingChange = (header, backendKey) => {
    setFieldMapping((prev) => ({ ...prev, [header]: backendKey }));
  };

  // ✅ Prepare Payload
  const preparePayload = () => {
    return parsedData.map((row) => {
      const mappedRow = {};
      Object.entries(fieldMapping).forEach(([excelHeader, apiKey]) => {
        if (apiKey) mappedRow[apiKey] = row[excelHeader] || "";
      });

      const categories = [
        {
          main: mappedRow.mainCategory || "",
          sub: mappedRow.subCategory || "",
          child: mappedRow.childCategory || "",
        },
      ];

      return {
        fullName: mappedRow.fullName || "",
        email: mappedRow.email || "",
        mobileNumber: mappedRow.mobileNumber || "",
        state: mappedRow.state || "",
        district: mappedRow.district || "",
        city: mappedRow.city || "",
        investmentRange: mappedRow.investmentRange || "",
        planToInvest: mappedRow.planToInvest || "",
        readyToInvest: mappedRow.readyToInvest || "",
        categories,
        isManualEntry: true,
        leadType: "manual",
      };
    });
  };

  const handleBulkSubmit = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return alert("⚠️ No access token found.");

    const preparedData = preparePayload();
    const results = [];
    let successCount = 0;
    let failCount = 0;

    try {
      for (let i = 0; i < preparedData.length; i++) {
        const record = preparedData[i];
        try {
          const res = await fetch(`http://localhost:5000/api/createlead`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(record),
          });
          const responseData = await res.json();

          if (!res.ok || !responseData.success) {
            alert(`❌ Error at row ${i + 1}: ${responseData.message || "Server error"}`);
            failCount++;
            break;
          }

          successCount++;
          dispatch(updateUploadProgress({ current: i + 1, total: parsedData.length }));
        } catch (err) {
          console.error(`Row ${i + 1} error:`, err);
          alert(`❌ API error at row ${i + 1}`);
          break;
        }
      }

      alert(`✅ ${successCount} succeeded, ${failCount} failed.`);
      setShowResults(true);
    } catch (error) {
      console.error("Bulk upload error:", error);
      alert("❌ Bulk upload failed.");
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 1100, mx: "auto" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" color="warning">
          Manual Lead Bulk Upload (Excel / CSV / Google Sheet)
        </Typography>
        <Button
          variant="outlined"
          color="error"
          startIcon={<Refresh />}
          onClick={handleRefresh}
        >
          Refresh
        </Button>
      </Box>

      {/* Upload Buttons */}
      <Box sx={{ mb: 3 }}>
        <input
          type="file"
          accept=".xls,.xlsx,.csv"
          id="excel-upload"
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />
        <label htmlFor="excel-upload">
          <Button variant="contained"  startIcon={<CloudUpload />} component="span" sx={{ mr: 2,backgroundColor: "#ff9900ff" }}>
            Upload Excel/CSV
          </Button>
        </label>
        <Button
          variant="outlined"
          startIcon={<Download />}
          sx={{backgroundColor:'#5dc036ff',color:'white'}}
          onClick={() => window.open("/manual_leads_template.xlsx", "_blank")}
        >
          Sample Excel
        </Button>
      </Box>

      {/* Google Sheet Import */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1">Import from Google Sheet</Typography>
        <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
          <TextField
            label="Google Sheet URL"
            variant="outlined"
            size="small"
            fullWidth
            value={googleSheetUrl}
            onChange={(e) => setGoogleSheetUrl(e.target.value)}
          />
          <Button variant="contained" color="info" onClick={handleGoogleSheetImport}>
            Import
          </Button>
        </Box>
      </Box>

      {/* Mapping Table */}
      {showMapping && (
        <>
          <Typography variant="h6" gutterBottom>
            Map Excel Columns to Backend Fields
          </Typography>
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Excel Header</TableCell>
                  <TableCell>Backend Field</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {excelHeaders.map((header) => (
                  <TableRow key={header}>
                    <TableCell>{header}</TableCell>
                    <TableCell>
                      <Select
                        value={fieldMapping[header] || ""}
                        onChange={(e) => handleMappingChange(header, e.target.value)}
                        displayEmpty
                        size="small"
                        sx={{ minWidth: 250 }}
                      >
                        <MenuItem value="">
                          <em>-- Select Field --</em>
                        </MenuItem>
                        {backendFields.map((f) => (
                          <MenuItem key={f.key} value={f.key}>
                            {f.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Button
            variant="contained"
            color="success"
            startIcon={<UploadFile />}
            onClick={handleBulkSubmit}
            disabled={isUploading}
          >
            Start Upload
          </Button>
        </>
      )}

      {/* Progress */}
      {isUploading && (
        <Box sx={{ mt: 3 }}>
          <LinearProgress
            variant="determinate"
            value={
              uploadProgress.total > 0
                ? (uploadProgress.current / uploadProgress.total) * 100
                : 0
            }
          />
          <Typography variant="body2" sx={{ mt: 1 }}>
            Uploading {uploadProgress.current} of {uploadProgress.total} records...
          </Typography>
        </Box>
      )}

      {/* Errors */}
      {error && (
        <Alert
          severity="error"
          sx={{ mt: 2 }}
          onClose={() => dispatch(resetBulkUpload())}
        >
          {typeof error === "string" ? error : error?.message || "Unexpected error"}
        </Alert>
      )}

      {showResults && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Upload Summary</Typography>
          <Chip color="success" label="Upload Completed" sx={{ mr: 2 }} />
        </Box>
      )}
    </Paper>
  );
};

export default ExcelUploadForm;
