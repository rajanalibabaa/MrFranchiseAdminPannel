// src/Pages/Admin/InvestorViewPage.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Paper,
} from '@mui/material';
import axios from 'axios';
const InvestorViewPage = () => {
const { uuid } = useParams();
  const [investor, setInvestor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

 useEffect(() => {
    const fetchInvestor = async () => {
      try {
        const res = await axios.get(`https://mrfranchisebackend.mrfranchise.in/api/v1/investor/getInvestorByUUID/${uuid}`);
        console.log('API response:', res.data);
        setInvestor(res.data?.data);
      } catch (err) {
        setError('Failed to load investor');
      } finally {
        setLoading(false);
      }
    };

    fetchInvestor();
  }, [uuid]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!investor) return <Typography>No investor found</Typography>;

 const renderCategory = (cat) => {
    if (!cat) return 'N/A';
    if (typeof cat === 'string') return cat;
    if (Array.isArray(cat)) {
      return cat
        .map(renderCategory)
        .filter(Boolean)
        .join(', ');
    }
    // If object with main/sub/child
    return [cat.main, cat.sub, cat.child].filter(Boolean).join(' > ') || 'N/A';
  };

  const fields = [
    { label: 'First Name', value: investor.firstName },
    { label: 'Email', value: investor.email },
    { label: 'Mobile Number', value: investor.mobileNumber },
    { label: 'WhatsApp Number', value: investor.whatsappNumber },
    { label: 'Address', value: investor.address },
    { label: 'Pincode', value: investor.pincode },
    { label: 'Country', value: investor.country },
    { label: 'State', value: investor.state },
    { label: 'City', value: investor.city },
    {
      label: 'Categories',
      value: renderCategory(investor.categories),
    },
    { label: 'Investment Range', value: investor.investmentRange },
    { label: 'Investment Amount', value: investor.investmentAmount },
    { label: 'Occupation', value: investor.occupation },
    { label: 'Other Occupation', value: investor.otherOccupation },
    { label: 'Property Type', value: investor.propertyType },
    { label: 'Property Size', value: investor.propertySize },
    { label: 'Property Country', value: investor.propertyCountry },
    { label: 'Property State', value: investor.propertyState },
    { label: 'Property City', value: investor.propertyCity },
    { label: 'Preferred State', value: investor.preferredState },
    { label: 'Preferred District', value: investor.preferredDistrict },
    { label: 'Preferred City', value: investor.preferredCity },
    { label: 'Terms Accepted', value: investor.terms ? 'Yes' : 'No' },
  ];

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Investor Details
      </Typography>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container spacing={2}>
          {fields.map((field, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Typography variant="subtitle2" color="textSecondary">
                {field.label}
              </Typography>
              <Typography variant="body1">{field.value || 'N/A'}</Typography>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default InvestorViewPage;
