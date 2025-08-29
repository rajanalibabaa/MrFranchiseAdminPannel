import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  CircularProgress,
  Grid
} from "@mui/material";
import { categories as brandCategories } from "../Components/Brands/BrandLIstingRegister/BrandCategories"; 

const FilterOption = ({
  selectedCategory,
  setSelectedCategory,
  selectedInvestmentRange,
  setSelectedInvestmentRange,
  selectedLocation,
  setSelectedLocation,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  loading = false,
  error = ""
}) => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [internalLoading, setInternalLoading] = useState(false);
  const [internalError, setInternalError] = useState("");

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
    "Rs. 5 Crs - above",
  ];

  // Fetch countries
  const fetchCountries = async () => {
    try {
      setInternalLoading(true);
      const response = await fetch('https://countriesnow.space/api/v0.1/countries');
      const data = await response.json();
      
      if (data.error === false) {
        setCountries(data.data || []);
      } else {
        setInternalError("Failed to fetch countries");
      }
    } catch (err) {
      setInternalError("Error fetching countries: " + err.message);
    } finally {
      setInternalLoading(false);
    }
  };

  // Fetch states based on selected country
  const fetchStates = async (country) => {
    try {
      setInternalLoading(true);
      setInternalError("");
      const response = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ country })
      });
      
      const data = await response.json();
      
      if (data.error === false) {
        setStates(data.data.states || []);
      } else {
        setInternalError("Failed to fetch states");
      }
    } catch (err) {
      setInternalError("Error fetching states: " + err.message);
    } finally {
      setInternalLoading(false);
    }
  };

  // Fetch cities based on selected country and state
  const fetchCities = async (country, state) => {
    try {
      setInternalLoading(true);
      setInternalError("");
const response = await fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
            method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ country, state })
      });
      
      const data = await response.json();
      
      if (data.error === false) {
        setCities(data.data || []);
      } else {
        setInternalError("Failed to fetch cities");
      }
    } catch (err) {
      setInternalError("Error fetching cities: " + err.message);
    } finally {
      setInternalLoading(false);
    }
  };

  const handleCountryChange = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    setSelectedState("");
    setSelectedLocation("");
    setStates([]);
    setCities([]);
    
    if (country) {
      fetchStates(country);
    }
  };

  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    setSelectedLocation("");
    setCities([]);
    
    if (state && selectedCountry) {
      fetchCities(selectedCountry, state);
    }
  };

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const isLoading = loading || internalLoading;
  const hasError = error || internalError;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {hasError && <Alert severity="error" sx={{ mb: 1 }}>{hasError}</Alert>}
      
      <Grid container spacing={2} alignItems="center">
        {/* Category Filter */}
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth size="small" sx={{width:250}}>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              label="Category"
              onChange={(e) => setSelectedCategory(e.target.value)}
               MenuProps={{
      PaperProps: {
        sx: {

          width: 340       
        }
      }
    }} >
              <MenuItem value="">All Categories</MenuItem>
              {categoryOptions.map((subCategory, index) => (
                <MenuItem key={index} value={subCategory}>{subCategory}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Investment Range Filter */}
        <Grid item xs={12} sm={6} md={2} sx={{width:250}}>
          <FormControl fullWidth size="small">
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
        </Grid>

        {/* Country Filter */}
        <Grid item xs={12} sm={6} md={2}sx={{width:250}}>
          <FormControl fullWidth size="small">
            <InputLabel>Country</InputLabel>
            <Select
              value={selectedCountry}
              label="Country"
              onChange={handleCountryChange}
              disabled={isLoading}
            >
              <MenuItem value="">Select Country</MenuItem>
              {countries.map((country, index) => (
                <MenuItem key={index} value={country.country}>
                  {country.country}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* State Filter */}
        <Grid item xs={12} sm={6} md={2}sx={{width:250}}>
          <FormControl fullWidth size="small">
            <InputLabel>State</InputLabel>
            <Select
              value={selectedState}
              label="State"
              onChange={handleStateChange}
              disabled={!selectedCountry || isLoading}
            >
              <MenuItem value="">Select State</MenuItem>
              {states.map((state, index) => (
                <MenuItem key={index} value={state.name}>
                  {state.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* City Filter */}
        <Grid item xs={12} sm={6} md={2}sx={{width:250}}>
          <FormControl fullWidth size="small">
            <InputLabel>City</InputLabel>
            <Select
              value={selectedLocation}
              label="City"
              onChange={handleLocationChange}
              disabled={!selectedState || isLoading}
            >
              <MenuItem value="">Select City</MenuItem>
              {cities.map((city, index) => (
                <MenuItem key={index} value={city}>
                  {city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Start Date */}
        <Grid item xs={12} sm={6} md={3}sx={{width:250}}>
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder='YYYY-MM-DD'
            inputProps={{
              pattern: "\\d{4}-\\d{2}-\\d{2}"
            }}
            InputLabelProps={{ shrink: true }}
            fullWidth
            size="small"
          />
        </Grid>

        {/* End Date */}
        <Grid item xs={12} sm={6} md={3} sx={{width:250}}>
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
             placeholder="YYYY-MM-DD"
  inputProps={{
    pattern: "\\d{4}-\\d{2}-\\d{2}" 
  }}
            InputLabelProps={{ shrink: true }}
            fullWidth
            size="small"
          />
        </Grid>
      </Grid>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
          <CircularProgress size={24} />
        </Box>
      )}
    </Box>
  );
};

export default FilterOption;