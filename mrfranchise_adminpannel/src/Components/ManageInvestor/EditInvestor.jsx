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
import { set } from "react-hook-form";

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
   const [countriesData, setCountriesData] = useState([]);
   const [statesData, setStatesData] = useState([]);
   const [citiesData, setCitiesData] = useState([]);
   const [prefStatesData, setPrefStatesData] = useState({});
   const [districtData, setDistrictData] = useState({});
    const [fieldErrors, setFieldErrors] = useState({
      firstName: "",
      mobileNumber: "",
      whatsappNumber: "",
      email:"",
      country: "",
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


useEffect(() => {
  const fetchCountries = async () => {
    try {
      const res = await axios.get("https://countriesnow.space/api/v0.1/countries/positions");
      // Remove the line with 'response.json()' - axios already parses the JSON
      if (res.data && res.data.data) {
        const countryNames = res.data.data.map((c) => c.name);
        setCountriesData(countryNames);
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
      setCountriesData([]);
      setSnackbar({ open: true, message: "Failed to fetch countries", severity: "error" });
    }
  };
  fetchCountries();
}, []);
// Add this function after fetchCities function
const fetchLocationFromPincode = useCallback(async (pincode, country = "India") => {
  if (!pincode || pincode.length !== 6) return null;
  
  try {
    // For India pincodes
    if (country === "India") {
      const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
      
      if (response.data && response.data[0] && response.data[0].Status === "Success") {
        const postOffice = response.data[0].PostOffice[0];
        return {
          state: postOffice.State,
          city: postOffice.District || postOffice.Name,
          country: "India"
        };
      }
    }
    // For other countries, you would need different APIs
    return null;
  } catch (error) {
    console.error("Error fetching location from pincode:", error);
    return null;
  }
}, []);
  // Function to fetch states for a country using countriesnow.space API
  const fetchStates = useCallback(async (country) => {
    if (!country) return [];
    
    try {
      const res = await axios.post(
        "https://countriesnow.space/api/v0.1/countries/states",
        { country }
      );
      
      if (res.data && res.data.data && res.data.data.states) {
        return res.data.data.states.map(state => state.name);
      }
      return [];
    } catch (err) {
      console.error(`Failed to load states for ${country}:`, err);
      return [];
    }
  }, []);

  // Function to fetch cities for a state using countriesnow.space API
  const fetchCities = useCallback(async (country, state) => {
    if (!country || !state) return [];
    
    try {
      const res = await axios.post(
        "https://countriesnow.space/api/v0.1/countries/state/cities",
        { country, state }
      );
      
      if (res.data && res.data.data) {
        return res.data.data;
      }
      return [];
    } catch (err) {
      console.error(`Failed to load cities for ${state}, ${country}:`, err);
      return [];
    }
  }, []);

  // Load states when country changes
  useEffect(() => {
    const loadStatesForCountry = async () => {
      if (investorData.country) {
        const states = await fetchStates(investorData.country);
        setStatesData(states);
      } else {
        setStatesData([]);
      }
    };
    
    loadStatesForCountry();
  }, [investorData.country, fetchStates]);
  // Fetch states for existing international preferences when component loads
useEffect(() => {
  const fetchStatesForExistingPreferences = async () => {
    if (investorData.preferences && investorData.preferences.length > 0) {
      const promises = [];
      
      investorData.preferences.forEach((pref, index) => {
        // Check if it's an international preference with a country but no states loaded yet
        if (pref.locationType === "International" && 
            pref.preferredCountry && 
            !prefStatesData[`pref_${index}`]) {
          console.log(`Fetching states for existing preference ${index}, country: ${pref.preferredCountry}`);
          promises.push(
            fetchStates(pref.preferredCountry).then(states => {
              setPrefStatesData(prev => ({ 
                ...prev, 
                [`pref_${index}`]: states 
              }));
              console.log(`Loaded states for ${pref.preferredCountry}:`, states);
            }).catch(error => {
              console.error(`Failed to fetch states for ${pref.preferredCountry}:`, error);
            })
          );
        }
      });
      
      if (promises.length > 0) {
        await Promise.all(promises);
      }
    }
  };
  
  if (investorData.preferences && !loading) {
    fetchStatesForExistingPreferences();
  }
}, [investorData.preferences, loading]); // Run when preferences change or loading completes

  // Load cities when state changes
  useEffect(() => {
    const loadCitiesForState = async () => {
      if (investorData.country && investorData.state) {
        const cities = await fetchCities(investorData.country, investorData.state);
        setCitiesData(cities);
      } else {
        setCitiesData([]);
      }
    };
    
    loadCitiesForState();
  }, [investorData.country, investorData.state, fetchCities]);

useEffect(() => {
  const loadIndiaStates = async () => {
    try {
      const states = await fetchStates("India");
      setPrefStatesData(prev => ({
        ...prev,
        'india': states // Make sure this key is exactly 'india'
      }));
      console.log('✅ Loaded Indian states:', states.length, 'states');
    } catch (error) {
      console.error('❌ Failed to load Indian states:', error);
    }
  };
  
  // Load India states on component mount
  loadIndiaStates();
}, [fetchStates]);
const fetchDistrictsForState = useCallback(async (stateName) => {
  if (!stateName) return [];
  
  try {
    // You'll need an API that returns districts for Indian states
    // Example: Using a local dataset or another API
    const response = await axios.post(
      "https://countriesnow.space/api/v0.1/countries/state/cities",
      { country: "India", state: stateName }
    );
    
    if (response.data && response.data.data) {
      return response.data.data; // Returns cities which can be used as districts
    }
    return [];
  } catch (error) {
    console.error(`Failed to load districts for ${stateName}:`, error);
    return [];
  }
}, []);

// Update when preferred state changes - improved version
useEffect(() => {
  const loadDistrictsForPreferences = async () => {
    if (investorData.preferences) {
      const promises = [];
      
      investorData.preferences.forEach((pref, index) => {
        if (pref.locationType === "Domestic" && pref.preferredState && !districtData[pref.preferredState]) {
          promises.push(
            fetchDistrictsForState(pref.preferredState).then(districts => {
              setDistrictData(prev => ({
                ...prev,
                [pref.preferredState]: districts
              }));
            })
          );
        }
      });
      
      if (promises.length > 0) {
        await Promise.all(promises);
      }
    }
  };
  
  loadDistrictsForPreferences();
}, [investorData.preferences]); // Only depend on preferences

// Add this function to handle preference country change
const handlePrefCountryChange = async (prefIndex, country) => {
  console.log(`handlePrefCountryChange called: prefIndex=${prefIndex}, country=${country}`);
  
  // Clear state when country changes
  handlePreferenceChange(prefIndex, "preferredState", "");
  handlePreferenceChange(prefIndex, "preferredCountry", country);

  if (country) {
    const states = await fetchStates(country);
    
    setPrefStatesData(prev => {
      const newState = { ...prev, [`pref_${prefIndex}`]: states };
      console.log(`Updated prefStatesData[pref_${prefIndex}]:`, newState[`pref_${prefIndex}`]);
      return newState;
    });
  } else {
    setPrefStatesData(prev => ({ ...prev, [`pref_${prefIndex}`]: [] }));
  }
};
// Fetch states for property preference countries
useEffect(() => {
  const fetchStatesForPropertyPreferences = async () => {
    if (investorData.preferences && investorData.preferences.length > 0) {
      const promises = [];
      
      investorData.preferences.forEach((pref, prefIndex) => {
        if (pref.propertyPreferred) {
          pref.propertyPreferred.forEach((prop, propIndex) => {
            if (prop.propertyCountry && !prefStatesData[`prop_${prefIndex}_${propIndex}`]) {
              console.log(`Fetching states for property pref ${prefIndex}-${propIndex}, country: ${prop.propertyCountry}`);
              promises.push(
                fetchStates(prop.propertyCountry).then(states => {
                  setPrefStatesData(prev => ({ 
                    ...prev, 
                    [`prop_${prefIndex}_${propIndex}`]: states 
                  }));
                }).catch(error => {
                  console.error(`Failed to fetch states for ${prop.propertyCountry}:`, error);
                })
              );
            }
          });
        }
      });
      
      if (promises.length > 0) {
        await Promise.all(promises);
      }
    }
  };
  
  if (investorData.preferences && !loading) {
    fetchStatesForPropertyPreferences();
  }
}, [investorData.preferences, loading]);

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
            console.log('✅ Fetched investor data:', investorDataToUse);
            console.log('✅ UUID from response:', investorDataToUse.uuid);
            
            // Log preferences details
            if (investorDataToUse.preferences) {
              console.log('📋 Total Preferences:', investorDataToUse.preferences.length);
              investorDataToUse.preferences.forEach((pref, idx) => {
                console.log(`--- Preference ${idx} ---`);
                console.log('Investment Amount:', pref.investmentAmount);
                console.log('Investment Range:', pref.investmentRange);
                console.log('Location Type:', pref.locationType);
                console.log('Preferred State:', pref.preferredState);
                console.log('Preferred District:', pref.preferredDistrict);
                console.log('Category:', pref.category);
                console.log('Property Preferred:', pref.propertyPreferred);
                console.log('-------------------');
              });
            } else {
              console.log('❌ No preferences found in data');
            }
          } else {
            console.log('❌ No data in response:', response.data);
          }
        } else if (investorFromState) {
          console.log('✅ Using investor data from state:', investorFromState);
        } else {
          console.log('❌ No investor data available');
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
              category: Array.isArray(pref.category) ? pref.category : [{ main: "", sub: "" }],
              locationType: pref.locationType === "international" ? "International" : "Domestic",
              propertyPreferred: Array.isArray(pref.propertyPreferred) ? pref.propertyPreferred : [{
                propertyType: "",
                propertySize: "",
                propertyCountry: "",
                propertyState: "",
                // propertyCity: ""
              }]
            })) || [{
              investmentRange: "",
              investmentAmount: "",
              locationType: "Domestic",
              preferredCountry: "",
              preferredState: "",
              preferredDistrict: "",
              // preferredCity: "",
              category: [{ main: "", sub: "" }],
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
            console.log('✅ Formatted data to set:', formattedData);
          console.log('✅ Formatted preferences:', formattedData.preferences);
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
// Validate email
if (!investorData.email?.trim()) {
  errors.email = "Email is required";
  isValid = false;
} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(investorData.email.trim())) {
  errors.email = "Please enter a valid email address";
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
// Validate country
if (!investorData.country?.trim()) {
  errors.country = "Country is required";
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
  
  if (prop.propertyType === "Own Property") {
    // Property Size is required
    if (!prop.propertySize) {
      setSnackbar({
        open: true,
        message: "Property size is required when property type is Own Property",
        severity: "error",
      });
      isValid = false;
      break;
    }
    
    // Country is required for Own Property
    if (!prop.propertyCountry) {
      setSnackbar({
        open: true,
        message: "Country is required when property type is Own Property",
        severity: "error",
      });
      isValid = false;
      break;
    }
    
    // State is required for Own Property
    if (!prop.propertyState) {
      setSnackbar({
        open: true,
        message: "State is required when property type is Own Property",
        severity: "error",
      });
      isValid = false;
      break;
    }
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
        'firstName', 'mobileNumber', 'whatsappNumber','email','country', 'state', 
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
      let preferencesChanged = false;

  // First check if number of preferences changed
  if (investorData.preferences.length !== originalData.preferences.length) {
    preferencesChanged = true;
  } else {
    // Check each preference and all its nested properties
    for (let i = 0; i < investorData.preferences.length; i++) {
      const currentPref = investorData.preferences[i];
      const originalPref = originalData.preferences[i];

      // Compare top level preference fields
      if (currentPref.investmentRange !== originalPref.investmentRange ||
          currentPref.investmentAmount !== originalPref.investmentAmount ||
          currentPref.locationType !== originalPref.locationType ||
          currentPref.preferredState !== originalPref.preferredState ||
          currentPref.preferredDistrict !== originalPref.preferredDistrict||
          currentPref.preferredCountry !== originalPref.preferredCountry)
    {
        preferencesChanged = true;
        break;
      }

      // Check for category changes
       if (JSON.stringify(currentPref.category) !== JSON.stringify(originalPref.category)) {
        preferencesChanged = true;
        break;
      }

     
      const currentProps = currentPref.propertyPreferred || [];
      const originalProps = originalPref.propertyPreferred || [];
      
      // Check if number of property preferences changed
      if (currentProps.length !== originalProps.length) {
        preferencesChanged = true;
        break;
      }
      
      // Check each property preference
      for (let j = 0; j < currentProps.length; j++) {
        const currentProp = currentProps[j];
        const originalProp = originalProps[j];
        
        // Compare all property preference fields
        if (currentProp.propertyType !== originalProp.propertyType ||
            currentProp.propertySize !== originalProp.propertySize ||
            currentProp.propertyCountry !== originalProp.propertyCountry ||
            currentProp.propertyState !== originalProp.propertyState ||
            currentProp.propertyCity !== originalProp.propertyCity) {
          preferencesChanged = true;
          break;
        }
      }
      
      if (preferencesChanged) break;
    }
  }

  // If any preference change detected, add to payload
  if (preferencesChanged) {
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
  
  console.log('Changes detected:', changes); // Add this for debugging
  
  return changes;
}, [originalData, investorData, avatarFile, isImageRemoved, formatNumber]);


    // Form handling
  const handleSave = async () => {
    if (!validateFields()) {
      return;
    }

    setIsSubmitting(true);
    
    const changedFields = getChangedFields();
    console.log('Changed Fields:', changedFields);
    
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
    
  Object.entries(changedFields).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (key === 'profileImage') {
      formData.append(key, value);
    } else if (typeof value === 'object') {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });

    try {
      
      const response = await axios.patch(
  `http://localhost:5000/api/v1/admin/updateInvestor/${investorData.uuid}`,
        formData,
        {
          headers: {
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
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
  setInvestorData(prev => {
    const newPrefs = [...(prev.preferences || [])];
    const current = newPrefs[index] || {};
    let updated = { ...current, [key]: value };

    // Reset location fields when location type changes
    if (key === 'locationType') {
      updated = {
        ...updated,
        preferredCountry: "",
        preferredState: "",
        preferredDistrict: "",
      };

      if (value === "Domestic") updated.preferredCountry = "";
      if (value === "International") updated.preferredDistrict = "";
    }

    // If domestic state changed, clear district
    if (key === 'preferredState' && current.locationType === "Domestic") {
      updated.preferredDistrict = "";
    }

    newPrefs[index] = updated;
    return { ...prev, preferences: newPrefs };
  });

  // Fetch districts AFTER state update
  if (key === 'preferredState') {
    fetchDistrictsForState(value).then(districts => {
      setDistrictData(prev => ({ ...prev, [value]: districts }));
    });
  }
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
  setInvestorData(prev => {
    // Create full copies of all nested arrays/objects to ensure immutability
    const newPrefs = [...prev.preferences];
    const updatedPref = {...newPrefs[prefIndex]};
    const newProps = [...updatedPref.propertyPreferred];
    
    const updatedProperty = { ...newProps[propIndex], [key]: value };
    
    // If propertyType is changing to "Rental Property", clear size and location fields
    if (key === 'propertyType' && value === 'Rental Property') {
      updatedProperty.propertySize = '';
      updatedProperty.propertyCountry = '';
      updatedProperty.propertyState = '';
      updatedProperty.propertyCity = '';
    }
    
    // If propertyType is changing to "Own Property", clear location fields if needed
    if (key === 'propertyType' && value === 'Own Property') {
      // Keep existing propertySize if any, but clear location fields
      updatedProperty.propertyCountry = '';
      updatedProperty.propertyState = '';
      updatedProperty.propertyCity = '';
    }
    
    // Save the updated property
    newProps[propIndex] = updatedProperty;
    
    // Save changes back to state
    updatedPref.propertyPreferred = newProps;
    newPrefs[prefIndex] = updatedPref;
    return { ...prev, preferences: newPrefs };
  });
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
        // preferredCity: "",
        category: [{ main: "", sub: ""}],
        propertyPreferred: [{
          propertyType: "",
          propertySize: "",
          propertyCountry: "",
          propertyState: "",
          propertyCity: "",
        _id: `prop-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` // Add unique ID
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

  

    // Render helpers
    const renderField = (label, key, isReadOnly = false) => {
      const value = investorData[key];
      const isEmailField = key === "email";
      const isPhoneField = key === "mobileNumber" || key === "whatsappNumber";
      const isReadOnlyField = isReadOnly  ;
      const isOccupationField = key === "occupation";
      const isPincodeField = key === "pincode";
      const isAddressField = key === "address";
      const isCountryField = key === "country";
      const isStateField = key === "state";
      const isCityField = key === "city";

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
            ) : (isPincodeField) ? (
  <TextField
    fullWidth
    variant="outlined"
    size="small"
    value={value || ""}
    onChange={async (e) => {
      const input = e.target.value.replace(/\D/g, '').slice(0, 6);
      setInvestorData({ ...investorData, [key]: input });
      setFieldErrors({ ...fieldErrors, [key]: "" });
      
      // Auto-fetch when 6 digits entered
      if (input.length === 6 && investorData.country) {
        try {
          const location = await fetchLocationFromPincode(input, investorData.country);
          if (location) {
            setInvestorData(prev => ({
              ...prev,
              pincode: input,
              state: location.state || prev.state,
              city: location.city || prev.city,
              // Auto-set country to India if not already set
              country: location.country || prev.country
            }));
            
            // Also update the statesData if needed
            if (location.country && location.country !== investorData.country) {
              const states = await fetchStates(location.country);
              setStatesData(states);
            }
          }
        } catch (error) {
          console.error("Failed to fetch location from pincode:", error);
          // Don't show error to user, just don't auto-fill
        }
      }
    }}
    onBlur={async (e) => {
      // Also try to fetch on blur if 6 digits
      if (value && value.length === 6 && investorData.country) {
        try {
          const location = await fetchLocationFromPincode(value, investorData.country);
          if (location) {
            setInvestorData(prev => ({
              ...prev,
              state: location.state || prev.state,
              city: location.city || prev.city
            }));
          }
        } catch (error) {
          console.error("Failed to fetch location from pincode:", error);
        }
      }
    }}
    error={!!fieldErrors[key]}
    helperText={fieldErrors[key] || (value && value.length === 6 ? "Press Tab to auto-fill state & city" : "")}
    inputProps={{ maxLength: 6 }}
    required
    disabled={isSubmitting || isReadOnlyField}
    placeholder="Enter 6-digit pincode"
  />
) :(isCountryField) ? (
  <TextField
    select
    fullWidth
    variant="outlined"
    size="small"
    value={value || ""}
    onChange={async (e) => {
      const newCountry = e.target.value;
      setInvestorData({ 
        ...investorData, 
        [key]: newCountry,
        state: "",
        city: "",
        pincode: "" // Clear pincode when country changes
      });
      setFieldErrors({ ...fieldErrors, [key]: "" });
      
      // Fetch states for selected country
      if (newCountry) {
        const states = await fetchStates(newCountry);
        setStatesData(states);
      } else {
        setStatesData([]);
      }
      setCitiesData([]);
    }}
    error={!!fieldErrors[key]}
    helperText={fieldErrors[key]}
    required
    disabled={isReadOnlyField}
  >
    <MenuItem value="">Select Country</MenuItem>
    {countriesData.map((country) => (
      <MenuItem key={country} value={country}>
        {country}
      </MenuItem>
    ))}
  </TextField>
)  :(isStateField) ? (
  <TextField
    fullWidth
    variant="outlined"
    size="small"
    value={value || ""}
    // Remove the onChange that fetches cities
    // Keep it read-only or allow manual editing if needed
    onChange={(e) => {
      setInvestorData({ ...investorData, [key]: e.target.value });
      setFieldErrors({ ...fieldErrors, [key]: "" });
    }}
    error={!!fieldErrors[key]}
    helperText={fieldErrors[key]}
    required
    // Remove the disabled condition or change it
    disabled={isReadOnlyField}
  />

        ) :isCityField ? (
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
    // Remove the disabled condition
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
           disabled={isReadOnlyField || (isEmailField && isSubmitting)} // Only disable email during submission
            type={isEmailField ? "email" : "text"}
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
    `http://localhost:5000/api/v1/admin/removeInvestorProfileImage/${investorData.uuid}`,  
    { removeProfileImage: true }
  );

      if (response.data.success) {
    setAvatarPreview("");
    setAvatarFile(null);
    setIsImageRemoved(true);
    setInvestorData(prev => ({ ...prev, profileImage: "" }));
    setOriginalData(prev => ({ ...prev, profileImage: "" }));
    
    setSnackbar({ open: true, message: "Profile image removed!", severity: "success" });
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
            {renderField("Email", "email", false)}
            {renderField("Mobile Number", "mobileNumber")}
            {renderField("Whatsapp Number", "whatsappNumber")}
            {renderField("Country", "country")}
              {renderField("Address", "address")}
             {renderField("Pincode", "pincode")}
            {renderField("State", "state")}
            {renderField("City", "city")}
          
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
                       <MenuItem value="">Select preferred Investment Amount</MenuItem>
                                      <MenuItem value="Below - 50,000">Below - Rs.50 K</MenuItem>
                                      <MenuItem value="Rs. 50,000 - 2 L">Rs.50 K - 2 L</MenuItem>
                                      <MenuItem value="Rs. 2 L - 5 L">Rs.2 L - 5 L</MenuItem>
                                      <MenuItem value="Rs. 5 L - 10 L">Rs.5 L - 10 L</MenuItem>
                                      <MenuItem value="Rs. 10 L - 20 L">Rs.10 L - 20 L</MenuItem>
                                      <MenuItem value="Rs. 20 L - 30 L">Rs.20 L - 30 L</MenuItem>
                                      <MenuItem value="Rs. 30 L - 50 L">Rs.30 L - 50 L</MenuItem>
                                      <MenuItem value="Rs. 50 L - 1 Cr">Rs.50 L - 1 Cr</MenuItem>
                                      <MenuItem value="Rs. 1 Cr - 2 Crs">Rs.1 Cr - 2 Cr</MenuItem>
                                      <MenuItem value="Rs. 2 Crs - 5 Crs">Rs.2 Cr - 5 Cr</MenuItem>
                                      <MenuItem value="Rs. 5Crs - above">Rs.5 Cr - Above</MenuItem>
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
  }}
      select
      fullWidth
      required
      error={!pref.preferredState}
      helperText={!pref.preferredState ? "This field is required" : ""}
    >
      <MenuItem value="">Select State</MenuItem>
      {/* Check if Indian states are loaded */}
      {prefStatesData['india'] && prefStatesData['india'].length > 0 ? (
        prefStatesData['india'].map((state) => (
          <MenuItem key={state} value={state}>
            {state}
          </MenuItem>
        ))
      ) : (
        <MenuItem value="" disabled>
          Loading Indian states...
        </MenuItem>
      )}
    </TextField>

    {/* Preferred District - keep as is */}
  <TextField
  size="small"
  label="Preferred District"
  value={pref.preferredDistrict || ""}
  onChange={(e) => {
    handlePreferenceChange(prefIndex, "preferredDistrict", e.target.value);
  }}
  select
  fullWidth
  required
  error={!pref.preferredDistrict}
  helperText={!pref.preferredDistrict ? "This field is required" : ""}
  disabled={!pref.preferredState || isSubmitting}
  sx={{ mt: 2 }}
>
  <MenuItem value="">Select District</MenuItem>
  {pref.preferredState ? (
    districtData[pref.preferredState] ? (
      districtData[pref.preferredState].length > 0 ? (
        districtData[pref.preferredState].map((district) => (
          <MenuItem key={district} value={district}>
            {district}
          </MenuItem>
        ))
      ) : (
        <MenuItem value="" disabled>
          No districts available for {pref.preferredState}
        </MenuItem>
      )
    ) : (
      <MenuItem value="" disabled>
        Loading districts for {pref.preferredState}...
      </MenuItem>
    )
  ) : (
    <MenuItem value="" disabled>
      Select state first
    </MenuItem>
  )}
</TextField>
  </>
)}

                    {/* Location Selection - International */}
 {pref.locationType === "International" && (
  <>
    {/* ADD THIS FIELD - Preferred Country for International */}
    <TextField
      size="small"
      label="Preferred Country"
      value={pref.preferredCountry || ""}
      onChange={(e) => handlePrefCountryChange(prefIndex, e.target.value)}
      select
      fullWidth
      required
      error={!pref.preferredCountry}
      helperText={!pref.preferredCountry ? "This field is required" : ""}
    >
      <MenuItem value="">Select Country</MenuItem>
      {countriesData.map((country) => (
        <MenuItem key={country} value={country}>
          {country}
        </MenuItem>
      ))}
    </TextField>

  <TextField
  size="small"
  label="Preferred State/Province"
  value={pref.preferredState || ""}
  onChange={(e) => {
    console.log(`State changed for pref ${prefIndex}:`, e.target.value);
    handlePreferenceChange(prefIndex, "preferredState", e.target.value);
  }}
  select
  fullWidth
  required
  error={!pref.preferredState}
  helperText={!pref.preferredState ? "This field is required" : ""}
  disabled={!pref.preferredCountry}
  sx={{ mt: 2 }}
>
  <MenuItem value="">Select State/Province</MenuItem>
  {(() => {
    const key = `pref_${prefIndex}`;
    const states = prefStatesData[key];
    console.log(`Looking for states in prefStatesData[${key}]:`, states);
    console.log(`Current pref data - country: ${pref.preferredCountry}, state: ${pref.preferredState}`);
    
    if (!states) {
      // If we have a selected state but states are loading, show it as selected
      if (pref.preferredState) {
        return (
          <MenuItem value={pref.preferredState} selected>
            {pref.preferredState} (loading...)
          </MenuItem>
        );
      }
      return (
        <MenuItem value="" disabled>
          {pref.preferredCountry ? "Loading states..." : "Select country first"}
        </MenuItem>
      );
    }
    
    if (states.length === 0) {
      // If states array is empty but we have a selected state, still show it
      if (pref.preferredState) {
        return (
          <MenuItem value={pref.preferredState} selected>
            {pref.preferredState}
          </MenuItem>
        );
      }
      return (
        <MenuItem value="" disabled>
          No states/provinces available for {pref.preferredCountry}
        </MenuItem>
      );
    }
    
    return states.map((state) => (
      <MenuItem key={state} value={state}>
        {state}
      </MenuItem>
    ));
  })()}
</TextField>
  </>
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

                            {/* <TextField
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
                            </TextField> */}
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


{/* Location fields - ONLY show when Property Type is "Own Property" */}
 {prop.propertyType === "Own Property" && (
          <>
           <TextField
  size="small"
  label="Country"
  value={prop.propertyCountry || "India"}
  onChange={async (e) => {
    const country = e.target.value;
    handlePropertyPreferenceChange(prefIndex, propIndex, "propertyCountry", country);
    
    // Clear state when country changes
    handlePropertyPreferenceChange(prefIndex, propIndex, "propertyState", "");
    
    // Fetch states for the new country
    if (country) {
      const states = await fetchStates(country);
      setPrefStatesData(prev => ({
        ...prev,
        [`prop_${prefIndex}_${propIndex}`]: states
      }));
    }
  }}
  select
  required
  error={!prop.propertyCountry}
  helperText={!prop.propertyCountry ? "This field is required" : ""}
  sx={{ mt: 1 }}
>
  <MenuItem value="">Select Country</MenuItem>
  {countriesData.map((country) => (
    <MenuItem key={`prop-${prefIndex}-${propIndex}-${country}`} value={country}>
      {country}
    </MenuItem>
  ))}
</TextField>

           <TextField
  size="small"
  label="State"
  value={prop.propertyState || ""}
  onChange={(e) => {
    handlePropertyPreferenceChange(prefIndex, propIndex, "propertyState", e.target.value);
  }}
  select
  required
  error={!prop.propertyState}
  helperText={!prop.propertyState ? "This field is required" : ""}
  disabled={!prop.propertyCountry}
  sx={{ mt: 1 }}
>
  <MenuItem value="">Select State</MenuItem>
  {(() => {
    const key = `prop_${prefIndex}_${propIndex}`;
    const states = prefStatesData[key];
    
    if (!states) {
      return (
        <MenuItem value="" disabled>
          {prop.propertyCountry ? "Loading states..." : "Select country first"}
        </MenuItem>
      );
    }
    
    if (states.length === 0) {
      return (
        <MenuItem value="" disabled>
          No states available for {prop.propertyCountry}
        </MenuItem>
      );
    }
    
    return states.map((state) => (
      <MenuItem key={`prop-state-${prefIndex}-${propIndex}-${state}`} value={state}>
        {state}
      </MenuItem>
    ));
  })()}
</TextField>
          </>
        )}
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