import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const InstantApplyFilters = ({
  cities,
  districts,
  investmentRanges,
  states,
  selectedCity,
  setSelectedCity,
  selectedDistrict,
  setSelectedDistrict,
  selectedRange,
  setSelectedRange,
  selectedState,
  setSelectedState,
  searchTerm,
  setSearchTerm,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  handleChange,
  handleClear,
  clearFilterloading,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        mb: 2,
        alignItems: "center",
      }}
    >
      {/* Search */}
      <TextField
        size="small"
        label="Search"
        variant="outlined"
        value={searchTerm}
        onChange={(e) =>
          handleChange("searchTerm", e.target.value, setSearchTerm)
        }
        sx={{ minWidth: 200 }}
      />

      {/* State */}
      {states.length > 0 && (
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>State</InputLabel>
          <Select
            value={selectedState}
            onChange={(e) =>
              handleChange("state", e.target.value, setSelectedState)
            }
            label="State"
          >
            {states.map((state, i) => (
              <MenuItem key={i} value={state}>
                {state}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* District */}
      {districts.length > 0 && (
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>District</InputLabel>
          <Select
            value={selectedDistrict}
            onChange={(e) =>
              handleChange("district", e.target.value, setSelectedDistrict)
            }
            label="District"
          >
            {districts.map((d, i) => (
              <MenuItem key={i} value={d}>
                {d}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* City */}
      {cities.length > 0 && (
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>City</InputLabel>
          <Select
            value={selectedCity}
            onChange={(e) =>
              handleChange("city", e.target.value, setSelectedCity)
            }
            label="City"
          >
            {cities.map((city, i) => (
              <MenuItem key={i} value={city}>
                {city}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* Investment Range */}
      {investmentRanges.length > 0 && (
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Investment Range</InputLabel>
          <Select
            value={selectedRange}
            onChange={(e) =>
              handleChange("investmentRange", e.target.value, setSelectedRange)
            }
            label="Investment Range"
          >
            {investmentRanges.map((range, i) => (
              <MenuItem key={i} value={range}>
                {range}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* Date Filters */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="From Date"
          value={fromDate ? dayjs(fromDate) : null}
          onChange={(newDate) =>
            handleChange(
              "fromDate",
              newDate ? dayjs(newDate).format("YYYY-MM-DD") : "",
              setFromDate
            )
          }
          slotProps={{ textField: { size: "small", sx: { minWidth: 160 } } }}
        />
        <DatePicker
          label="To Date"
          value={toDate ? dayjs(toDate) : null}
          onChange={(newDate) =>
            handleChange(
              "toDate",
              newDate ? dayjs(newDate).format("YYYY-MM-DD") : "",
              setToDate
            )
          }
          slotProps={{ textField: { size: "small", sx: { minWidth: 160 } } }}
        />
      </LocalizationProvider>

      {/* Clear Button */}
      <Button
        variant="outlined"
        color="secondary"
        size="small"
        onClick={handleClear}
        sx={{ minWidth: 100 }}
      >
        {clearFilterloading ? "loading..." : "Clear"}
      </Button>
    </Box>
  );
};

export default InstantApplyFilters;
