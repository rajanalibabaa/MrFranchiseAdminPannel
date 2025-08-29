import React, { useState } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  Grid,
  Divider,
  Button
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
 
const BrandFilter = () => {
  // State for all filter values
  const [filters, setFilters] = useState({
    maincategory: '',
    subcategory: '',
    childcategory: '',
    country: '',
    state: '',
    city: '',
    investmentrange: ''
  });
 
  // Sample data for dropdowns
  const mainCategories = ['Electronics', 'Fashion', 'Home & Kitchen', 'Automotive', 'Health & Beauty'];
  const subCategories = {
    'Electronics': ['Mobile Phones', 'Laptops', 'Cameras', 'Audio'],
    'Fashion': ['Men', 'Women', 'Kids', 'Accessories'],
    'Home & Kitchen': ['Furniture', 'Appliances', 'Decor', 'Cookware'],
    'Automotive': ['Car Parts', 'Bike Parts', 'Tools', 'Accessories'],
    'Health & Beauty': ['Skincare', 'Makeup', 'Haircare', 'Fragrances']
  };
  const childCategories = {
    'Mobile Phones': ['Smartphones', 'Feature Phones', 'Refurbished'],
    'Laptops': ['Gaming', 'Business', 'Ultrabooks', 'Chromebooks'],
    'Men': ['Clothing', 'Shoes', 'Accessories'],
    'Women': ['Clothing', 'Shoes', 'Accessories']
  };
  const countries = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'India'];
  const states = {
    'United States': ['California', 'Texas', 'New York', 'Florida'],
    'Canada': ['Ontario', 'Quebec', 'British Columbia', 'Alberta'],
    'United Kingdom': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
    'India': ['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi']
  };
  const cities = {
    'California': ['Los Angeles', 'San Francisco', 'San Diego'],
    'Texas': ['Houston', 'Dallas', 'Austin'],
    'New York': ['New York City', 'Buffalo', 'Rochester'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur'],
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli']
  };
 
  // Predefined investment ranges for dropdown
  const investmentRanges = [
    { label: 'All', value: '' },
    { label: '$0 - $10,000', value: '0-10000' },
    { label: '$10,001 - $25,000', value: '10001-25000' },
    { label: '$25,001 - $50,000', value: '25001-50000' },
    { label: '$50,001 - $75,000', value: '50001-75000' },
    { label: '$75,001 - $100,000', value: '75001-100000' }
  ];
 
  // Handle filter changes
  const handleFilterChange = (filterName) => (event) => {
    const value = event.target.value;
 
    // Reset dependent filters when parent changes
    if (filterName === 'maincategory') {
      setFilters({
        ...filters,
        [filterName]: value,
        subcategory: '',
        childcategory: ''
      });
    } else if (filterName === 'subcategory') {
      setFilters({
        ...filters,
        [filterName]: value,
        childcategory: ''
      });
    } else if (filterName === 'country') {
      setFilters({
        ...filters,
        [filterName]: value,
        state: '',
        city: ''
      });
    } else if (filterName === 'state') {
      setFilters({
        ...filters,
        [filterName]: value,
        city: ''
      });
    } else {
      setFilters({
        ...filters,
        [filterName]: value
      });
    }
  };
 
  // Reset all filters
  const handleReset = () => {
    setFilters({
      maincategory: '',
      subcategory: '',
      childcategory: '',
      country: '',
      state: '',
      city: '',
      investmentrange: ''
    });
  };
 
  return (
    <Paper elevation={2} sx={{ p: 2, mb: 1,mt:1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <FilterListIcon sx={{ mr: 1 }} />
        <Typography variant="h6" component="h2">
          Filters
        </Typography>
        <Button
          startIcon={<ClearIcon />}
          onClick={handleReset}
          sx={{ ml: 'auto' }}
          size="small"
        >
          Clear All
        </Button>
      </Box>
     
      <Divider sx={{ mb: 2 }} />
     
      <Grid container spacing={2}>
        {/* Main Category */}
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth sx={{ width: '145px' }} size="small">
            <InputLabel>Main Category</InputLabel>
            <Select
              value={filters.maincategory}
              label="Main Category"
              onChange={handleFilterChange('maincategory')}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {mainCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
 
        {/* Sub Category */}
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth sx={{ width: '145px' }} size="small" disabled={!filters.maincategory}>
            <InputLabel>Sub Category</InputLabel>
            <Select
              value={filters.subcategory}
              label="Sub Category"
              onChange={handleFilterChange('subcategory')}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {filters.maincategory && subCategories[filters.maincategory]?.map((sub) => (
                <MenuItem key={sub} value={sub}>
                  {sub}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
 
        {/* Child Category */}
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth sx={{ width: '145px' }} size="small" disabled={!filters.subcategory}>
            <InputLabel>Child Category</InputLabel>
            <Select
              value={filters.childcategory}
              label="Child Category"
              onChange={handleFilterChange('childcategory')}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {filters.subcategory && childCategories[filters.subcategory]?.map((child) => (
                <MenuItem key={child} value={child}>
                  {child}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
 
        {/* Country */}
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth sx={{ width: '145px' }} size="small">
            <InputLabel>Country</InputLabel>
            <Select
              value={filters.country}
              label="Country"
              onChange={handleFilterChange('country')}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {countries.map((country) => (
                <MenuItem key={country} value={country}>
                  {country}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
 
        {/* State */}
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth sx={{ width: '145px' }} size="small">
            <InputLabel>State</InputLabel>
            <Select
              value={filters.state}
              label="State"
              onChange={handleFilterChange('state')}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {filters.country && states[filters.country]?.map((state) => (
                <MenuItem key={state} value={state}>
                  {state}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
 
        {/* City */}
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth  sx={{ width: '145px' }}size="small">
            <InputLabel>City</InputLabel>
            <Select
              value={filters.city}
              label="City"
              onChange={handleFilterChange('city')}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {filters.state && cities[filters.state]?.map((city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
 
        {/* Investment Range Dropdown */}
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth sx={{ width: '145px' }} size="small">
            <InputLabel>Investment Range</InputLabel>
            <Select
              value={filters.investmentrange}
              label="Investment Range"
              onChange={handleFilterChange('investmentrange')}
            >
              {investmentRanges.map((range) => (
                <MenuItem key={range.value} value={range.value}>
                  {range.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );
};
 
export default BrandFilter;