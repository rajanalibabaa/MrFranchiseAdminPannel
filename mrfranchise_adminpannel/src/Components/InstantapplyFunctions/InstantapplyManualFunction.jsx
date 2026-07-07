import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  MenuItem,
  Typography,
  FormHelperText,
  Chip,
  Stack,
  Paper,
  InputBase,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { Close } from "@mui/icons-material";
import axios from "axios";

// ═══════════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════════

// NOTE: `process.env.NEXT_PUBLIC_*` only exists in Next.js apps.
// In a plain CRA/Vite React app `process` is undefined in the browser,
// which throws "process is not defined". Use a safe fallback instead.
//
// - If you're on Create React App, use: process.env.REACT_APP_API_URL
//   (CRA replaces this at build time, so it IS safe there).
// - If you're on Vite, use: import.meta.env.VITE_API_URL
// - Otherwise, just hardcode it below.
const API_BASE_URL =
  (typeof process !== "undefined" && process.env && process.env.REACT_APP_API_URL) ||
  "https://mrfranchisebackend.mrfranchise.in";

const INDUSTRY_ENDPOINT = `${API_BASE_URL}/api/v1/admin/getIndustryByIndustryName`;
const SUBMIT_ENDPOINT = `${API_BASE_URL}/api/v1/instantapply/postApplication`;

// ═══════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════

const INVESTMENT_RANGES = [
  "Below - 50k",
  "Rs. 50k - 2 Lakhs",
  "Rs. 2 Lakhs - 5 Lakhs",
  "Rs. 5 Lakhs - 10 Lakhs",
  "Rs. 10 Lakhs - 20 Lakhs",
  "Rs. 20 Lakhs - 30 Lakhs",
  "Rs. 30 Lakhs - 50 Lakhs",
  "Rs. 50 Lakhs - 1 Crore",
  "Rs. 1 Crores - 2 Crores",
  "Rs. 2 Crores - 5 Crores",
  "Rs. 5 Crores - above",
];

const PLAN_TO_INVEST = [
  "Immediately",
  "1 - 3 months",
  "3 - 6 months",
  "6 + months",
  "More than 1 year",
];

const READY_TO_INVEST = [
  "own Investment",
  "Going for loan",
  "Need loan assistance",
];

const INVESTOR_ENQUIRY_MODELS = [
  "Franchise Business",
  "Dealer & Distributor",
  "Channel Partner",
];

// ═══════════════════════════════════════════════════════════
// Small reusable search box used inside the Industry / Category
// dropdowns (same pattern as FranchiseDetails.jsx)
// ═══════════════════════════════════════════════════════════

const DropdownSearchBox = ({ value, onChange, onClear, placeholder, inputRef }) => (
  <Box
    onKeyDown={(e) => e.stopPropagation()}
    onMouseDown={(e) => e.stopPropagation()}
    onClick={(e) => e.stopPropagation()}
    sx={{
      position: "sticky",
      top: 0,
      zIndex: 10,
      bgcolor: "background.paper",
      px: 1.5,
      py: 1,
      borderBottom: "1px solid #f0f0f0",
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        border: "1.5px solid #ff9800",
        borderRadius: "8px",
        px: 1.2,
        py: 0.6,
        gap: 1,
        backgroundColor: "#fff",
      }}
    >
      <SearchIcon sx={{ color: "#ff9800", fontSize: 20, flexShrink: 0 }} />
      <InputBase
        inputRef={inputRef}
        fullWidth
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.stopPropagation()}
        sx={{ fontSize: "0.9rem", flex: 1, "& input": { padding: 0 } }}
      />
      {value && (
        <Close
          onMouseDown={(e) => {
            e.preventDefault();
            onClear();
          }}
          sx={{
            color: "#aaa",
            fontSize: 18,
            cursor: "pointer",
            flexShrink: 0,
            "&:hover": { color: "#ff9800" },
          }}
        />
      )}
    </Box>
  </Box>
);

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════

