import React from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchFilterOptions,
  resetChildCategories,
  resetDistricts,
  resetCities,
  clearErrors
} from '../../../Redux/Slices/filterDropdownData';
import { Margin } from '@mui/icons-material';

const BrandFilter = ({ filters, onFilterChange }) => {
  const dispatch = useDispatch();
  const filterData = useSelector((state) => state.filterDropdown);

  // Fetch initial filter data on component mount
  React.useEffect(() => {
    dispatch(fetchFilterOptions());
  }, [dispatch]);

  // Fetch child categories when subcategory changes
  React.useEffect(() => {
    if (filters.subcat) {
      dispatch(fetchFilterOptions({ sub: filters.subcat }));
    } else {
      dispatch(resetChildCategories());
    }
  }, [filters.subcat, dispatch]);

  // Fetch districts when state changes
  React.useEffect(() => {
    if (filters.state) {
      dispatch(fetchFilterOptions({ state: filters.state }));
    } else {
      dispatch(resetDistricts());
    }
  }, [filters.state, dispatch]);

  // Fetch cities when district changes
  React.useEffect(() => {
    if (filters.district) {
      dispatch(fetchFilterOptions({ district: filters.district }));
    } else {
      dispatch(resetCities());
    }
  }, [filters.district, dispatch]);

  // Handle filter changes
  const handleFilterChange = (filterName) => (event) => {
    const value = event.target.value;
    onFilterChange(filterName, value);
  };

  // Reset all filters
  const handleReset = () => {
    // Reset all filter values to null/empty
    onFilterChange("maincat", null);
    onFilterChange("subcat", null);
    onFilterChange("childcat", null);
    onFilterChange("state", null);
    onFilterChange("district", null);
    onFilterChange("city", null);
    onFilterChange("investmentRange", null);
    dispatch(clearErrors());
  };

  // Helper function to get display value for investment range
  const getInvestmentRangeDisplay = (range) => {
    if (!range) return '';
    
    if (typeof range === 'string') return range;
    if (range.name) return range.name;
    if (range.label) return range.label;
    if (range.value) return range.value;
    if (range.range) return range.range;
    
    return JSON.stringify(range);
  };

  // Helper function to get value for investment range
  const getInvestmentRangeValue = (range) => {
    if (!range) return '';
    
    if (range._id) return range._id;
    if (range.id) return range.id;
    if (range.value) return range.value;
    
    return range;
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 1, mt: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <FilterListIcon sx={{ mr: 1 }} />
        <Typography variant="h6" component="h2">
          Filters
        </Typography>
        <Box style={{ margin: "0 1rem", width: "70%" }}>
          <Box >
            <input
              type="text"
              placeholder="Search brands..."
              value={filters.serchterm || ""}
              onChange={(e) => onFilterChange("serchterm", e.target.value)}
              style={{ 
                padding: "8px 12px", 
                borderRadius: "4px", 
                border: "1px solid #706161ff",
                width: "100%",
                maxWidth: "400px"
              }}
            />
          </Box>
        </Box>
 
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
              value={filters.maincat || ''}
              label="Main Category"
              onChange={handleFilterChange('maincat')}
              disabled={filterData.loading}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {filterData.mainCategories.map((category) => (
                <MenuItem key={category._id || category} value={category._id || category}>
                  {category.name || category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Sub Category */}
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth sx={{ width: '145px' }} size="small" disabled={!filters.maincat || filterData.loading}>
            <InputLabel>Sub Category</InputLabel>
            <Select
              value={filters.subcat || ''}
              label="Sub Category"
              onChange={handleFilterChange('subcat')}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {filterData.subCategories.map((sub) => (
                <MenuItem key={sub._id || sub} value={sub._id || sub}>
                  {sub.name || sub}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Child Category */}
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth sx={{ width: '145px' }} size="small" disabled={!filters.subcat || filterData.loadingChildCategories}>
            <InputLabel>Child Category</InputLabel>
            <Select
              value={filters.childcat || ''}
              label="Child Category"
              onChange={handleFilterChange('childcat')}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {filterData.childCategories.map((child) => (
                <MenuItem key={child._id || child} value={child._id || child}>
                  {child.name || child}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* State */}
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth sx={{ width: '145px' }} size="small" disabled={filterData.loading}>
            <InputLabel>State</InputLabel>
            <Select
              value={filters.state || ''}
              label="State"
              onChange={handleFilterChange('state')}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {filterData.states.map((state) => (
                <MenuItem key={state._id || state} value={state._id || state}>
                  {state.name || state}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* District */}
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth sx={{ width: '145px' }} size="small" disabled={!filters.state || filterData.loadingDistricts}>
            <InputLabel>District</InputLabel>
            <Select
              value={filters.district || ''}
              label="District"
              onChange={handleFilterChange('district')}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {filterData.districts.map((district) => (
                <MenuItem key={district._id || district} value={district._id || district}>
                  {district.name || district}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* City */}
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth sx={{ width: '145px' }} size="small" disabled={!filters.district || filterData.loadingCities}>
            <InputLabel>City</InputLabel>
            <Select
              value={filters.city || ''}
              label="City"
              onChange={handleFilterChange('city')}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {filterData.cities.map((city) => (
                <MenuItem key={city._id || city} value={city._id || city}>
                  {city.name || city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Investment Range Dropdown */}
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth sx={{ width: '145px' }} size="small" disabled={filterData.loading}>
            <InputLabel>Investment Range</InputLabel>
            <Select
              value={filters.investmentRange || ''}
              label="Investment Range"
              onChange={handleFilterChange('investmentRange')}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {filterData.investmentRanges.map((range) => (
                <MenuItem 
                  key={getInvestmentRangeValue(range)} 
                  value={getInvestmentRangeValue(range)}
                >
                  {getInvestmentRangeDisplay(range)}
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