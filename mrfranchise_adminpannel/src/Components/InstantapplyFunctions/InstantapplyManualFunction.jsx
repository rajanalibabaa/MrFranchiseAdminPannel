// components/ManualSubmissionForm.jsx
import React, { useState, useCallback } from "react";
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
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Chip,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import {
  submitApplication,
  resetSubmitState,
} from "../../Redux/Slices/InstantApplyCreationSlice";
import { categories } from "../../Components/Brands/BrandLIstingRegister/BrandCategories";

const ManualSubmissionForm = ({ selectedBrand, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSubmitting, submitSuccess, error } = useSelector(
    (state) => state.applications
  );

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
    categories: [], // This should be an array
    brandName: "",
    isManualEntry: true,
  });

  // Category related states - for UI interaction only
  const [currentCategory, setCurrentCategory] = useState({
    main: "",
    sub: "",
    child: "",
  });

  const [validationErrors, setValidationErrors] = useState({});

  const investmentRanges = [
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

  const planToInvestOptions = [
    "Immediately",
    "1 - 3 months",
    "3 - 6 months",
    "6 + months",
    "More than 1 year",
  ];

  const readyToInvestOptions = [
    "own Investment",
    "Going for loan",
    "Need loan assistance",
  ];

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

  // Handle category selection and automatically add to categories array
  const handleCategoryChange = (level, value) => {
    let newCurrentCategory = { ...currentCategory };
    
    if (level === 'main') {
      newCurrentCategory = { main: value, sub: "", child: "" };
    } else if (level === 'sub') {
      newCurrentCategory = { ...currentCategory, sub: value, child: "" };
    } else if (level === 'child') {
      newCurrentCategory = { ...currentCategory, child: value };
    }

    setCurrentCategory(newCurrentCategory);

    // If we have at least main and sub category, add to categories array
    if (newCurrentCategory.main && newCurrentCategory.sub) {
      const categoryObject = {
        main: newCurrentCategory.main,
        sub: newCurrentCategory.sub,
        child: newCurrentCategory.child || ""
      };

      // Check if this combination already exists
      const exists = formData.categories.some(cat => 
        cat.main === categoryObject.main && 
        cat.sub === categoryObject.sub && 
        cat.child === categoryObject.child
      );

      if (!exists) {
        setFormData(prev => ({
          ...prev,
          categories: [categoryObject] // For now, just replace with one category
        }));

        // Clear validation error
        if (validationErrors.categories) {
          setValidationErrors(prev => ({ ...prev, categories: "" }));
        }
      }
    }
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

    // Category validation - check if categories array has at least one item
    if (!Array.isArray(formData.categories) || formData.categories.length === 0) {
      errors.categories = "Please select at least one business category";
    }

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Mobile number validation
    if (formData.mobileNumber && !/^\d{10}$/.test(formData.mobileNumber.replace(/\s/g, ""))) {
      errors.mobileNumber = "Please enter a valid 10-digit mobile number";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      console.log("Form submission started");
      console.log("Form data:", formData);
      console.log("Categories array:", formData.categories);

      if (!validateForm()) {
        console.log("Form validation failed", validationErrors);
        return;
      }

      // Get user credentials
      const investorUUID = localStorage.getItem("investorUUID");
      const brandUUID = localStorage.getItem("brandUUID");
      const accessToken = localStorage.getItem("accessToken");

      console.log("User credentials:", {
        investorUUID,
        brandUUID,
        accessToken: !!accessToken,
      });

      const id = investorUUID || brandUUID;
      if (!id) {
        console.log("No user ID found");
        alert("User not logged in or missing ID. Please login again.");
        navigate("/registerhandleuser");
        return;
      }

      // Prepare payload for manual submission
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
        categories: formData.categories, // This is now properly an array
        brandName: selectedBrand?.[0]?.brandDetails?.brandName || formData.brandName || "Manual Entry",
        isManualEntry: !selectedBrand || selectedBrand.length === 0,
        leadType: "manual",
      };

      console.log("Payload to be submitted:", payload);
      console.log("Categories in payload:", payload.categories);

      try {
        const result = await dispatch(submitApplication(payload)).unwrap();
        console.log("Submission successful:", result);

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

        setCurrentCategory({ main: "", sub: "", child: "" });
        setValidationErrors({});

        onClose && onClose();
      } catch (error) {
        console.error("Submission error:", error);
        const errorMessage = error?.message || error?.data?.message || "Unknown error occurred";
        alert(`❌ Failed to submit application: ${errorMessage}`);
      }
    },
    [formData, selectedBrand, dispatch, navigate, onClose, validationErrors]
  );

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 1, sm: 2, md: 3 } }}>
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          onClose={() => dispatch(resetSubmitState())}
        >
          {typeof error === "object"
            ? error.message || JSON.stringify(error)
            : error}
        </Alert>
      )}

      {submitSuccess && (
        <Alert
          severity="success"
          sx={{ mb: 3 }}
          onClose={() => dispatch(resetSubmitState())}
        >
          Manual lead submitted successfully!
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Personal Information Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="warning" sx={{ mb: 2 }}>
              Personal Information
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  error={!!validationErrors.fullName}
                  helperText={validationErrors.fullName}
                  required
                  size="medium"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={!!validationErrors.email}
                  helperText={validationErrors.email}
                  required
                  size="medium"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Mobile Number"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  error={!!validationErrors.mobileNumber}
                  helperText={validationErrors.mobileNumber}
                  required
                  size="medium"
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Business Categories Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="warning.main" sx={{ mb: 2 }}>
              Business Categories *
            </Typography>

            <Grid container spacing={2}>
              {/* Main Category */}
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth error={!!validationErrors.categories} size="medium" >
                  <InputLabel>Industry *</InputLabel>
                  <Select
                    value={currentCategory.main}
                    onChange={(e) => handleCategoryChange('main', e.target.value)}
                    label="Industry *"
                    sx={{width:'40vh'}}
                    
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat.name} value={cat.name}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Sub Category */}
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth disabled={!currentCategory.main} size="medium">
                  <InputLabel>Category *</InputLabel>
                  <Select
                    value={currentCategory.sub}
                    onChange={(e) => handleCategoryChange('sub', e.target.value)}
                    label="Category *"
                     sx={{width:'40vh'}}
                  >
                    {currentCategory.main
                      ? categories
                          .find((cat) => cat.name === currentCategory.main)
                          ?.children?.map((sub) => (
                            <MenuItem key={sub.name} value={sub.name}>
                              {sub.name}
                            </MenuItem>
                          )) || []
                      : []}
                  </Select>
                </FormControl>
              </Grid>

              {/* Child Category */}
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth disabled={!currentCategory.sub} size="medium">
                  <InputLabel>Specific Tags</InputLabel>
                  <Select
                    value={currentCategory.child}
                    onChange={(e) => handleCategoryChange('child', e.target.value)}
                    label="Specific Tags"
                     sx={{width:'40vh'}}
                  >
                    {currentCategory.sub
                      ? categories
                          .find((cat) => cat.name === currentCategory.main)
                          ?.children?.find((sub) => sub.name === currentCategory.sub)
                          ?.children?.map((child) => (
                            <MenuItem key={child} value={child}>
                              {child}
                            </MenuItem>
                          )) || []
                      : []}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Display selected categories */}
            {formData.categories.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Selected Categories:
                </Typography>
                {formData.categories.map((cat, index) => (
                  <Chip
                    key={index}
                    label={`${cat.main} > ${cat.sub}${cat.child ? ` > ${cat.child}` : ''}`}
                    color="primary"
                    sx={{ mr: 1, mb: 1 }}
                    onDelete={() => {
                      setFormData(prev => ({
                        ...prev,
                        categories: prev.categories.filter((_, i) => i !== index)
                      }));
                    }}
                  />
                ))}
              </Box>
            )}

            {validationErrors.categories && (
              <FormHelperText error sx={{ mt: 1 }}>
                {validationErrors.categories}
              </FormHelperText>
            )}
          </Grid>

          {/* Location Information Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="warning" sx={{ mb: 2 }}>
              Location Information
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  error={!!validationErrors.state}
                  helperText={validationErrors.state}
                  required
                  size="medium"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="District"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  size="medium"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  size="medium"
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Investment Plans Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="warning" sx={{ mb: 2 }}>
              Investment Plans
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Investment Range"
                  name="investmentRange"
                  select
                  value={formData.investmentRange}
                  onChange={handleInputChange}
                  error={!!validationErrors.investmentRange}
                  helperText={validationErrors.investmentRange}
                  required
                  size="medium"
                   sx={{width:'40vh'}}
                >
                  {investmentRanges.map((range) => (
                    <MenuItem key={range} value={range}>
                      {range}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Plan to Invest"
                  name="planToInvest"
                  select
                  value={formData.planToInvest}
                  onChange={handleInputChange}
                  error={!!validationErrors.planToInvest}
                  helperText={validationErrors.planToInvest}
                  required
                  size="medium"
                   sx={{width:'40vh'}}
                >
                  {planToInvestOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Ready to Invest"
                  name="readyToInvest"
                  select
                  value={formData.readyToInvest}
                  onChange={handleInputChange}
                  error={!!validationErrors.readyToInvest}
                  helperText={validationErrors.readyToInvest}
                  required
                  size="medium"
                   sx={{width:'40vh'}}
                >
                  {readyToInvestOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Grid>

          {/* Submit Button Section */}
          <Grid item xs={12}>
            <Divider sx={{ my: 3 }} />
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Button
                type="submit"
                variant="contained"
                color="warning"
                size="large"
                disabled={isSubmitting}
                sx={{
                  minWidth: { xs: "100%", sm: "200px" },
                  py: 1.5,
                  fontSize: "1.1rem",
                }}
              >
                {isSubmitting ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Submitting Lead...
                  </>
                ) : (
                  "Submit Manual Lead"
                )}
              </Button>

              {onClose && (
                <Button
                  variant="outlined"
                  color="error"
                  size="large"
                  onClick={onClose}
                  disabled={isSubmitting}
                  sx={{
                    minWidth: { xs: "100%", sm: "150px" },
                    py: 1.5,
                    fontSize: "1.1rem",
                  }}
                >
                  Cancel
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ManualSubmissionForm;
