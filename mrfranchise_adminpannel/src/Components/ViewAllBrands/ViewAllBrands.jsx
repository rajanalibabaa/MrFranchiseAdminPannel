import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SidebarAdmin from '../../Pages/dashboardOutlet/SidebarAdmin';
import { GetApiCall } from '../../api/default/GetApi';
import { Api } from '../../api/apiurl';

const ViewAllBrands = () => {
  const [brandsData, setBrandsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook for navigation

  const fetchBrands = async () => {
    try {
      const response = await GetApiCall(Api.admin.get.user.usersCount);
      console.log('API Response:', response.data);
      setBrandsData(response.data?.data || {});
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box display="flex">
      {/* Sidebar */}
      <SidebarAdmin />

      {/* Main Content */}
      <Box p={4} flexGrow={1}>
        <Typography variant="h4" gutterBottom>
          All Brands
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Card
              onClick={() => navigate('/admin/brands')}
              sx={{ cursor: 'pointer', transition: '0.3s', '&:hover': { boxShadow: 6 } }}
            >
              <CardContent>
                <Typography variant="h6">Total Brands</Typography>
                <Typography variant="h4" color="primary">
                  {brandsData.brandsCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card
              onClick={() => navigate('/admin/new-brands')}
              sx={{ cursor: 'pointer', transition: '0.3s', '&:hover': { boxShadow: 6 } }}
            >
              <CardContent>
                <Typography variant="h6">New Brands</Typography>
                <Typography variant="h4" color="secondary">
                  {brandsData.newBrandsCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card
              onClick={() => navigate('/admin/investors')}
              sx={{ cursor: 'pointer', transition: '0.3s', '&:hover': { boxShadow: 6 } }}
            >
              <CardContent>
                <Typography variant="h6">Investors</Typography>
                <Typography variant="h4" color="success.main">
                  {brandsData.investorsCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ViewAllBrands;