const ManualSubmissionForm = ({ selectedBrand, onClose }) => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    state: "",
    district: "",
    city: "",
    investorEnquiryModel: "",
    investmentRange: "",
    planToInvest: "",
    readyToInvest: "",
    categories: [],
    brandName: "",
    isManualEntry: true,
  });

  // ── Industry / Category API data ────────────────────────
  // industriesWithHeadings shape: [{ heading: "FOOD & BEVERAGE", industries: ["Cafe", "Bakery", ...] }, ...]
  const [industriesWithHeadings, setIndustriesWithHeadings] = useState([]);
  const [industryData, setIndustryData] = useState(null); // { categories: [...], ... } for the selected industry
  const [loading, setLoading] = useState(false);
  const [loadingIndustryDetails, setLoadingIndustryDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Category selection state
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  // Search text for the two dropdowns
  const [industrySearch, setIndustrySearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");

  const [validationErrors, setValidationErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // ═══════════════════════════════════════════════════════════
  // API CALLS
  // ═══════════════════════════════════════════════════════════

  // Fetch the full, heading-grouped industry list
  const fetchIndustries = async () => {
    console.log("🔄 Fetching industries...");
    try {
      setLoading(true);
      setApiError("");
      console.log("📡 API URL:", INDUSTRY_ENDPOINT);

      const response = await fetch(INDUSTRY_ENDPOINT);
      const result = await response.json();

      console.log("✅ Industries API Response:", result);

      // The API returns result.data.Industry as an array of
      // { heading, industries: [...] } groups.
      if (result.success && result.data?.Industry) {
        setIndustriesWithHeadings(
          Array.isArray(result.data.Industry) ? result.data.Industry : []
        );
      } else {
        console.warn("⚠️ No industries found in response");
        setIndustriesWithHeadings([]);
      }
    } catch (error) {
      console.error("❌ Error fetching industries:", error);
      setApiError("Failed to load industries");
      setIndustriesWithHeadings([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories (and any other detail) for a single chosen industry
  const fetchIndustryDetails = async (industryName) => {
    if (!industryName) return;

    console.log("🔄 Fetching details for industry:", industryName);

    try {
      setLoadingIndustryDetails(true);
      const url = `${INDUSTRY_ENDPOINT}?industry=${encodeURIComponent(
        industryName
      )}`;
      console.log("📡 Industry Details URL:", url);

      const response = await fetch(url);
      const result = await response.json();

      console.log("✅ Industry Details Response:", result);

      if (result.success && result.data) {
        const apiData = result.data;

        // Normalize categories: the API may send an array of strings,
        // or an array of objects like { category: "Bakery" }.
        let normalizedCategories = [];
        if (Array.isArray(apiData.categories)) {
          normalizedCategories = apiData.categories
            .map((cat) => (typeof cat === "string" ? cat : cat?.category))
            .filter(Boolean);
        } else if (Array.isArray(apiData.category)) {
          normalizedCategories = apiData.category
            .map((cat) => (typeof cat === "string" ? cat : cat?.category))
            .filter(Boolean);
        }

        setIndustryData({
          ...apiData,
          categories: normalizedCategories,
        });
      } else {
        console.warn("⚠️ No data for industry:", industryName);
        setIndustryData({ categories: [] });
      }
    } catch (error) {
      console.error("❌ Error fetching industry details:", error);
      setIndustryData({ categories: [] });
    } finally {
      setLoadingIndustryDetails(false);
    }
  };

  useEffect(() => {
    fetchIndustries();
  }, []);

  // ═══════════════════════════════════════════════════════════
  // HANDLERS
  // ═══════════════════════════════════════════════════════════

  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (validationErrors[name]) {
        setValidationErrors((prev) => ({ ...prev, [name]: "" }));
      }
    },
    [validationErrors]
  );

  const handleIndustryChange = (e) => {
    const industry = e.target.value;
    console.log("🏭 Industry selected:", industry);
    setSelectedIndustry(industry);
    setSelectedCategory("");
    setSelectedSubCategory("");
    setIndustryData(null);
    setCategorySearch("");
    fetchIndustryDetails(industry);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    console.log("📂 Category selected:", category);
    setSelectedCategory(category);
    setSelectedSubCategory("");
  };

  const handleSubCategoryChange = (e) => {
    const subCategory = e.target.value;
    console.log("📁 Sub-category entered:", subCategory);
    setSelectedSubCategory(subCategory);
  };

  const handleAddCategory = () => {
    if (!selectedIndustry || !selectedCategory) {
      alert("Please select Industry and Category first");
      return;
    }

    const categoryObject = {
      main: selectedIndustry,
      sub: selectedCategory,
      child: selectedSubCategory || "",
    };

    const exists = formData.categories.some(
      (cat) =>
        cat.main === categoryObject.main &&
        cat.sub === categoryObject.sub &&
        cat.child === categoryObject.child
    );

    if (exists) {
      alert("This category combination already added");
      return;
    }

    console.log("➕ Adding category:", categoryObject);

    setFormData((prev) => ({
      ...prev,
      categories: [...prev.categories, categoryObject],
    }));

    if (validationErrors.categories) {
      setValidationErrors((prev) => ({ ...prev, categories: "" }));
    }

    // Reset selections
    setSelectedCategory("");
    setSelectedSubCategory("");
  };

  const handleRemoveCategory = (index) => {
    console.log("➖ Removing category at index:", index);
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const errors = {};
    const requiredFields = [
      "fullName",
      "email",
      "mobileNumber",
      "state",
      "investmentRange",
      "planToInvest",
      "readyToInvest",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]?.trim()) {
        errors[field] = "This field is required";
      }
    });

    if (formData.categories.length === 0) {
      errors.categories = "Please add at least one business category";
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (
      formData.mobileNumber &&
      !/^\d{10}$/.test(formData.mobileNumber.replace(/\s/g, ""))
    ) {
      errors.mobileNumber = "Please enter a valid 10-digit mobile number";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("📤 Form submission started");
    console.log("📋 Form Data:", formData);

    if (!validateForm()) {
      console.log("❌ Validation failed:", validationErrors);
      return;
    }

    const AccessToken = localStorage.getItem("accessToken");
    console.log("🔑 Access Token exists:", !!AccessToken);

    const payload = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      mobileNumber: formData.mobileNumber.trim(),
      state: formData.state.trim(),
      district: formData.district?.trim() || "",
      city: formData.city?.trim() || "",
      investmentRange: formData.investmentRange,
      investorEnquiryModel: formData.investorEnquiryModel || "",
      planToInvest: formData.planToInvest,
      readyToInvest: formData.readyToInvest,
      categories: formData.categories,
      brandName:
        selectedBrand?.[0]?.brandDetails?.brandName ||
        formData.brandName ||
        "Manual Entry",
      isManualEntry: !selectedBrand || selectedBrand.length === 0,
      leadType: "manual",
    };

    console.log("📦 Payload:", payload);

    try {
      setIsSubmitting(true);
      setApiError("");

      console.log("📡 Submission URL:", SUBMIT_ENDPOINT);
      console.log("📡 Submission Payload:", payload);

      const response = await axios.post(SUBMIT_ENDPOINT, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AccessToken}`,
        },
        withCredentials: true,
      });

      console.log("✅ Submission Response:", response.data);

      setSuccessMessage("✅ Manual lead submitted successfully!");
      alert("✅ Success! Your manual lead has been submitted.");

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        mobileNumber: "",
        state: "",
        district: "",
        city: "",
        investmentRange: "",
        planToInvest: "",
        readyToInvest: "",
        categories: [],
        brandName: "",
        isManualEntry: true,
        investorEnquiryModel: "",
      });

      setSelectedIndustry("");
      setSelectedCategory("");
      setSelectedSubCategory("");
      setIndustryData(null);
      setValidationErrors({});

      setTimeout(() => {
        onClose && onClose();
      }, 1500);
    } catch (error) {
      console.error("❌ Submission Error:", error);
      console.error("Error Response:", error.response?.data);

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to submit application";

      setApiError(errorMessage);
      alert(`❌ Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ═══════════════════════════════════════════════════════════
  // RENDER HELPERS: build grouped MenuItems (heading + children)
  // ═══════════════════════════════════════════════════════════

  const renderIndustryMenuItems = () => {
    if (loading) {
      return (
        <MenuItem value="" disabled>
          Loading industries...
        </MenuItem>
      );
    }

    if (industriesWithHeadings.length === 0) {
      return (
        <MenuItem value="" disabled>
          No industries available
        </MenuItem>
      );
    }

    const lower = industrySearch.toLowerCase().trim();

    const items = industriesWithHeadings.flatMap((group, groupIndex) => {
      const matched = (group.industries || []).filter((name) =>
        name.toLowerCase().includes(lower)
      );

      // If searching and this whole group has no matches, skip it entirely
      if (lower && matched.length === 0) return [];

      return [
        <MenuItem
          key={`heading-${groupIndex}`}
          disabled
          sx={{
            fontWeight: 700,
            backgroundColor: "#f8f8f8",
            color: "#ff9800 !important",
            fontSize: "0.75rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            justifyContent: "center",
            opacity: "1 !important",
            pointerEvents: "none",
            mt: groupIndex > 0 ? 1 : 0,
          }}
        >
          {group.heading}
        </MenuItem>,
        ...matched.map((industryName, idx) => (
          <MenuItem
            key={`industry-${groupIndex}-${idx}`}
            value={industryName}
            sx={{ pl: 3 }}
          >
            {industryName}
          </MenuItem>
        )),
      ];
    });

    return items.length > 0 ? (
      items
    ) : (
      <MenuItem disabled>
        <Typography variant="body2" color="text.secondary">
          No results found
        </Typography>
      </MenuItem>
    );
  };

  const renderCategoryMenuItems = () => {
    if (loadingIndustryDetails) {
      return (
        <MenuItem value="" disabled>
          Loading categories...
        </MenuItem>
      );
    }

    if (!industryData?.categories?.length) {
      return (
        <MenuItem value="" disabled>
          No categories available
        </MenuItem>
      );
    }

    const lower = categorySearch.toLowerCase().trim();
    const filtered = industryData.categories.filter((cat) =>
      cat.toLowerCase().includes(lower)
    );

    return filtered.length > 0 ? (
      filtered.map((cat, index) => (
        <MenuItem key={`${cat}-${index}`} value={cat}>
          {cat}
        </MenuItem>
      ))
    ) : (
      <MenuItem disabled>
        <Typography variant="body2" color="text.secondary">
          No results found
        </Typography>
      </MenuItem>
    );
  };

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: 2 }}>
      {/* Alerts */}
      {apiError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setApiError("")}>
          {apiError}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage("")}>
          {successMessage}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        {/* Personal Information */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ color: "#f57c00", fontWeight: 600, mb: 2 }}>
            Personal Information
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Full Name *"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                error={!!validationErrors.fullName}
                helperText={validationErrors.fullName}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Email *"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={!!validationErrors.email}
                helperText={validationErrors.email}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Mobile Number *"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                error={!!validationErrors.mobileNumber}
                helperText={validationErrors.mobileNumber}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                label="Investor Enquiry Model"
                name="investorEnquiryModel"
                value={formData.investorEnquiryModel}
                onChange={handleInputChange}
                size="small"
                sx={{ textTransform: "capitalize", minWidth: 190 }}
              >
                <MenuItem value="">
                  <em>Select Investor Enquiry Model</em>
                </MenuItem>

                {INVESTOR_ENQUIRY_MODELS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Paper>

        {/* Business Categories */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ color: "#f57c00", fontWeight: 600, mb: 2 }}>
            Business Categories
          </Typography>

          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <CircularProgress size={24} />
              <Typography sx={{ ml: 2 }}>Loading industries...</Typography>
            </Box>
          )}

          {!loading && industriesWithHeadings.length === 0 && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              No industries available. Please try refreshing the page.
            </Alert>
          )}

          <Grid container spacing={2}>
            {/* Industry (grouped by heading, with search) */}
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                select
                label="Industry *"
                sx={{ textTransform: "capitalize", minWidth: 150 }}
                value={selectedIndustry}
                onChange={handleIndustryChange}
                disabled={loading || industriesWithHeadings.length === 0}
                size="small"
                SelectProps={{
                  MenuProps: {
                    PaperProps: { sx: { maxHeight: 400 } },
                    disableAutoFocusItem: true,
                  },
                  onClose: () => setIndustrySearch(""),
                }}
              >
                <DropdownSearchBox
                  value={industrySearch}
                  onChange={setIndustrySearch}
                  onClear={() => setIndustrySearch("")}
                  placeholder="Search industries…"
                />
                {renderIndustryMenuItems()}
              </TextField>
            </Grid>

            {/* Category (from the selected industry's data, with search) */}
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                select
                label="Category *"
                value={selectedCategory}
                sx={{ textTransform: "capitalize", minWidth: 150 }}
                onChange={handleCategoryChange}
                disabled={!selectedIndustry || loadingIndustryDetails}
                size="small"
                SelectProps={{
                  MenuProps: {
                    PaperProps: { sx: { maxHeight: 400 } },
                    disableAutoFocusItem: true,
                  },
                  onClose: () => setCategorySearch(""),
                }}
              >
                <DropdownSearchBox
                  value={categorySearch}
                  onChange={setCategorySearch}
                  onClear={() => setCategorySearch("")}
                  placeholder="Search categories…"
                />
                {renderCategoryMenuItems()}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={3}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleAddCategory}
                disabled={!selectedIndustry || !selectedCategory}
                sx={{ height: "100%" }}
              >
                Add Category
              </Button>
            </Grid>
          </Grid>

          {/* Selected Categories */}
          {formData.categories.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block", fontWeight: 600 }}>
                Selected Categories ({formData.categories.length}):
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {formData.categories.map((cat, index) => (
                  <Chip
                    key={index}
                    label={`${cat.main} > ${cat.sub}${cat.child ? ` > ${cat.child}` : ""}`}
                    onDelete={() => handleRemoveCategory(index)}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Stack>
            </Box>
          )}

          {validationErrors.categories && (
            <FormHelperText error sx={{ mt: 1 }}>
              {validationErrors.categories}
            </FormHelperText>
          )}
        </Paper>

        {/* Location Information */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ color: "#f57c00", fontWeight: 600, mb: 2 }}>
            Location Information
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="State *"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                error={!!validationErrors.state}
                helperText={validationErrors.state}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="District" name="district" value={formData.district} onChange={handleInputChange} size="small" />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="City" name="city" value={formData.city} onChange={handleInputChange} size="small" />
            </Grid>
          </Grid>
        </Paper>

        {/* Investment Plans */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ color: "#f57c00", fontWeight: 600, mb: 2 }}>
            Investment Plans
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                label="Investment Range *"
                name="investmentRange"
                sx={{ textTransform: "capitalize", minWidth: 190 }}
                value={formData.investmentRange}
                onChange={handleInputChange}
                error={!!validationErrors.investmentRange}
                helperText={validationErrors.investmentRange}
                size="small"
              >
                {INVESTMENT_RANGES.map((range) => (
                  <MenuItem key={range} value={range}>
                    {range}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                label="Plan to Invest *"
                name="planToInvest"
                value={formData.planToInvest}
                onChange={handleInputChange}
                sx={{ textTransform: "capitalize", minWidth: 190 }}
                error={!!validationErrors.planToInvest}
                helperText={validationErrors.planToInvest}
                size="small"
              >
                {PLAN_TO_INVEST.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                label="Ready to Invest *"
                name="readyToInvest"
                value={formData.readyToInvest}
                onChange={handleInputChange}
                sx={{ textTransform: "capitalize", minWidth: 190 }}
                error={!!validationErrors.readyToInvest}
                helperText={validationErrors.readyToInvest}
                size="small"
              >
                {READY_TO_INVEST.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Paper>

        {/* Submit Actions */}
        <Paper sx={{ p: 2, display: "flex", justifyContent: "flex-end", gap: 2 }}>
          {onClose && (
            <Button variant="outlined" onClick={onClose} disabled={isSubmitting} startIcon={<CloseIcon />}>
              Cancel
            </Button>
          )}
          <Button type="submit" variant="contained" disabled={isSubmitting} startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}>
            {isSubmitting ? "Submitting..." : "Submit Manual Lead"}
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};

export default ManualSubmissionForm;
