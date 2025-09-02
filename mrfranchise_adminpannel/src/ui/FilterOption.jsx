import React, { useMemo } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  CircularProgress,
  Grid,
} from "@mui/material";

const FilterOption = ({
  allDetails = [],
  selectedCategory = "",
  setSelectedCategory,
  selectedInvestmentRange = "",
  setSelectedInvestmentRange,
  selectedLocation = "",
  setSelectedLocation,
  startDate = "",
  setStartDate,
  endDate = "",
  setEndDate,
  selectedState = "",
  setSelectedState,
  loading = false,
  error = "",
}) => {
  /** -------- Extract unique options -------- **/
  const categoryOptions = useMemo(() => {
    const categories = [];
    allDetails.forEach((detail) => {
      detail?.preferences?.forEach((pref) => {
        pref?.category?.forEach((cat) => {
          if (cat?.child) {
            const clean = cat.child.trim();
            if (!categories.includes(clean)) {
              categories.push(clean);
            }
          }
        });
      });
    });
    return categories;
  }, [allDetails]);

  const investmentRanges = useMemo(() => {
    const ranges = [];
    allDetails.forEach((detail) => {
      const investment = detail?.preferences?.[0]?.investmentAmount?.trim();
      if (investment && !ranges.includes(investment)) {
        ranges.push(investment);
      }
    });
    return ranges;
  }, [allDetails]);

  const states = useMemo(() => {
    const unique = [];
    allDetails.forEach((detail) => {
      const st = (detail.state || detail.preferredState || "").trim();
      if (st && !unique.includes(st)) {
        unique.push(st);
      }
    });
    return unique;
  }, [allDetails]);

  const cities = useMemo(() => {
    const unique = [];
    allDetails.forEach((detail) => {
      const st = (detail.state || detail.preferredState || "").trim();
      const ct =
        (detail.city ||
          detail.preferredCity ||
          detail.preferredDistrict ||
          ""
        ).trim();
      if (ct && (!selectedState || st === selectedState) && !unique.includes(ct)) {
        unique.push(ct);
      }
    });
    return unique;
  }, [allDetails, selectedState]);

  const isLoading = loading;
  const hasError = error;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
      {hasError && (
        <Alert severity="error" sx={{ mb: 1 }}>
          {hasError}
        </Alert>
      )}

      <Grid container spacing={2}>
        {/* Category */}
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <FormControl fullWidth size="small" sx={{ width: 250 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categoryOptions.map((cat, i) => (
                <MenuItem key={i} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Investment */}
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <FormControl fullWidth size="small" sx={{ width: 250 }}>
            <InputLabel>Investment Range</InputLabel>
            <Select
              value={selectedInvestmentRange}
              onChange={(e) => setSelectedInvestmentRange(e.target.value)}
            >
              <MenuItem value="">All Ranges</MenuItem>
              {investmentRanges.map((range, i) => (
                <MenuItem key={i} value={range}>
                  {range}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* State */}
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <FormControl fullWidth size="small" sx={{ width: 250 }}>
            <InputLabel>State</InputLabel>
            <Select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedLocation(""); // reset city if state changes
              }}
            >
              <MenuItem value="">Select State</MenuItem>
              {states.map((st, i) => (
                <MenuItem key={i} value={st}>
                  {st}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* City */}
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <FormControl fullWidth size="small" sx={{ width: 250 }}>
            <InputLabel>City</InputLabel>
            <Select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              disabled={!cities.length}
            >
              <MenuItem value="">Select City</MenuItem>
              {cities.map((ct, i) => (
                <MenuItem key={i} value={ct}>
                  {ct}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Start Date */}
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <TextField
            fullWidth
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
            sx={{ width: 250 }}
          />
        </Grid>

        {/* End Date */}
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <TextField
            fullWidth
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
            sx={{ width: 250 }}
          />
        </Grid>
      </Grid>

      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
    </Box>
  );
};

export default FilterOption;
