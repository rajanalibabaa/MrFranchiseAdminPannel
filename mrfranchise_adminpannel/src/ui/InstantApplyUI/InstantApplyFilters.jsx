import React from 'react';
import {
  Grid,
  TextField,
  MenuItem,
  Button,
  Box,
  CircularProgress,
  Typography,
} from '@mui/material';
import { Clear as ClearIcon, Search as SearchIcon } from '@mui/icons-material';

const InstantApplyFilters = ({
  cities = [],
  districts = [],
  investmentRanges = [],
  categories = [], // Added categories
  industries = [], // Added industries
  states = [],
  selectedCity,
  setSelectedCity,
  selectedDistrict,
  setSelectedDistrict,
  selectedRange,
  setSelectedRange,
  selectedCategory, // Added category props
  setSelectedCategory,
  selectedIndustry, // Added industry props
  setSelectedIndustry,
  selectedState,
  setSelectedState,
  searchTerm,
  setSearchTerm,
  selectedApplyBy,
  setSelectedApplyBy,
  handleChange,
  handleClear,
  clearFilterloading,
  loading
}) => {
  
  const applyByOptions = ['Investor', 'Franchisor', 'Partner'];

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
        Filter Leads
      </Typography>
      
      <Grid container display={'grid'} gridTemplateColumns={' repeat(auto-fill, minmax(150px, 1fr))'} spacing={2}>
        {/* Search Term */}
        {/* <Grid item xs={12} sm={6} md={2}>
          <TextField
            fullWidth
            size="small"
            label="Search by Name"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => handleChange('searchTerm', e.target.value, setSearchTerm)}
            InputProps={{
              endAdornment: <SearchIcon color="action" />,
            }}
            disabled={loading}
          />
        </Grid> */}

        {/* State Filter */}
        <Grid item xs={12} sm={6} md={1.5}>
          <TextField
            select
            fullWidth
            size="small"
            label="State"
            value={selectedState}
            onChange={(e) => handleChange('state', e.target.value, setSelectedState)}
            disabled={loading}
          >
            <MenuItem value="">All States</MenuItem>
            {states.map((state, index) => (
              <MenuItem key={`state-${index}`} value={state}>
                {state}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* City Filter */}
        <Grid item xs={12} sm={6} md={1.5}>
          <TextField
            select
            fullWidth
            size="small"
            label="City"
            value={selectedCity}
            onChange={(e) => handleChange('city', e.target.value, setSelectedCity)}
            disabled={loading || !selectedState}
          >
            <MenuItem value="">All Cities</MenuItem>
            {cities.map((city, index) => (
              <MenuItem key={`city-${index}`} value={city}>
                {city}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* District Filter */}
        <Grid item xs={12} sm={6} md={1.5}>
          <TextField
            select
            fullWidth
            size="small"
            label="District"
            value={selectedDistrict}
            onChange={(e) => handleChange('district', e.target.value, setSelectedDistrict)}
            disabled={loading}
          >
            <MenuItem value="">All Districts</MenuItem>
            {districts.map((district, index) => (
              <MenuItem key={`district-${index}`} value={district}>
                {district}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Category Filter */}
        <Grid item xs={12} sm={6} md={1.5}>
          <TextField
            select
            fullWidth
            size="small"
            label="Category"
            value={selectedCategory}
            onChange={(e) => handleChange('category', e.target.value, setSelectedCategory)}
            disabled={loading}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((category, index) => (
              <MenuItem key={`category-${index}`} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Industry Filter */}
        {/* <Grid item xs={12} sm={6} md={1.5}>
          <TextField
            select
            fullWidth
            size="small"
            label="Industry"
            value={selectedIndustry}
            onChange={(e) => handleChange('industry', e.target.value, setSelectedIndustry)}
            disabled={loading}
          >
            <MenuItem value="">All Industries</MenuItem>
            {industries.map((industry, index) => (
              <MenuItem key={`industry-${index}`} value={industry}>
                {industry}
              </MenuItem>
            ))}
          </TextField>
        </Grid> */}

        {/* Investment Range Filter */}
        <Grid item xs={12} sm={6} md={1.5}>
          <TextField
            select
            fullWidth
            size="small"
            label="Investment Range"
            value={selectedRange}
            onChange={(e) => handleChange('investmentRange', e.target.value, setSelectedRange)}
            disabled={loading}
          >
            <MenuItem value="">All Ranges</MenuItem>
            {investmentRanges.map((range, index) => (
              <MenuItem key={`range-${index}`} value={range}>
                {range}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Apply By Filter */}
        {/* <Grid item xs={12} sm={6} md={1}>
          <TextField
            select
            fullWidth
            size="small"
            label="Applied By"
            value={selectedApplyBy}
            onChange={(e) => handleChange('applyBy', e.target.value, setSelectedApplyBy)}
            disabled={loading}
          >
            <MenuItem value="">All Types</MenuItem>
            {applyByOptions.map((option, index) => (
              <MenuItem key={`applyby-${index}`} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid> */}

        {/* Clear Filters Button */}
        <Grid item xs={12} sm={6} md={1}>
          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            size="small"
            onClick={handleClear}
            disabled={clearFilterloading || loading}
            startIcon={clearFilterloading ? <CircularProgress size={16} /> : <ClearIcon />}
            sx={{ height: '40px' }}
          >
            Clear
          </Button>
        </Grid>
      </Grid>

      {/* Filter Summary */}
      {(selectedState || selectedCity || selectedDistrict || selectedCategory || selectedIndustry || selectedRange || selectedApplyBy || searchTerm) && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1, border: '1px solid', borderColor: 'grey.200' }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', color: 'primary.main' }}>
            Active Filters:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {searchTerm && (
              <Box sx={{ px: 1, py: 0.5, bgcolor: 'primary.light', color: 'white', borderRadius: 1, fontSize: '0.75rem' }}>
                Name: "{searchTerm}"
              </Box>
            )}
            {selectedState && (
              <Box sx={{ px: 1, py: 0.5, bgcolor: 'info.light', color: 'white', borderRadius: 1, fontSize: '0.75rem' }}>
                State: "{selectedState}"
              </Box>
            )}
            {selectedCity && (
              <Box sx={{ px: 1, py: 0.5, bgcolor: 'success.light', color: 'white', borderRadius: 1, fontSize: '0.75rem' }}>
                City: "{selectedCity}"
              </Box>
            )}
            {selectedDistrict && (
              <Box sx={{ px: 1, py: 0.5, bgcolor: 'warning.light', color: 'white', borderRadius: 1, fontSize: '0.75rem' }}>
                District: "{selectedDistrict}"
              </Box>
            )}
            {selectedCategory && (
              <Box sx={{ px: 1, py: 0.5, bgcolor: 'secondary.light', color: 'white', borderRadius: 1, fontSize: '0.75rem' }}>
                Category: "{selectedCategory}"
              </Box>
            )}
            {selectedIndustry && (
              <Box sx={{ px: 1, py: 0.5, bgcolor: 'error.light', color: 'white', borderRadius: 1, fontSize: '0.75rem' }}>
                Industry: "{selectedIndustry}"
              </Box>
            )}
            {selectedRange && (
              <Box sx={{ px: 1, py: 0.5, bgcolor: 'grey.600', color: 'white', borderRadius: 1, fontSize: '0.75rem' }}>
                Range: "{selectedRange}"
              </Box>
            )}
            {selectedApplyBy && (
              <Box sx={{ px: 1, py: 0.5, bgcolor: 'purple', color: 'white', borderRadius: 1, fontSize: '0.75rem' }}>
                Applied by: "{selectedApplyBy}"
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default InstantApplyFilters;
