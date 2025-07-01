import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  FormControl,
    TableCell,
    TableBody,
    Button,
  InputLabel,
  TableContainer,
  Table,
  Paper,
    TableHead,
    TableRow,
  Select,
  MenuItem,
  Stack,
} from '@mui/material';
import SidebarAdmin from '../SidebarAdmin';

const InvestorManage = () => {
  const [investors, setInvestors] = useState([]);
  const [filteredInvestors, setFilteredInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dropdown states
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [range, setRange] = useState('');

  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        const response = await axios.get(
          'https://franchise-backend-wgp6.onrender.com/api/admin/getAllInvestors'
        );
        const data = response.data?.data || [];
        setInvestors(data);
        setFilteredInvestors(data);
      } catch (err) {
        setError('Failed to fetch investors');
      } finally {
        setLoading(false);
      }
    };

    fetchInvestors();
  }, []);

useEffect(() => {
  const getRangeLimits = (rangeValue) => {
    switch (rangeValue) {
      case "Below-50,000":
        return { min: 0, max: 50000 };
      case "Rs.50,000-2L":
        return { min: 50000, max: 200000 };
      case "Rs.2L-5L":
        return { min: 200000, max: 500000 };
      case "Rs.5L-10L":
        return { min: 500000, max: 1000000 };
      case "Rs.10L-20L":
        return { min: 1000000, max: 2000000 };
      case "Rs.20L-30L":
        return { min: 2000000, max: 3000000 };
      case "Rs.30L-50L":
        return { min: 3000000, max: 5000000 };
      case "Rs.50L-1Cr":
        return { min: 5000000, max: 10000000 };
      case "Rs.1Cr-2Cr":
        return { min: 10000000, max: 20000000 };
      case "Rs.2Cr-5Cr":
        return { min: 20000000, max: 50000000 };
      case "Rs.5Cr-above":
        return { min: 50000000, max: Infinity };
      default:
        return null;
    }
  };

 const filtered = investors.filter((inv) => {
  const categoryValue = typeof inv.category === 'string'
    ? inv.category.toLowerCase()
    : inv.category?.main?.toLowerCase?.() || '';

  const locationValue = (inv.state || '').toLowerCase();
  const matchCategory = category ? categoryValue.includes(category.toLowerCase()) : true;
  const matchLocation = location ? locationValue.includes(location.toLowerCase()) : true;
    let matchRange = false;
    if (range) {
      const limits = getRangeLimits(range);
      // Remove commas and parse as number
      const investment = Number((inv.investment || '0').toString().replace(/,/g, ''));
      matchRange = investment >= limits.min && investment < limits.max;
    }

    // If no filter is selected, show all
    if (!category && !location && !range) return true;

    // Show if any filter matches
    return matchCategory || matchLocation || matchRange;
  });

  setFilteredInvestors(filtered);
}, [category, location, range, investors]);

const uniqueCategories = [
  ...new Set(
    investors.map((i) =>
      typeof i.category === 'string' ? i.category :
      i.category?.main || null
    ).filter(Boolean)
  ),
];
  const uniqueLocations = [...new Set(investors.map((i) => i.state).filter(Boolean))];

  return (
    <Box display="flex">
      <SidebarAdmin />
      <Box flex={1} p={4}>
        {loading ? (
          <Box display="flex" justifyContent="center" mt={5}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box display="flex" justifyContent="center" mt={5}>
            <Alert severity="error">{error}</Alert>
          </Box>
        ) : (
          <>
            <Typography variant="h4" gutterBottom sx={{textAlign:'center', mb: 4}}>
              Investor Details
            </Typography>

        
            <Stack direction="row" spacing={2} mb={4} sx={{textAlign:'center', justifyContent: 'center'}}>
              {/* Category */}
              <FormControl sx={{ minWidth: 160 }}>
                <InputLabel>Category</InputLabel>
                <Select value={category} onChange={(e) => setCategory(e.target.value)} label="Category">
                  <MenuItem value="">All</MenuItem>
                  {uniqueCategories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Location */}
              <FormControl sx={{ minWidth: 160 }}>
                <InputLabel>Location</InputLabel>
                <Select value={location} onChange={(e) => setLocation(e.target.value)} label="Location">
                  <MenuItem value="">All</MenuItem>
                  {uniqueLocations.map((loc) => (
                    <MenuItem key={loc} value={loc}>
                      {loc}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Range */}
              <FormControl sx={{ minWidth: 180 }}>
                <InputLabel>Investment Range</InputLabel>
                <Select value={range} onChange={(e) => setRange(e.target.value)} label="Investment Range">
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
                </Select>
              </FormControl>
            </Stack>
{filteredInvestors.length === 0 ? (
              <Typography>No investors match the selected filters.</Typography>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                        <TableCell><strong>S.No</strong></TableCell>
                      <TableCell><strong>Name</strong></TableCell>
                      <TableCell><strong>Email</strong></TableCell>
                      <TableCell><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredInvestors.map((inv, index) => (
                      <TableRow key={inv._id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{inv.firstName || 'N/A'}</TableCell>
                        <TableCell>{inv.email || 'N/A'}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Button
                              variant="outlined"
                              color="primary"
                              size="small"
                              onClick={() => handleView(inv)}
                            >
                              View
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={() => handleDelete(inv._id)}
                            >
                              Delete
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default InvestorManage;
