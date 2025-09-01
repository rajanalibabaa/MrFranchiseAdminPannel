import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  CircularProgress,
  Button,
  TextField,
  Snackbar,
  IconButton,
  MenuItem,
  Dialog ,
  DialogTitle ,
  DialogContent ,
  DialogActions ,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import MuiAlert from "@mui/material/Alert";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { categories } from "../Brands/BrandLIstingRegister/BrandCategories";
import { TbPhotoEdit } from "react-icons/tb";

const EditInvestor = () => {
  
  // State management
  const [originalData, setOriginalData] = useState(null);
  const [investorData, setInvestorData] = useState({
    firstName: "",
    email: "",
    mobileNumber: "",
    whatsappNumber: "",
    country: "",
    occupation: "",
    state: "",
    city: "",
    address: "",
    pincode: "",
    preferences: [],
    profileImage: "",
    investorID: ""
  });
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [indiaData, setIndiaData] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({
    firstName: "",
    mobileNumber: "",
    whatsappNumber: "",
    state: "",
    city: "",
    address: "",
    pincode: "",
    occupation: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [imagesizeError, setImagesizeError] = useState("");
  const [isImageRemoved, setIsImageRemoved] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Location suggestion states
  const [stateSuggestions, setStateSuggestions] = useState([]);
  const [districtSuggestions, setDistrictSuggestions] = useState([]);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  // Navigation and Params
  const navigate = useNavigate();
const { id } = useParams();
  const location = useLocation();
  const investorFromState = location.state?.investor;

  // Helper functions
  const formatNumber = useCallback((num) => {
    if (!num) return "";
    return num.replace(/^(\+91)?/, "").trim();
  }, []);

  // Filter suggestions helper
  const filterSuggestions = useCallback((input, data) => {
    if (!input || !data) return [];
    return data.filter(item => 
      item.toLowerCase().includes(input.toLowerCase())
    ).slice(0, 5);
  }, []);

  // Handle avatar file change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSize = 50 * 1024; // 50KB in bytes

      if (file.size > maxSize) {
        setImagesizeError("Oops! Upload failed — please use an image under 50KB.");
        return;
      }
      
      if (!file.type.match('image.*')) {
        setImagesizeError("Please upload an image file (JPEG, PNG, etc.)");
        return;
      }
      
      setImagesizeError('');
      setAvatarFile(file);
      setIsImageRemoved(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview("");
    setImagesizeError("");
    setIsImageRemoved(true);
  };

  // Location data handling
  const getDistrictsForState = useCallback((stateName) => {
    if (!stateName) return [];
    const stateObj = indiaData.find((s) => s.name === stateName);
    return stateObj?.districts || [];
  }, [indiaData]);

  const getCitiesForDistrict = useCallback((stateName, districtName) => {
    if (!stateName || !districtName) return [];
    const stateObj = indiaData.find((s) => s.name === stateName);
    if (!stateObj) return [];
    return (stateObj.cities || [])
      .filter((city) => city.district === districtName)
      .map((city) => city.name);
  }, [indiaData]);

  // Data fetching
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await axios.get(
          "https://raw.githubusercontent.com/prasad-gowda/india-state-district-cities/master/India-state-district-city.json"
        );
        setIndiaData(res.data);
      } catch (err) {
        setIndiaData([]);
        setSnackbar({
          open: true,
          message: "Failed to load location data. Some features may not work properly.",
          severity: "warning",
        });
      }
    };

    fetchStates();
  }, []);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      let investorDataToUse = investorFromState;

      // If investor data wasn't passed via state, fetch it from API
      if (!investorDataToUse && id) {
        const response = await axios.get(
          `http://localhost:5000/api/v1/investor/getInvestorByUUID/${id}`,
          { 
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );
        if (response.data?.data) {
          investorDataToUse = response.data.data;
          console.log('Fetched investor data:', investorDataToUse);
          console.log('UUID from response:', investorDataToUse.uuid);
        }
      }

      if (investorDataToUse) {
        const formattedData = {
          ...investorDataToUse,
          mobileNumber: formatNumber(investorDataToUse.mobileNumber),
          whatsappNumber: formatNumber(investorDataToUse.whatsappNumber),
          occupation: investorDataToUse.occupation || "",
          preferences: investorDataToUse.preferences?.map((pref) => ({
            ...pref,
            _id: pref._id || `pref-${Date.now()}`,
            category: Array.isArray(pref.category) ? pref.category : [{ main: "", sub: "", child: "" }],
            locationType: pref.locationType === "international" ? "International" : "Domestic",
            propertyPreferred: Array.isArray(pref.propertyPreferred) ? pref.propertyPreferred : [{
              propertyType: "",
              propertySize: "",
              propertyCountry: "",
              propertyState: "",
              propertyCity: ""
            }]
          })) || [{
            investmentRange: "",
            investmentAmount: "",
            locationType: "Domestic",
            preferredCountry: "",
            preferredState: "",
            preferredDistrict: "",
            preferredCity: "",
            category: [{ main: "", sub: "", child: "" }],
            propertyPreferred: [{
              propertyType: "",
              propertySize: "",
              propertyCountry: "",
              propertyState: "",
              propertyCity: ""
            }],
            _id: `pref-${Date.now()}`
          }],
          investorID: investorDataToUse.inveterID || "",
          uuid: investorDataToUse.uuid || id 
        };
        setInvestorData(formattedData);
        setOriginalData(formattedData);
        setAvatarPreview(investorDataToUse.profileImage || "");
      } else {
        throw new Error("No investor data available");
      }
    } catch (error) {
      console.error("Error fetching investor data:", error);
      setSnackbar({
        open: true,
        message: "Failed to load investor data. Please try again later.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [id, investorFromState, formatNumber]);
  // Validate all fields
  const validateFields = useCallback(() => {
    const errors = {
      firstName: "",
      mobileNumber: "",
      whatsappNumber: "",
      state: "",
      city: "",
      address: "",
      pincode: "",
      occupation: "",
    };
    let isValid = true;

    // Validate firstName
    if (!investorData.firstName?.trim()) {
      errors.firstName = "First name is required";
      isValid = false;
    } else if (investorData.firstName.trim().length < 2) {
      errors.firstName = "First name must be at least 2 characters";
      isValid = false;
    }

    // Validate mobileNumber
    const mobileNumber = formatNumber(investorData.mobileNumber);
    if (!mobileNumber) {
      errors.mobileNumber = "Mobile number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(mobileNumber)) {
      errors.mobileNumber = "Mobile number must be 10 digits";
      isValid = false;
    }

    // Validate whatsappNumber
    const whatsappNumber = formatNumber(investorData.whatsappNumber);
    if (!whatsappNumber) {
      errors.whatsappNumber = "WhatsApp number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(whatsappNumber)) {
      errors.whatsappNumber = "WhatsApp number must be 10 digits";
      isValid = false;
    }

    // Validate state
    if (!investorData.state?.trim()) {
      errors.state = "State is required";
      isValid = false;
    }

    // Validate city
    if (!investorData.city?.trim()) {
      errors.city = "City is required";
      isValid = false;
    }

    // Validate address
    if (!investorData.address?.trim()) {
      errors.address = "Address is required";
      isValid = false;
    }

    // Validate pincode
    if (!investorData.pincode) {
      errors.pincode = "Pincode is required";
      isValid = false;
    } else if (!/^\d{6}$/.test(investorData.pincode)) {
      errors.pincode = "Pincode must be 6 digits";
      isValid = false;
    }

    // Validate occupation
    if (!investorData.occupation) {
      errors.occupation = "Occupation is required";
      isValid = false;
    }

    // Validate preferences
    if (!investorData.preferences || investorData.preferences.length === 0) {
      setSnackbar({
        open: true,
        message: "At least one preference is required",
        severity: "error",
      });
      isValid = false;
    } else {
      for (const pref of investorData.preferences) {
        if (!pref.investmentRange) {
          setSnackbar({
            open: true,
            message: "Investment range is required for all preferences",
            severity: "error",
          });
          isValid = false;
          break;
        }
        
        if (!pref.investmentAmount) {
          setSnackbar({
            open: true,
            message: "Investment amount is required for all preferences",
            severity: "error",
          });
          isValid = false;
          break;
        }
        
        if (!pref.locationType) {
          setSnackbar({
            open: true,
            message: "Location type is required for all preferences",
            severity: "error",
          });
          isValid = false;
          break;
        }
        
        if (pref.locationType === "Domestic") {
          if (!pref.preferredState) {
            setSnackbar({
              open: true,
              message: "Preferred state is required for domestic preferences",
              severity: "error",
            });
            isValid = false;
            break;
          }
          
          if (!pref.preferredDistrict) {
            setSnackbar({
              open: true,
              message: "Preferred district is required for domestic preferences",
              severity: "error",
            });
            isValid = false;
            break;
          }
          
          if (!pref.preferredCity) {
            setSnackbar({
              open: true,
              message: "Preferred city is required for domestic preferences",
              severity: "error",
            });
            isValid = false;
            break;
          }
        } else if (pref.locationType === "International") {
          if (!pref.preferredCountry) {
            setSnackbar({
              open: true,
              message: "Preferred country is required for international preferences",
              severity: "error",
            });
            isValid = false;
            break;
          }
          
          if (!pref.preferredState) {
            setSnackbar({
              open: true,
              message: "Preferred state/province is required for international preferences",
              severity: "error",
            });
            isValid = false;
            break;
          }
          
          if (!pref.preferredCity) {
            setSnackbar({
              open: true,
              message: "Preferred city is required for international preferences",
              severity: "error",
            });
            isValid = false;
            break;
          }
        }
        
        if (!pref.category || pref.category.length === 0) {
          setSnackbar({
            open: true,
            message: "At least one category is required for each preference",
            severity: "error",
          });
          isValid = false;
          break;
        }
        
        for (const cat of pref.category) {
          if (!cat.main) {
            setSnackbar({
              open: true,
              message: "Main category is required for all categories",
              severity: "error",
            });
            isValid = false;
            break;
          }
        }

        // Validate property preferences
        if (!pref.propertyPreferred || pref.propertyPreferred.length === 0) {
          setSnackbar({
            open: true,
            message: "At least one property preference is required",
            severity: "error",
          });
          isValid = false;
          break;
        }

        for (const prop of pref.propertyPreferred) {
          if (!prop.propertyType) {
            setSnackbar({
              open: true,
              message: "Property type is required for all property preferences",
              severity: "error",
            });
            isValid = false;
            break;
          }
          
          if (prop.propertyType === "Own Property" && !prop.propertySize) {
            setSnackbar({
              open: true,
              message: "Property size is required when property type is Own Property",
              severity: "error",
            });
            isValid = false;
            break;
          }
        }
      }
    }

    setFieldErrors(errors);
    return isValid;
  }, [investorData, formatNumber]);

  // Get only changed fields
  const getChangedFields = useCallback(() => {
    if (!originalData) return {};
    
    const changes = {};
    
    // Basic fields
    const fieldsToCheck = [
      'firstName', 'mobileNumber', 'whatsappNumber', 'state', 
      'city', 'address', 'pincode', 'occupation'
    ];
    
    fieldsToCheck.forEach(field => {
      if (investorData[field] !== originalData[field]) {
        changes[field] = investorData[field];
      }
    });
    
    // Handle phone numbers
    if (formatNumber(investorData.mobileNumber) !== formatNumber(originalData.mobileNumber)) {
      changes.mobileNumber = "+91" + formatNumber(investorData.mobileNumber);
    }
    
    if (formatNumber(investorData.whatsappNumber) !== formatNumber(originalData.whatsappNumber)) {
      changes.whatsappNumber = "+91" + formatNumber(investorData.whatsappNumber);
    }
    
    // Handle preferences if changed
    const normalizedOriginalPrefs = originalData.preferences.map(pref => ({
      ...pref,
      locationType: pref.locationType.toLowerCase()
    }));
    
    const normalizedCurrentPrefs = investorData.preferences.map(pref => ({
      ...pref,
      locationType: pref.locationType.toLowerCase()
    }));
    
    if (JSON.stringify(normalizedCurrentPrefs) !== JSON.stringify(normalizedOriginalPrefs)) {
      changes.preferences = investorData.preferences.map(pref => ({
        ...pref,
        locationType: pref.locationType.toLowerCase(),
        propertyPreferred: pref.propertyPreferred || []
      }));
    }
    
    // Handle profile image changes
    if (avatarFile) {
      changes.profileImage = avatarFile;
    } else if (isImageRemoved) {
      changes.removeProfileImage = true;
    }
    
    return changes;
  }, [originalData, investorData, avatarFile, isImageRemoved, formatNumber]);

  // Form handling
const handleSave = async () => {
  if (!validateFields()) {
    return;
  }

  setIsSubmitting(true);
  
  const changedFields = getChangedFields();
  
  
  // If nothing changed, just show message
  if (Object.keys(changedFields).length === 0 && !avatarFile && !isImageRemoved) {
    setSnackbar({
      open: true,
      message: "No changes detected",
      severity: "info",
    });
    setIsSubmitting(false);
    return;
  }

  const formData = new FormData();
  
  // Append only changed fields
  Object.entries(changedFields).forEach(([key, value]) => {
    if (key === 'profileImage') {
      formData.append(key, value);
    } else {
      formData.append(key, value);
    }
  });

  try {
    
    const response = await axios.patch(
      `http://localhost:5000/api/v1/investor/updateInvestor/${investorData.uuid}`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );


      if (response.data.success) {
        const updatedData = response.data.data;
        const newOriginalData = {
          ...originalData,
          ...updatedData,
          mobileNumber: formatNumber(updatedData.mobileNumber),
          whatsappNumber: formatNumber(updatedData.whatsappNumber),
          profileImage: updatedData.profileImage || "",
          preferences: updatedData.preferences?.map(pref => ({
            ...pref,
            locationType: pref.locationType === "international" ? "International" : "Domestic",
            propertyPreferred: pref.propertyPreferred || []
          })) || []
        };
        
        setOriginalData(newOriginalData);
        setInvestorData(newOriginalData);
        
        if (avatarFile) {
          setAvatarPreview(URL.createObjectURL(avatarFile));
        } else if (isImageRemoved) {
          setAvatarPreview("");
        }
        
        setAvatarFile(null);
        setIsImageRemoved(false);
        
        setSnackbar({
          open: true,
          message: "Investor profile successfully updated!",
          severity: "success",
        });
      } else {
        throw new Error(response.data.message || "Failed to update investor profile");
      }
    } catch (error) {
      console.error("Error saving investor data:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to update investor profile. Please try again.",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Preference handling
  const handlePreferenceChange = (index, key, value) => {
    const newPrefs = [...(investorData.preferences || [])];
    newPrefs[index] = { ...newPrefs[index], [key]: value };
    
    // Reset location fields when location type changes
    if (key === "locationType") {
      newPrefs[index] = {
        ...newPrefs[index],
        preferredCountry: "",
        preferredState: "",
        preferredDistrict: "",
        preferredCity: ""
      };
    }
    
    setInvestorData({ ...investorData, preferences: newPrefs });
  };

  const handleCategoryChange = (prefIndex, catIndex, key, value) => {
    const newPrefs = [...(investorData.preferences || [])];
    const newCategories = [...(newPrefs[prefIndex].category || [])];
    newCategories[catIndex] = { ...newCategories[catIndex], [key]: value };
    newPrefs[prefIndex].category = newCategories;
    setInvestorData({ ...investorData, preferences: newPrefs });
  };

  // Property preference handling
  const handlePropertyPreferenceChange = (prefIndex, propIndex, key, value) => {
    const newPrefs = [...(investorData.preferences || [])];
    const newProps = [...(newPrefs[prefIndex].propertyPreferred || [])];
    newProps[propIndex] = { ...newProps[propIndex], [key]: value };
    newPrefs[prefIndex].propertyPreferred = newProps;
    setInvestorData({ ...investorData, preferences: newPrefs });
  };

  const addPreference = () => {
    const newPrefs = [...(investorData.preferences || [])];
    newPrefs.push({
      investmentRange: "",
      investmentAmount: "",
      locationType: "Domestic",
      preferredCountry: "",
      preferredState: "",
      preferredDistrict: "",
      preferredCity: "",
      category: [{ main: "", sub: "", child: "" }],
      propertyPreferred: [{
        propertyType: "",
        propertySize: "",
        propertyCountry: "",
        propertyState: "",
        propertyCity: ""
      }],
      _id: `pref-${Date.now()}`
    });
    setInvestorData({ ...investorData, preferences: newPrefs });
  };

  const removePreference = (index) => {
    const newPrefs = [...(investorData.preferences || [])];
    if (newPrefs.length > 1) {
      newPrefs.splice(index, 1);
      setInvestorData({ ...investorData, preferences: newPrefs });
    } else {
      setSnackbar({
        open: true,
        message: "At least one preference is required",
        severity: "error",
      });
    }
  };

  // Render international location fields
  const renderInternationalLocationFields = (pref, prefIndex) => {
    return (
      <>
        <TextField
          size="small"
          label="Preferred Country"
          value={pref.preferredCountry || ""}
          onChange={(e) =>
            handlePreferenceChange(
              prefIndex,
              "preferredCountry",
              e.target.value
            )
          }
          fullWidth
          required
          error={!pref.preferredCountry}
          helperText={!pref.preferredCountry ? "This field is required" : ""}
        />

        <TextField
          size="small"
          label="Preferred State/Province"
          value={pref.preferredState || ""}
          onChange={(e) =>
            handlePreferenceChange(
              prefIndex,
              "preferredState",
              e.target.value
            )
          }
          fullWidth
          required
          error={!pref.preferredState}
          helperText={!pref.preferredState ? "This field is required" : ""}
        />

        <TextField
          size="small"
          label="Preferred City"
          value={pref.preferredCity || ""}
          onChange={(e) =>
            handlePreferenceChange(
              prefIndex,
              "preferredCity",
              e.target.value
            )
          }
          fullWidth
          required
          error={!pref.preferredCity}
          helperText={!pref.preferredCity ? "This field is required" : ""}
        />
      </>
    );
  };

  // Render helpers
  const renderField = (label, key, isReadOnly = false) => {
    const value = investorData[key];
    const isPhoneField = key === "mobileNumber" || key === "whatsappNumber";
    const isReadOnlyField = isReadOnly || key === "country" || key === "email";
    const isOccupationField = key === "occupation";
    const isPincodeField = key === "pincode";
    const isAddressField = key === "address";

    let displayValue = "";
    if (Array.isArray(value)) {
      displayValue = value.join(", ");
    } else if (typeof value === "object" && value !== null) {
      displayValue = JSON.stringify(value);
    } else {
      displayValue = value || "";
    }

    return (
      <Box mb={2}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          {label}
        </Typography>
        <Box display="flex" alignItems="center">
          {isPhoneField && <Typography sx={{ mr: 1 }}>+91</Typography>}
          {isOccupationField ? (
            <TextField
              select
              fullWidth
              variant="outlined"
              size="small"
              value={value || ""}
              onChange={(e) => {
                setInvestorData({ ...investorData, [key]: e.target.value });
                setFieldErrors({ ...fieldErrors, [key]: "" });
              }}
              error={!!fieldErrors[key]}
              helperText={fieldErrors[key]}
              required
              disabled={isReadOnlyField}
            >
              <MenuItem value="Investor">Investor</MenuItem>
              <MenuItem value="Student">Student</MenuItem>
              <MenuItem value="Salaried Professional">Salaried Professional</MenuItem>
              <MenuItem value="Business Owner/ Self-Employed">Business Owner/ Self-Employed</MenuItem>
              <MenuItem value="Retired">Retired</MenuItem>
              <MenuItem value="Freelancer/ Consultant">Freelancer/ Consultant</MenuItem>
              <MenuItem value="Homemaker">Homemaker</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
          ) : isPincodeField ? (
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              value={value || ""}
              onChange={(e) => {
                const input = e.target.value.replace(/\D/g, '').slice(0, 6);
                setInvestorData({ ...investorData, [key]: input });
                setFieldErrors({ ...fieldErrors, [key]: "" });
              }}
              error={!!fieldErrors[key]}
              helperText={fieldErrors[key]}
              inputProps={{ maxLength: 6 }}
              required
              disabled={isReadOnlyField}
            />
          ) : isAddressField ? (
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              value={value || ""}
              onChange={(e) => {
                setInvestorData({ ...investorData, [key]: e.target.value });
                setFieldErrors({ ...fieldErrors, [key]: "" });
              }}
              error={!!fieldErrors[key]}
              helperText={fieldErrors[key]}
              required
              multiline
              rows={3}
              disabled={isReadOnlyField}
            />
          ) : (
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              value={value || ""}
              onChange={(e) => {
                setInvestorData({ ...investorData, [key]: e.target.value });
                setFieldErrors({ ...fieldErrors, [key]: "" });
              }}
              error={!!fieldErrors[key]}
              helperText={fieldErrors[key]}
              required={!isPhoneField}
              inputProps={isPhoneField ? { maxLength: 10 } : {}}
              disabled={isReadOnlyField}
            />
          )}
        </Box>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!investorData || Object.keys(investorData).length === 0) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6" gutterBottom>
          Unable to load investor profile. Please try again later.
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  const handleOpenSnackbar = () => {
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleConfirm = async () => {
    try {
      setSnackbarOpen(false);
      
      const response = await axios.patch(
        `http://localhost:5000/api/v1/admin/removeInvestorProfileImage/${id || investorData._id}`,
        { removeProfileImage: true }
      );

      if (response.data.success) {
        const updatedData = {
          ...originalData,
          profileImage: ""
        };
        setOriginalData(updatedData);
        setInvestorData(updatedData);
        setAvatarPreview("");
        setAvatarFile(null);
        setIsImageRemoved(true);
        
        setSnackbar({
          open: true,
          message: "Profile image removed successfully!",
          severity: "success",
        });
      } else {
        throw new Error(response.data.message || "Failed to remove profile image");
      }
    } catch (error) {
      console.error("Error removing profile image:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to remove profile image",
        severity: "error",
      });
    }
  };

  return (
    <Box px={2}>
      {/* <Box display="flex" justifyContent="center"> */}
        {/* <Paper
          elevation={4}
          sx={{ 
            padding: 4, 
            borderRadius: 4, 
            width: "100%", 
            maxWidth: 700,
            position: "relative"
          }}
        > */}
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              position: 'absolute',
              right: 0,
              top: 0,
              color: 'text.secondary',
              '&:hover': {
                color: 'error.main',
                backgroundColor: 'rgba(244, 67, 54, 0.08)'
              }
            }}
            disabled={isSubmitting}
          >
            <CloseIcon />
          </IconButton>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h5" fontWeight={500}>
              Investor Profile
            </Typography>
            <Button
              variant="outlined"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              sx={{ 
                borderRadius: 3, 
                textTransform: "none", 
                fontWeight: 600, 
                px: 2.5, 
                py: 1 
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </Box>

          <Box display="flex" alignItems="center" mb={3}>
            <Box width="100%">
              <Box display="flex" alignItems="center">
                {/* Avatar Display */}
                <Avatar
                  alt="Investor Avatar"
                  src={avatarPreview || (isImageRemoved ? "" : investorData.profileImage)}
                  sx={{ 
                    width: 80, 
                    height: 80,
                    mx: 2
                  }}
                />

                {/* Action Buttons */}
                <Box display="flex">
                  {/* Edit Button */}
                  <Box mx={1}>
                    <input
                      id={`avatar-upload-${investorData._id || id}`}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleAvatarChange}
                      disabled={isSubmitting}
                    />
                    <IconButton
                      component="label"
                      htmlFor={`avatar-upload-${investorData._id || id}`}
                      size="medium"
                      color="primary"
                      sx={{ 
                        backgroundColor: 'rgba(25, 118, 210, 0.08)',
                        '&:hover': {
                          backgroundColor: 'rgba(25, 118, 210, 0.12)',
                        }
                      }}
                      disabled={isSubmitting}
                    >
                      <TbPhotoEdit />
                    </IconButton>
                  </Box>

                  {/* Delete Button - Only show if there's an image to delete */}
                  {(avatarPreview || investorData.profileImage) && !isImageRemoved && (
                    <Box mx={1}>
                      <IconButton
                        size="medium"
                        color="error"
                        onClick={handleRemoveAvatar}
                        sx={{ 
                          backgroundColor: 'rgba(244, 67, 54, 0.08)',
                          '&:hover': {
                            backgroundColor: 'rgba(244, 67, 54, 0.12)',
                          }
                        }}
                        disabled={isSubmitting}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}
                </Box>

                <Typography variant="h6" ml={2}>{investorData.investorID}</Typography>
              </Box>

              {/* Instruction text */}
              <Typography 
                variant="caption" 
                display="block"
                mt={1}
                ml={2}
                color="text.secondary"
              >
                Click edit icon to change photo (max 50KB)
              </Typography>

              {/* Error message */}
              {imagesizeError && (
                <Box mt={1} ml={2}>
                  <MuiAlert severity="error" sx={{ width: 'fit-content' }}>
                    {imagesizeError}
                  </MuiAlert>
                </Box>
              )}
            </Box>
          </Box>

          {renderField("First Name", "firstName")}
          {renderField("Email", "email", true)}
          {renderField("Mobile Number", "mobileNumber")}
          {renderField("Whatsapp Number", "whatsappNumber")}
          {renderField("Country", "country", true)}
          {renderField("State", "state")}
          {renderField("City", "city")}
          {renderField("Address", "address")}
          {renderField("Pincode", "pincode")}
          {renderField("Occupation", "occupation")}

          <Box mt={4}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Preferences
            </Typography>

            {(investorData.preferences || []).map((pref, prefIndex) => (
              <Paper
                key={pref._id}
                elevation={2}
                sx={{ 
                  p: 2, 
                  mb: 3, 
                  borderRadius: 2, 
                  backgroundColor: "#f9f9f9",
                  position: "relative"
                }}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    Preference #{prefIndex + 1}
                  </Typography>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => removePreference(prefIndex)}
                    disabled={investorData.preferences.length <= 1 || isSubmitting}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>

                <Box display="flex" flexDirection="column" gap={1}>
                  {/* Investment Range */}
                  <TextField
                    size="small"
                    label="Investment Range"
                    value={pref.investmentRange || ""}
                    onChange={(e) =>
                      handlePreferenceChange(
                        prefIndex,
                        "investmentRange",
                        e.target.value
                      )
                    }
                    select
                    required
                    error={!pref.investmentRange}
                    helperText={!pref.investmentRange ? "This field is required" : ""}
                  >
                    <MenuItem value="">Select Investment Range</MenuItem>
                    <MenuItem value="having amount">Having Investment Amount Ready</MenuItem>
                    <MenuItem value="take loan">Planning to take a Loan</MenuItem>
                    <MenuItem value="need loan">Need Loan Assistance</MenuItem>
                  </TextField>

                  {/* Investment Amount */}
                  <TextField
                    size="small"
                    label="Investment Amount"
                    value={pref.investmentAmount || ""}
                    onChange={(e) =>
                      handlePreferenceChange(
                        prefIndex,
                        "investmentAmount",
                        e.target.value
                      )
                    }
                    select
                    required
                    error={!pref.investmentAmount}
                    helperText={!pref.investmentAmount ? "This field is required" : ""}
                  >
                    <MenuItem value="">Select Investment Amount</MenuItem>
                    <MenuItem value="Below-50,000">Below - Rs.50 K</MenuItem>
                    <MenuItem value="Rs.50,000-2L">Rs.50 K - 2 L</MenuItem>
                    <MenuItem value="Rs.2L-5L">Rs.2 L - 5 L</MenuItem>
                    <MenuItem value="Rs.5L-10L">Rs.5 L - 10 L</MenuItem>
                    <MenuItem value="Rs.10L-20L">Rs.10 L - 20 L</MenuItem>
                    <MenuItem value="Rs.20L-30L">Rs.20 L - 30 L</MenuItem>
                    <MenuItem value="Rs.30L-50L">Rs.30 L - 50 L</MenuItem>
                    <MenuItem value="Rs.50L-1Cr">Rs.50 L - 1 Cr</MenuItem>
                    <MenuItem value="Rs.1Cr-2Cr">Rs.1 Cr - 2 Cr</MenuItem>
                    <MenuItem value="Rs.2Cr-5Cr">Rs.2 Cr - 5 Cr</MenuItem>
                    <MenuItem value="Rs.5Cr-above">Rs.5 Cr - Above</MenuItem>
                  </TextField>

                  {/* Location Type */}
                  <TextField
                    size="small"
                    label="Location Type"
                    value={pref.locationType || ""}
                    onChange={(e) =>
                      handlePreferenceChange(
                        prefIndex,
                        "locationType",
                        e.target.value
                      )
                    }
                    select
                    fullWidth
                    required
                    error={!pref.locationType}
                    helperText={!pref.locationType ? "This field is required" : ""}
                  >
                    <MenuItem value="Domestic">Domestic</MenuItem>
                    <MenuItem value="International">International</MenuItem>
                  </TextField>

                  {/* Location Selection - Domestic */}
                  {pref.locationType === "Domestic" && (
                    <>
                      <TextField
                        size="small"
                        label="Preferred State"
                        value={pref?.preferredState || ""}
                        onChange={(e) => {
                          handlePreferenceChange(prefIndex, "preferredState", e.target.value);
                          setStateSuggestions(filterSuggestions(e.target.value, indiaData.map(state => state.name)));
                          setActiveSuggestionIndex(-1);
                        }}
                        onFocus={() => {
                          if (pref?.preferredState) {
                            setStateSuggestions(filterSuggestions(pref.preferredState, indiaData.map(state => state.name)));
                          }
                        }}
                        onBlur={() => setTimeout(() => setStateSuggestions([]), 200)}
                        onKeyDown={(e) => {
                          if (e.key === 'ArrowDown') {
                            e.preventDefault();
                            setActiveSuggestionIndex(prev => 
                              Math.min(prev + 1, stateSuggestions.length - 1)
                            );
                          } else if (e.key === 'ArrowUp') {
                            e.preventDefault();
                            setActiveSuggestionIndex(prev => Math.max(prev - 1, -1));
                          } else if (e.key === 'Enter' && activeSuggestionIndex >= 0) {
                            e.preventDefault();
                            handlePreferenceChange(prefIndex, "preferredState", stateSuggestions[activeSuggestionIndex]);
                            setStateSuggestions([]);
                          }
                        }}
                        disabled={indiaData.length === 0}
                        fullWidth
                        required
                        error={!pref.preferredState}
                        helperText={!pref.preferredState ? "This field is required" : ""}
                      />

                      {/* State Suggestions */}
                      {stateSuggestions.length > 0 && (
                        <Paper elevation={3} sx={{ mt: 0.5, maxHeight: 200, overflow: 'auto' }}>
                          {stateSuggestions.map((state, index) => (
                            <MenuItem
                              key={state}
                              selected={index === activeSuggestionIndex}
                              onClick={() => {
                                handlePreferenceChange(prefIndex, "preferredState", state);
                                setStateSuggestions([]);
                              }}
                              sx={{ fontSize: '0.875rem' }}
                            >
                              {state}
                            </MenuItem>
                          ))}
                        </Paper>
                      )}

                      <TextField
                        size="small"
                        label="Preferred District"
                        value={pref.preferredDistrict || ""}
                        onChange={(e) => {
                          handlePreferenceChange(prefIndex, "preferredDistrict", e.target.value);
                          const districts = getDistrictsForState(pref.preferredState);
                          setDistrictSuggestions(filterSuggestions(e.target.value, districts));
                          setActiveSuggestionIndex(-1);
                        }}
                        onFocus={() => {
                          if (pref?.preferredDistrict && pref.preferredState) {
                            const districts = getDistrictsForState(pref.preferredState);
                            setDistrictSuggestions(filterSuggestions(pref.preferredDistrict, districts));
                          }
                        }}
                        onBlur={() => setTimeout(() => setDistrictSuggestions([]), 200)}
                        onKeyDown={(e) => {
                          if (e.key === 'ArrowDown') {
                            e.preventDefault();
                            setActiveSuggestionIndex(prev => 
                              Math.min(prev + 1, districtSuggestions.length - 1)
                            );
                          } else if (e.key === 'ArrowUp') {
                            e.preventDefault();
                            setActiveSuggestionIndex(prev => Math.max(prev - 1, -1));
                          } else if (e.key === 'Enter' && activeSuggestionIndex >= 0) {
                            e.preventDefault();
                            handlePreferenceChange(prefIndex, "preferredDistrict", districtSuggestions[activeSuggestionIndex]);
                            setDistrictSuggestions([]);
                          }
                        }}
                        disabled={!pref.preferredState}
                        fullWidth
                        required
                        error={!pref.preferredDistrict}
                        helperText={!pref.preferredDistrict ? "This field is required" : ""}
                        sx={{ mt: 2 }}
                      />

                      {/* District Suggestions */}
                      {districtSuggestions.length > 0 && (
                        <Paper elevation={3} sx={{ mt: 0.5, maxHeight: 200, overflow: 'auto' }}>
                          {districtSuggestions.map((district, index) => (
                            <MenuItem
                              key={district}
                              selected={index === activeSuggestionIndex}
                              onClick={() => {
                                handlePreferenceChange(prefIndex, "preferredDistrict", district);
                                setDistrictSuggestions([]);
                              }}
                              sx={{ fontSize: '0.875rem' }}
                            >
                              {district}
                            </MenuItem>
                          ))}
                        </Paper>
                      )}

                      <TextField
                        size="small"
                        label="Preferred City"
                        value={pref.preferredCity || ""}
                        onChange={(e) => {
                          handlePreferenceChange(prefIndex, "preferredCity", e.target.value);
                          const cities = getCitiesForDistrict(pref.preferredState, pref.preferredDistrict);
                          setCitySuggestions(filterSuggestions(e.target.value, cities));
                          setActiveSuggestionIndex(-1);
                        }}
                        onFocus={() => {
                          if (pref?.preferredCity && pref.preferredState && pref.preferredDistrict) {
                            const cities = getCitiesForDistrict(pref.preferredState, pref.preferredDistrict);
                            setCitySuggestions(filterSuggestions(pref.preferredCity, cities));
                          }
                        }}
                        onBlur={() => setTimeout(() => setCitySuggestions([]), 200)}
                        onKeyDown={(e) => {
                          if (e.key === 'ArrowDown') {
                            e.preventDefault();
                            setActiveSuggestionIndex(prev => 
                              Math.min(prev + 1, citySuggestions.length - 1)
                            );
                          } else if (e.key === 'ArrowUp') {
                            e.preventDefault();
                            setActiveSuggestionIndex(prev => Math.max(prev - 1, -1));
                          } else if (e.key === 'Enter' && activeSuggestionIndex >= 0) {
                            e.preventDefault();
                            handlePreferenceChange(prefIndex, "preferredCity", citySuggestions[activeSuggestionIndex]);
                            setCitySuggestions([]);
                          }
                        }}
                        disabled={!pref.preferredDistrict}
                        fullWidth
                        required
                        error={!pref.preferredCity}
                        helperText={!pref.preferredCity ? "This field is required" : ""}
                        sx={{ mt: 2 }}
                      />

                      {/* City Suggestions */}
                      {citySuggestions.length > 0 && (
                        <Paper elevation={3} sx={{ mt: 0.5, maxHeight: 200, overflow: 'auto' }}>
                          {citySuggestions.map((city, index) => (
                            <MenuItem
                              key={city}
                              selected={index === activeSuggestionIndex}
                              onClick={() => {
                                handlePreferenceChange(prefIndex, "preferredCity", city);
                                setCitySuggestions([]);
                              }}
                              sx={{ fontSize: '0.875rem' }}
                            >
                              {city}
                            </MenuItem>
                          ))}
                        </Paper>
                      )}
                    </>
                  )}

                  {/* Location Selection - International */}
                  {pref.locationType === "International" && (
                    renderInternationalLocationFields(pref, prefIndex)
                  )}

                  {/* Category Selection */}
                  <Box mt={1}>
                    <Typography fontWeight={600} mb={1}>
                      Category
                    </Typography>

                    {pref.category?.map((cat, catIndex) => {
                      const mainCategory = categories.find(
                        (c) => c.name === cat.main
                      );
                      const subCategory = mainCategory?.children?.find(
                        (sub) => sub.name === cat.sub
                      );

                      return (
                        <Box
                          key={catIndex}
                          display="flex"
                          gap={0.5}
                          alignItems="center"
                          mb={1}
                          sx={{marginLeft:{xs:"-12px"}}}
                          
                        >
                          <TextField
                            size="small"
                            placeholder="Main"
                            value={cat.main || ""}
                            onChange={(e) =>
                              handleCategoryChange(
                                prefIndex,
                                catIndex,
                                "main",
                                e.target.value
                              )
                            }
                            sx={{ flex: 1, }}
                            select
                            required
                            error={!cat.main}
                            helperText={!cat.main ? "Required" : ""}
                          >
                            <MenuItem value="">Select Main</MenuItem>
                            {categories.map((mainCat) => (
                              <MenuItem key={mainCat.name} value={mainCat.name}>
                                {mainCat.name}
                              </MenuItem>
                            ))}
                          </TextField>

                          <TextField
                            size="small"
                            placeholder="Sub"
                            value={cat.sub || ""}
                            onChange={(e) =>
                              handleCategoryChange(
                                prefIndex,
                                catIndex,
                                "sub",
                                e.target.value
                              )
                            }
                            sx={{ flex: 1 }}
                            select
                            disabled={!cat.main}
                          >
                            <MenuItem value="">Select Sub</MenuItem>
                            {mainCategory?.children?.map((subCat) => (
                              <MenuItem key={subCat.name} value={subCat.name}>
                                {subCat.name}
                              </MenuItem>
                            ))}
                          </TextField>

                          <TextField
                            size="small"
                            placeholder="Child"
                            value={cat.child || ""}
                            onChange={(e) =>
                              handleCategoryChange(
                                prefIndex,
                                catIndex,
                                "child",
                                e.target.value
                              )
                            }
                            sx={{ flex: 1 }}
                            select
                            disabled={!cat.sub}
                          >
                            <MenuItem value="">Select Child</MenuItem>
                            {subCategory?.children?.map((child, idx) => (
                              <MenuItem key={idx} value={child}>
                                {child}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Box>
                      );
                    })}

                  </Box>

                  {/* Property Preferences */}
                  <Box mt={2}>
                    <Typography fontWeight={600} mb={1}>
                      Property Preferences
                    </Typography>

                    {(pref.propertyPreferred || []).map((prop, propIndex) => (
                      <Box key={propIndex} mb={2} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                        <Box display="flex" flexDirection="column" gap={1}>
                          {/* Property Type */}
                          <TextField
                            size="small"
                            label="Property Type"
                            value={prop.propertyType || ""}
                            onChange={(e) =>
                              handlePropertyPreferenceChange(
                                prefIndex,
                                propIndex,
                                "propertyType",
                                e.target.value
                              )
                            }
                            select
                            required
                            error={!prop.propertyType}
                            helperText={!prop.propertyType ? "This field is required" : ""}
                          >
                            <MenuItem value="">Select Property Type</MenuItem>
                            <MenuItem value="Own Property">Own Property</MenuItem>
                            <MenuItem value="Rental Property">Rental Property</MenuItem>
                          </TextField>

                          {/* Property Size - Only show if property type is Own Property */}
                          {prop.propertyType === "Own Property" && (
                            <TextField
                              size="small"
                              label="Property Size"
                              value={prop.propertySize || ""}
                              onChange={(e) =>
                                handlePropertyPreferenceChange(
                                  prefIndex,
                                  propIndex,
                                  "propertySize",
                                  e.target.value
                                )
                              }
                              select
                              required
                              error={!prop.propertySize}
                              helperText={!prop.propertySize ? "This field is required" : ""}
                            >
                              <MenuItem value="">Select Total Area</MenuItem>
                              <MenuItem value="Below - 100 sq ft">Below - 100 sq ft</MenuItem>
                              <MenuItem value="100 sq ft - 200 sq ft">100 sq ft - 200 sq ft</MenuItem>
                              <MenuItem value="200 sq ft - 500 sq ft">200 sq ft - 500 sq ft</MenuItem>
                              <MenuItem value="500 sq ft - 1000 sq ft">500 sq ft - 1000 sq ft</MenuItem>
                              <MenuItem value="1000 sq ft - 1500 sq ft">1000 sq ft - 1500 sq ft</MenuItem>
                              <MenuItem value="1500 sq ft - 2000 sq ft">1500 sq ft - 2000 sq ft</MenuItem>
                              <MenuItem value="2000 sq ft - 3000 sq ft">2000 sq ft - 3000 sq ft</MenuItem>
                              <MenuItem value="3000 sq ft - 5000 sq ft">3000 sq ft - 5000 sq ft</MenuItem>
                              <MenuItem value="5000 sq ft - 7000 sq ft">5000 sq ft - 7000 sq ft</MenuItem>
                              <MenuItem value="7000 sq ft - 10000 sq ft">7000 sq ft - 10000 sq ft</MenuItem>
                              <MenuItem value="Above 10000 sq ft">Above 10000 sq ft</MenuItem>
                            </TextField>
                          )}

                          {/* Location fields */}
                          <TextField
                            size="small"
                            label="Country"
                            value={prop.propertyCountry || ""}
                            onChange={(e) =>
                              handlePropertyPreferenceChange(
                                prefIndex,
                                propIndex,
                                "propertyCountry",
                                e.target.value
                              )
                            }
                            required
                          />

                          <TextField
                            size="small"
                            label="State"
                            value={prop.propertyState || ""}
                            onChange={(e) =>
                              handlePropertyPreferenceChange(
                                prefIndex,
                                propIndex,
                                "propertyState",
                                e.target.value
                              )
                            }
                            required
                          />

                          <TextField
                            size="small"
                            label="City"
                            value={prop.propertyCity || ""}
                            onChange={(e) =>
                              handlePropertyPreferenceChange(
                                prefIndex,
                                propIndex,
                                "propertyCity",
                                e.target.value
                              )
                            }
                            required
                          />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Paper>
            ))}

            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addPreference}
              sx={{ mt: 2 }}
              disabled={isSubmitting}
            >
              Add Preference
            </Button>
          </Box>
        {/* </Paper> */}
      {/* </Box> */}
     
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>

      {/* Confirmation Dialog for Image Removal */}
      <Dialog
        open={snackbarOpen}
        onClose={handleCloseSnackbar}
      >
        <DialogTitle>Confirm Removal</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to remove this investor's profile image?</Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseSnackbar}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            color="error"
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Removing..." : "Remove"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EditInvestor;