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
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

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
    investmentRange: "",
    planToInvest: "",
    readyToInvest: "",
    categories: [],
    brandName: "",
    isManualEntry: true,
  });

  // API data state
  const [industries, setIndustries] = useState([]);
  const [industryData, setIndustryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingIndustryDetails, setLoadingIndustryDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Category selection state
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  const [validationErrors, setValidationErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // ═══════════════════════════════════════════════════════════
  // API CALLS
  // ═══════════════════════════════════════════════════════════

  const fetchIndustries = async () => {
    console.log("🔄 Fetching industries...");
    try {
      setLoading(true);
      const url = `http://localhost:5000/api/v1/admin/getIndustryByIndustryName`;
      console.log("📡 API URL:", url);

      const response = await fetch(url);
      const result = await response.json();

      console.log("✅ Industries API Response:", result);

      if (result.success && result.data) {
        // Handle different possible response structures
        const industriesArray = result.data.Industry || result.data.industries || result.data || [];
        console.log("📦 Industries Array:", industriesArray);
        setIndustries(Array.isArray(industriesArray) ? industriesArray : []);
      } else {
        console.warn("⚠️ No industries found in response");
        setIndustries([]);
      }
    } catch (error) {
      console.error("❌ Error fetching industries:", error);
      setApiError("Failed to load industries");
      setIndustries([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchIndustryDetails = async (industryName) => {
    if (!industryName) return;

    console.log("🔄 Fetching details for industry:", industryName);

    try {
      setLoadingIndustryDetails(true);
      const url = `http://localhost:5000/api/v1/admin/getIndustryByIndustryName?industry=${encodeURIComponent(
        industryName
      )}`;
      console.log("📡 Industry Details URL:", url);

      const response = await fetch(url);
      const result = await response.json();

      console.log("✅ Industry Details Response:", result);

      if (result.success && result.data) {
        const apiData = result.data;

        // Extract categories from various possible keys
        const categories =
          apiData.categories ||
          apiData.category ||
          apiData.subCategories ||
          apiData.subIndustry ||
          apiData.children ||
          [];

        console.log("📦 Categories found:", categories);

        setIndustryData({
          ...apiData,
          categories: Array.isArray(categories) ? categories : [],
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

      const url = `http://localhost:5000/api/v1/instantapply/postApplication`;
      console.log("📡 Submission URL:", url);
      console.log("📡 Submission Payload:", payload);

      const response = await axios.post(url, payload, {
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
      });

      setSelectedIndustry("");
      setSelectedCategory("");
      setSelectedSubCategory("");
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
  // RENDER
  // ═══════════════════════════════════════════════════════════

  console.log("🎨 Render - Industries:", industries);
  console.log("🎨 Render - Industry Data:", industryData);
  console.log("🎨 Render - Selected Industry:", selectedIndustry);

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

          {!loading && industries.length === 0 && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              No industries available. Please try refreshing the page.
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                select
                label="Industry *"
                sx={{ textTransform: "capitalize" ,minWidth: 150}}
                value={selectedIndustry}
                onChange={handleIndustryChange}
                disabled={loading || industries.length === 0}
                size="small"
              >
                {industries.map((ind, index) => (
                  <MenuItem key={index} value={ind}>
                    {ind}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                select
                label="Category *"
                value={selectedCategory}
                                sx={{ textTransform: "capitalize" ,minWidth: 150}}

                onChange={handleCategoryChange}
                disabled={!selectedIndustry || loadingIndustryDetails}
                size="small"
              >
                {loadingIndustryDetails ? (
                  <MenuItem disabled>Loading...</MenuItem>
                ) : (
                  industryData?.categories?.map((cat, index) => (
                    <MenuItem key={index} value={cat}>
                      {cat}
                    </MenuItem>
                  ))
                )}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Sub-Category (Optional)"
                value={selectedSubCategory}
                onChange={handleSubCategoryChange}
                disabled={!selectedCategory}
                size="small"
              />
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
                                sx={{ textTransform: "capitalize" ,minWidth: 190}}

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
                                sx={{ textTransform: "capitalize" ,minWidth: 190}}

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
                                sx={{ textTransform: "capitalize" ,minWidth: 190}}

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