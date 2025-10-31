// Components/LeadManagement/LeadToggleControl.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';
import axios from 'axios';

const LeadToggleControl = () => {
  const [leadStatus, setLeadStatus] = useState({
    isFreeLeadsBrandPaused: false,
    isPaidLeadsBrandPaused: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch current status
  const fetchLeadStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(
        'http://localhost:5000/api/v1/admin/leadsFreeAndPaidStopAndStart',
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      console.log('get',response);
      
      
      if (response.data.success) {
        setLeadStatus({
          isFreeLeadsBrandPaused: response.data.data?.isFreeLeadsBrandPaused || false,
          isPaidLeadsBrandPaused: response.data.data?.isPaidLeadsBrandPaused || false
        });
      }
    } catch (error) {
      setError('Failed to fetch lead status');
    } finally {
      setLoading(false);
    }
  };

  // Update lead status
  const handleToggle = async (leadType, newValue) => {
    try {
      setError(null);
      
      const updateData = leadType === 'free' 
        ? { isFreeLeadsBrandPaused: newValue }
        : { isPaidLeadsBrandPaused: newValue };

      const response = await axios.put(
        'http://localhost:5000/api/v1/admin/leadsFreeAndPaidStopAndStart',
        updateData,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
console.log('update',response);

      if (response.data.success) {
        setLeadStatus(prev => ({
          ...prev,
          ...(leadType === 'free' && { isFreeLeadsBrandPaused: newValue }),
          ...(leadType === 'paid' && { isPaidLeadsBrandPaused: newValue })
        }));
      }
    } catch (error) {
      setError(`Failed to update ${leadType} lead status`);
    }
  };

  useEffect(() => {
    fetchLeadStatus();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Lead Management Control
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Free Leads Toggle */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Free Leads
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Status: 
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  ml: 1, 
                  color: leadStatus.isFreeLeadsBrandPaused ? 'error.main' : 'success.main',
                  fontWeight: 'bold'
                }}
              >
                {leadStatus.isFreeLeadsBrandPaused ? 'PAUSED' : 'ACTIVE'}
              </Typography>
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={!leadStatus.isFreeLeadsBrandPaused}
                  onChange={(e) => handleToggle('free', !e.target.checked)}
                  color="success"
                />
              }
              label={leadStatus.isFreeLeadsBrandPaused ? 'Paused' : 'Active'}
            />
          </Paper>
        </Grid>

        {/* Paid Leads Toggle */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Paid Leads
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Status: 
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  ml: 1, 
                  color: leadStatus.isPaidLeadsBrandPaused ? 'error.main' : 'success.main',
                  fontWeight: 'bold'
                }}
              >
                {leadStatus.isPaidLeadsBrandPaused ? 'PAUSED' : 'ACTIVE'}
              </Typography>
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={!leadStatus.isPaidLeadsBrandPaused}
                  onChange={(e) => handleToggle('paid', !e.target.checked)}
                  color="success"
                />
              }
              label={leadStatus.isPaidLeadsBrandPaused ? 'Paused' : 'Active'}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LeadToggleControl;
