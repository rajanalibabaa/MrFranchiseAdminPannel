import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Button,
  Box,
  TextField,
  IconButton
} from '@mui/material';
import { Refresh, Search, Edit, Delete } from '@mui/icons-material';

const BrandListing = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/v1/brandlisting/getAllBrandListing');
      setBrands(response.data.data); // Assuming the response has a data property with the array of brands
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch brands');
      console.error('Error fetching brands:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

 // ...existing code...
  const filteredBrands = brands.filter(brand =>
    (brand.name && brand.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (brand.description && brand.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
// ...existing code...

  const handleRefresh = () => {
    fetchBrands();
  };

  const handleEdit = (brandId) => {
    // Implement edit functionality
    console.log('Edit brand with ID:', brandId);
  };

  const handleDelete = (brandId) => {
    // Implement delete functionality
    console.log('Delete brand with ID:', brandId);
  };

  if (loading && brands.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="200px">
        <Typography color="error">{error}</Typography>
        <Button variant="contained" color="primary" onClick={fetchBrands} startIcon={<Refresh />}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h2">
          Brand Listings
        </Typography>
        <Box display="flex" alignItems="center">
          <TextField
            size="small"
            placeholder="Search brands..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1 }} />
            }}
            sx={{ mr: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleRefresh}
            startIcon={<Refresh />}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Logo</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBrands.length > 0 ? (
              filteredBrands.map((brand) => (
                <TableRow key={brand._id}>
                  <TableCell>
                    {brand.logo ? (
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        style={{ width: 50, height: 50, objectFit: 'contain' }}
                      />
                    ) : (
                      'No logo'
                    )}
                  </TableCell>
                  <TableCell>{brand.name}</TableCell>
                  <TableCell>{brand.description || 'N/A'}</TableCell>
                  <TableCell>{brand.category || 'N/A'}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEdit(brand._id)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(brand._id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  {searchTerm ? 'No matching brands found' : 'No brands available'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default BrandListing;