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
import { useDispatch } from 'react-redux';
import { goToNewIncoming } from '../../Redux/Slices/newIncomingSlice';
import socket from '../../utils/socket';

const Count = () => {
  const [brandsData, setBrandsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const fetchBrands = async () => {
    try {
      const response = await GetApiCall(Api.admin.get.user.usersCount);
      console.log('API Response:', response.data);
      setBrandsData(response.data?.data || {});
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    socket.on("recevie", (count) => {
      console.log("📥 Updated brand count:", count);
      setBrandsData((prevData) =>(
        {...prevData,newBrandsCount:count}
      ));
      const audio = new Audio("/ting.mp3");
      audio.play();
    });

    return () => {
      socket.off("recevie");
    };
  }, []);

  const handleNavigate = (path) => {
    if (path === "newIncoming") {
        console.log("kkkk")
        dispatch(goToNewIncoming(1))
        navigate("/dashboard/getallbrands")
        return
    }
    if (path === "brands") {
        console.log("kkkk")
        dispatch(goToNewIncoming(0))
        navigate("/dashboard/getallbrands")
        return
    }
    navigate(path);
  };

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
        {/* <Typography variant="h4" gutterBottom>
          All Brands
        </Typography> */}

        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Card
              onClick={() => handleNavigate('brands')}
              sx={{
                cursor: 'pointer',
                transition: '0.3s',
                '&:hover': { boxShadow: 6 },
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6">Total Brands</Typography>
                <Typography variant="h4" color="primary">
                  {brandsData.brandsCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card
              onClick={() => handleNavigate('newIncoming')}
              sx={{
                cursor: 'pointer',
                transition: '0.3s',
                '&:hover': { boxShadow: 6 },
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6">New Incoming Brands</Typography>
                <Typography variant="h4" color="secondary">
                  {brandsData.newBrandsCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card
              onClick={() => handleNavigate('/dashboard/allinvestors')}
              sx={{
                cursor: 'pointer',
                transition: '0.3s',
                '&:hover': { boxShadow: 6 },
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6">Investors</Typography>
                <Typography variant="h4" color="warning">
                  {brandsData.investorsCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card
              onClick={() => handleNavigate('/dashboard/instantapply')}
              sx={{
                cursor: 'pointer',
                transition: '0.3s',
                '&:hover': { boxShadow: 6 },
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6">Instant Apply</Typography>
                <Typography variant="h4" color="success.main">
                  {brandsData.instantApplyCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Count;
