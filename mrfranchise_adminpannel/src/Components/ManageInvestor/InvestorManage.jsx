import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Route } from 'react-router-dom';

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SidebarAdmin from '../SidebarAdmin';
import CategorySelector from '../../Pages/BrandCategory/CategorySelector';
import InvestorViewDetails from './InvestorViewDetails';

const InvestorManage = () => {
  const navigate = useNavigate();
   const [selectedInvestor, setSelectedInvestor] = useState(null);
   const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [investors, setInvestors] = useState([]);
  const [filteredInvestors, setFilteredInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('');
  const [preferredCity, setPreferredCity] = useState('');
  const [range, setRange] = useState('');
  const [locationType, setLocationType] = useState('domestic');
  const [cityOptions, setCityOptions] = useState([]);

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
    const fetchCities = async () => {
      try {
        if (locationType === 'domestic') {
          const res = await axios.post('https://countriesnow.space/api/v0.1/countries/cities', {
            country: 'India'
          });
          const cities = res.data.data || [];
          setCityOptions(cities.sort());
        } else {
          const res = await axios.post('https://countriesnow.space/api/v0.1/countries/state/cities', {
            country: 'United States',
            state: 'California'
          });
          setCityOptions(res.data.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch city data', err);
        setCityOptions([]);
      }
    };

    fetchCities();
  }, [locationType]);

 const handleView = (uuid) => {
    navigate(`/admin/investors/${uuid}`);
  };

  const handleClose = () => {
    setOpenModal(false);
    setSelectedInvestor(null);
  };

  useEffect(() => {
    const getRangeLimits = (rangeValue) => {
      switch (rangeValue) {
        case 'Below-50,000': return { min: 0, max: 50000 };
        case 'Rs.50,000-2L': return { min: 50000, max: 200000 };
        case 'Rs.2L-5L': return { min: 200000, max: 500000 };
        case 'Rs.5L-10L': return { min: 500000, max: 1000000 };
        case 'Rs.10L-20L': return { min: 1000000, max: 2000000 };
        case 'Rs.20L-30L': return { min: 2000000, max: 3000000 };
        case 'Rs.30L-50L': return { min: 3000000, max: 5000000 };
        case 'Rs.50L-1Cr': return { min: 5000000, max: 10000000 };
        case 'Rs.1Cr-2Cr': return { min: 10000000, max: 20000000 };
        case 'Rs.2Cr-5Cr': return { min: 20000000, max: 50000000 };
        case 'Rs.5Cr-above': return { min: 50000000, max: Infinity };
        default: return null;
      }
    };

    const filtered = investors.filter((inv) => {
      const categoryValue = typeof inv.category === 'string' ? inv.category : inv.category?.main || '';
      const invCategory = categoryValue.toLowerCase();
      const selectedCategory = (category || '').toLowerCase();
      const matchCategory = category ? invCategory === selectedCategory : true;

const matchCity = preferredCity
  ? (inv.preferredCity && inv.preferredCity.trim().toLowerCase() === preferredCity.trim().toLowerCase())
  : true;

      let matchRange = true;
      if (range) {
        const limits = getRangeLimits(range);
        const investment = Number((inv.investment || '0').toString().replace(/,/g, ''));
        matchRange = investment >= limits.min && investment < limits.max;
      }

      const matchType = locationType === 'international' ? inv.country !== 'India' : inv.country === 'India';

      return matchCategory && matchCity && matchRange && matchType;
    });

    setFilteredInvestors(filtered);
  }, [category, preferredCity, range, investors, locationType]);

  return (
    <Box display="flex">
      <SidebarAdmin />
      <Box flex={1} p={4} sx={{ marginLeft: '250px' }}>
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
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
              Investor Details
            </Typography>

            <Stack direction="row" spacing={2} mb={4} sx={{ textAlign: 'center', justifyContent: 'center' }}>
              <CategorySelector category={category} setCategory={setCategory} />

              <FormControl>
                <FormLabel id="location-type-label">Location Type</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="location-type-label"
                  value={locationType}
                  onChange={(e) => {
                    setLocationType(e.target.value);
                    setPreferredCity('');
                  }}
                >
                  <FormControlLabel value="domestic" control={<Radio />} label="Domestic" />
                  <FormControlLabel value="international" control={<Radio />} label="International" />
                </RadioGroup>
              </FormControl>

              <FormControl sx={{ minWidth: 160 }}>
  <InputLabel>Preferred City</InputLabel>
  <Select
    value={preferredCity}
    onChange={(e) => setPreferredCity(e.target.value)}
    label="Preferred City"
  >
    <MenuItem value="">All</MenuItem>
    {cityOptions.map((city) => (
      <MenuItem key={city} value={city}>{city}</MenuItem>
    ))}
  </Select>
</FormControl>

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
                          <Button onClick={() => navigate(`/admin/investors/${inv.uuid}`)}>
  View Details
</Button>
                            <Button variant="outlined" color="error" size="small">
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
            {/* <Route path="/admin/investors/:id" element={<InvestorViewDetails />} /> */}
             {/* Investor Details Modal */}
{/* <Dialog open={open} onClose={() => setOpen(false)}>
  <InvestorViewDetails investor={selectedInvestor} />
</Dialog> */}
          </>
        )}
      </Box>
    </Box>
  );
};

export default InvestorManage;
