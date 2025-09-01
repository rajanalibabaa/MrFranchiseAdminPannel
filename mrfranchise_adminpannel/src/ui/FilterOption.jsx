import React, { useMemo, useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  Grid,
  Button,
  Paper,
  Typography,
  IconButton,
  Drawer,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import CloseIcon from "@mui/icons-material/Close";

const FilterOption = ({
  allDetails = [],
  selectedMainCategory = "",
  setSelectedMainCategory,
  selectedSubCategory = "",
  setSelectedSubCategory,
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
  // State for Drawer visibility
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Main Categories
  const mainCategoryOptions = useMemo(() => {
    const unique = [];
    allDetails.forEach((detail) => {
      detail?.preferences?.forEach((pref) => {
        pref?.category?.forEach((cat) => {
          if (cat.main) {
            const clean = cat.main.trim();
            if (!unique.includes(clean)) unique.push(clean);
          }
        });
      });
    });
    return unique;
  }, [allDetails]);

  // Sub Categories
  const subCategoryOptions = useMemo(() => {
    const unique = [];
    if (!selectedMainCategory) return unique;
    allDetails.forEach((detail) => {
      detail?.preferences?.forEach((pref) => {
        pref?.category?.forEach((cat) => {
          if (cat?.sub && cat.main?.trim() === selectedMainCategory.trim()) {
            const clean = cat.sub.trim();
            if (!unique.includes(clean)) unique.push(clean);
          }
        });
      });
    });
    return unique;
  }, [allDetails, selectedMainCategory]);

  // Child Categories
  const categoryOptions = useMemo(() => {
    const unique = [];
    if (!selectedSubCategory) return unique;
    allDetails.forEach((detail) => {
      detail?.preferences?.forEach((pref) => {
        pref?.category?.forEach((cat) => {
          if (cat?.child && cat.sub?.trim() === selectedSubCategory.trim()) {
            const clean = cat.child.trim();
            if (!unique.includes(clean)) unique.push(clean);
          }
        });
      });
    });
    return unique;
  }, [allDetails, selectedSubCategory]);

  // Investment Ranges
  const investmentRanges = useMemo(() => {
    const unique = [];
    allDetails.forEach((detail) => {
      const investment = detail?.preferences?.[0]?.investmentAmount?.trim();
      if (investment && !unique.includes(investment)) {
        unique.push(investment);
      }
    });
    return unique;
  }, [allDetails]);

  // States
  const states = useMemo(() => {
    const unique = [];
    allDetails.forEach((detail) => {
      const st =
        (detail.state || detail.preferences?.[0]?.preferredState || "").trim();
      if (st && !unique.includes(st)) {
        unique.push(st);
      }
    });
    return unique;
  }, [allDetails]);

  // Cities
  const cities = useMemo(() => {
    const unique = [];
    allDetails.forEach((detail) => {
      const st =
        (detail.state || detail.preferences?.[0]?.preferredState || "").trim();
      const ct =
        (
          detail.city ||
          detail.preferences?.[0]?.preferredCity ||
          detail.preferences?.[0]?.preferredDistrict ||
          ""
        ).trim();
      if (
        ct &&
        (!selectedState || st === selectedState) &&
        !unique.includes(ct)
      ) {
        unique.push(ct);
      }
    });
    return unique;
  }, [allDetails, selectedState]);

  // Clear all filters handler
  const handleClearFilters = () => {
    setSelectedMainCategory("");
    setSelectedSubCategory("");
    setSelectedCategory("");
    setSelectedInvestmentRange("");
    setSelectedState("");
    setSelectedLocation("");
    setStartDate("");
    setEndDate("");
    setDrawerOpen(false); 
  };

  // Filter content to be reused in both mobile and desktop views
  const filterContent = (
    <Box sx={{ p: { xs: 2, sm: 0 } }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Grid container spacing={0.5} direction={{ xs: "column", sm: "row" }} wrap="wrap">
        {/* Main Category */}
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          sx={{
            mb: { xs: 2, sm: 0 },
            width: { xs: "100%", sm: "50%", md: "25%", lg: "12%" },
            [theme => theme.breakpoints.down("sm")]: { mb: 1 },
          }}
        >
          <FormControl fullWidth size="small">
            <InputLabel>Main Category</InputLabel>
            <Select
              value={selectedMainCategory}
              onChange={(e) => {
                setSelectedMainCategory(e.target.value);
                setSelectedSubCategory("");
                setSelectedCategory("");
                setDrawerOpen(false);
              }}
              label="Main Category"
            >
              <MenuItem value="">All Main Categories</MenuItem>
              {mainCategoryOptions.map((cat, i) => (
                <MenuItem key={i} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Sub Category */}
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          sx={{
             mb: { xs: 2, sm: 0 },
            width: { xs: "100%", sm: "50%", md: "25%", lg: "12%" },
            [theme => theme.breakpoints.down("sm")]: { mb: 1 },
          }}
        >
          <FormControl fullWidth size="small" disabled={!subCategoryOptions.length}>
            <InputLabel>Sub Category</InputLabel>
            <Select
              value={selectedSubCategory}
              onChange={(e) => {
                setSelectedSubCategory(e.target.value);
                setSelectedCategory("");
                setDrawerOpen(false); 
              }}
              label="Sub Category"
            >
              <MenuItem value="">All Sub Categories</MenuItem>
              {subCategoryOptions.map((sub, i) => (
                <MenuItem key={i} value={sub}>
                  {sub}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Child Category */}
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          sx={{
             mb: { xs: 2, sm: 0 },
            width: { xs: "100%", sm: "50%", md: "25%", lg: "12%" },
            [theme => theme.breakpoints.down("sm")]: { mb: 1 },
          }}
        >
          <FormControl fullWidth size="small" disabled={!categoryOptions.length}>
            <InputLabel>Child Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setDrawerOpen(false); // Auto-close Drawer
              }}
              label="Child Category"
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

        {/* Investment Range */}
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          sx={{
             mb: { xs: 2, sm: 0 },
            width: { xs: "100%", sm: "50%", md: "25%", lg: "12%" },
            [theme => theme.breakpoints.down("sm")]: { mb: 1 },
          }}
        >
          <FormControl fullWidth size="small">
            <InputLabel>Investment Range</InputLabel>
            <Select
              value={selectedInvestmentRange}
              onChange={(e) => {
                setSelectedInvestmentRange(e.target.value);
                setDrawerOpen(false); // Auto-close Drawer
              }}
              label="Investment Range"
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
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          sx={{
             mb: { xs: 2, sm: 0 },
            width: { xs: "100%", sm: "50%", md: "25%", lg: "12%" },
            [theme => theme.breakpoints.down("sm")]: { mb: 1 },
          }}
        >
          <FormControl fullWidth size="small">
            <InputLabel>State</InputLabel>
            <Select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedLocation("");
                setDrawerOpen(false); // Auto-close Drawer
              }}
              label="State"
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
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          sx={{
             mb: { xs: 2, sm: 0 },
            width: { xs: "100%", sm: "50%", md: "25%", lg: "12%" },
            [theme => theme.breakpoints.down("sm")]: { mb: 1 },
          }}
        >
          <FormControl fullWidth size="small" disabled={!cities.length}>
            <InputLabel>City</InputLabel>
            <Select
              value={selectedLocation}
              onChange={(e) => {
                setSelectedLocation(e.target.value);
                setDrawerOpen(false); // Auto-close Drawer
              }}
              label="City"
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
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          sx={{
             mb: { xs: 2, sm: 0 },
            width: { xs: "100%", sm: "50%", md: "25%", lg: "12%" },
            [theme => theme.breakpoints.down("sm")]: { mb: 1 },
          }}
        >
          <TextField
            fullWidth
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setDrawerOpen(false); 
            }}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
        </Grid>

        {/* End Date */}
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          sx={{
             mb: { xs: 1, sm: 0 },
            width: { xs: "100%", sm: "50%", md: "25%", lg: "12%" },
            [theme => theme.breakpoints.down("sm")]: { mb: 1 },
          }}
        >
          <TextField
            fullWidth
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setDrawerOpen(false); // Auto-close Drawer
            }}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
        </Grid>
      </Grid>
      
      {/* Clear Filters Button - Now part of filterContent */}
      <Box
        sx={{
          mt: 2,
          display: "flex",
          justifyContent: "flex-end",
          [theme => theme.breakpoints.down("sm")]: {
            justifyContent: "center",
            mb: 1
          }
        }}
      >
        <Button
          variant="outlined"
          color="error"
          onClick={handleClearFilters}
          startIcon={<SearchOffIcon />}
          sx={{ textTransform: "none" }}
        >
          Clear Filters
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          display: { xs: "flex", sm: "none" },
          alignItems: "center",
          justifyContent: "flex-start",
          mb: 2,
          p: 2,
          background: "#f9fafb",
          borderRadius: 3,
        }}
      >
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setDrawerOpen(true)}
          startIcon={<FilterListIcon />}
          sx={{ textTransform: "none" }}
        >
          Filter
        </Button>
      </Box>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            width: "80%",
            maxWidth: 300,
            p: 2,
            background: "#f9fafb",
            borderRadius: "0 8px 8px 0",
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Filters
          </Typography>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
         <Typography
    variant="h6"
    sx={{
      fontWeight: 600,
      mb: 2,
      display: "flex",
      alignItems: "center",
      gap: 1,
    }}
  >
    <FilterListIcon fontSize="medium" color="primary" />
    Filter
  </Typography>
        {filterContent}
      </Drawer>
      <Paper
        elevation={2}
        sx={{
          display: { xs: "none", sm: "block" },
          p: 2,
          borderRadius: 3,
          mt: 2,
          background: "#f9fafb",
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FilterListIcon fontSize="medium" color="primary" />
            Filter
          </Box>
        </Typography>
        {filterContent}
      </Paper>
    </>
  );
};

export default FilterOption;