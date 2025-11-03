import React, { useState, useMemo, useEffect } from 'react';
import {
  Paper,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Chip,
  Collapse,
  IconButton,
  Divider,
  InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';

const FilterSection = ({
  filters,
  filterOptions,
  onFilterChange,
  onClearFilters,
  loading,
  activeFiltersCount
}) => {
  const [expanded, setExpanded] = useState(true);
  const [searchValue, setSearchValue] = useState(filters.search || '');

  // Debounced search handler
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchValue !== filters.search) {
        onFilterChange('search', searchValue);
      }
    }, 400);
    return () => clearTimeout(timeoutId);
  }, [searchValue, filters.search, onFilterChange]);

  const handleSearchChange = (e) => setSearchValue(e.target.value);

  const filterFields = useMemo(
    () => [
      { name: 'state', label: 'State', options: filterOptions.states || [] },
      { name: 'district', label: 'District', options: filterOptions.districts || [] },
      { name: 'investmentRange', label: 'Investment Range', options: filterOptions.investmentRanges || [] },
      { name: 'mainCategory', label: 'Industry', options: filterOptions.mainCategories || [] },
      { name: 'planToInvest', label: 'Plan to Invest', options: filterOptions.planToInvestOptions || [] },
      { name: 'readyToInvest', label: 'Ready to Invest', options: filterOptions.readyToInvestOptions || [] }
    ],
    [filterOptions]
  );

  return (
    <Paper
      elevation={3}
      sx={{
        mb: 3,
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'grey.200',
        width: '100%',
        maxWidth: '100%',
        bgcolor: '#fff',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          bgcolor: 'grey.50',
          borderBottom: '1px solid',
          borderColor: 'grey.200',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterIcon color="warning" />
          <Typography variant="h6" color="warning" fontWeight={600}>
            Search & Filter
          </Typography>
          {activeFiltersCount > 0 && (
            <Chip
              label={`${activeFiltersCount} active`}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
        </Box>

        <IconButton
          onClick={() => setExpanded(!expanded)}
          size="small"
          sx={{
            bgcolor: 'white',
            border: '1px solid',
            borderColor: 'grey.300',
            '&:hover': { bgcolor: 'grey.100' }
          }}
        >
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box
          sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%',
          }}
        >
            {/* Global Search */}
            <TextField
              fullWidth
              variant="outlined"
              label="Search investors..."
              value={searchValue}
              onChange={handleSearchChange}
              disabled={loading}
              placeholder="Name, email, phone, location..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'grey.500' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: 'white',
                },
              }}
            />
          <Grid
            container
            spacing={2}
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)',
                lg: 'repeat(7, 1fr)'
              },
              width: '100%',
            }}
          >
            

            {/* Dynamic Filter Fields */}
            {filterFields.map((field) => (
              <FormControl
                key={field.name}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: 'white',
                  },
                }}
              >
                <InputLabel>{field.label}</InputLabel>
                <Select
                  value={filters[field.name] || ''}
                  onChange={(e) => onFilterChange(field.name, e.target.value)}
                  label={field.label}
                  disabled={loading}
                  MenuProps={{
                    PaperProps: { style: { maxHeight: 300 } },
                  }}
                >
                  <MenuItem value="">
                    <em>All {field.label}s</em>
                  </MenuItem>
                  {field.options.map((option, index) => (
                    <MenuItem key={`${field.name}-${index}`} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ))}

            {/* Clear Filters */}
            <Button
              fullWidth
              variant="contained"
              color="error"
              onClick={onClearFilters}
              disabled={loading || activeFiltersCount === 0}
              startIcon={<ClearIcon />}
              sx={{
                borderRadius: 2,
                borderWidth: 2,
                height: 56,
                '&:hover': {
                  borderWidth: 2,
                  bgcolor: 'error.50',
                },
              }}
            >
              Clear All
            </Button>
          </Grid>

          {/* Active Filters Display */}
          {/* {activeFiltersCount > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Active Filters:
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    maxHeight: 120,
                    overflowY: 'auto',
                    pr: 1,
                  }}
                >
                  {Object.entries(filters).map(([key, value]) =>
                    value ? (
                      <Chip
                        key={key}
                        label={`${key.replace(/([A-Z])/g, ' $1').toLowerCase()}: ${value}`}
                        size="small"
                        onDelete={() => onFilterChange(key, '')}
                        color="primary"
                        variant="outlined"
                        sx={{ borderRadius: 2 }}
                      />
                    ) : null
                  )}
                </Box>
              </Box>
            </>
          )} */}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default FilterSection;
