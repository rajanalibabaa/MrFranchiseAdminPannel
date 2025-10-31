import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
  IconButton
} from '@mui/material';
import {
  Close as CloseIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import { formatDate } from './dateUtils';

const InvestorDetailsDialog = ({ open, investor, onClose }) => {
  if (!investor) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          bgcolor: 'success.main', 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Typography variant="h5" component="div" fontWeight="bold">
          Investor Details
        </Typography>
        <IconButton 
          onClick={onClose} 
          sx={{ color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3} display={'grid'}>
          {/* Personal Information */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EmailIcon sx={{ mr: 1, color: 'success.main' }} />
                  <Typography variant="h6" color="warning.main" fontWeight="bold">
                    Personal Information
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                  <Typography variant="body1" fontWeight="medium">{investor.investorName}</Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                  <Typography variant="body1">{investor.investorEmail}</Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                  <Typography variant="body1">{investor.investorPhone}</Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Applied By</Typography>
                  <Chip 
                    label={investor.apply?.applyBy || 'N/A'} 
                    color="warning" 
                    size="small" 
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Location Details */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationIcon sx={{ mr: 1, color: 'success.main' }} />
                  <Typography variant="h6" color="warning.main" fontWeight="bold">
                    Location Details
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">State</Typography>
                  <Typography variant="body1" fontWeight="medium">{investor.location?.state || 'N/A'}</Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">District</Typography>
                  <Typography variant="body1">{investor.location?.district || 'N/A'}</Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">City</Typography>
                  <Typography variant="body1">{investor.location?.city || 'N/A'}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Investment Details */}
          <Grid item xs={12}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <MoneyIcon sx={{ mr: 1, color: 'success.main' }} />
                  <Typography variant="h6" color="warning.main" fontWeight="bold">
                    Investment Details
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Investment Range</Typography>
                      <Chip 
                        label={investor.investmentRange || 'N/A'} 
                        color="success" 
                        variant="outlined"
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Plan to Invest</Typography>
                      <Typography variant="body1" fontWeight="medium">{investor.planToInvest || 'N/A'}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Ready to Invest</Typography>
                      <Typography variant="body1" fontWeight="medium">{investor.readyToInvest || 'N/A'}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Category Interest */}
          <Grid item xs={12}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BusinessIcon sx={{ mr: 1, color: 'success.main' }} />
                  <Typography variant="h6" color="warning.main" fontWeight="bold">
                    Category Interest
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                {investor.category?.length > 0 ? (
                  investor.category.map((cat, index) => (
                    <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="subtitle2" color="text.secondary">Main Category</Typography>
                          <Typography variant="body1" fontWeight="medium">{cat.main}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="subtitle2" color="text.secondary">Sub Category</Typography>
                          <Typography variant="body1">{cat.sub}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="subtitle2" color="text.secondary">Child Category</Typography>
                          <Typography variant="body1">{cat.child}</Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  ))
                ) : (
                  <Typography color="text.secondary">No category information available</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Brand History */}
          <Grid item xs={12}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BusinessIcon sx={{ mr: 1, color: 'success.main' }} />
                  <Typography variant="h6" color="warning.main" fontWeight="bold">
                    Brand Communication History
                  </Typography>
                  <Chip 
                    label={`${investor.totalBrandsSent || 0} brands`}
                    color="warning"
                    size="small"
                    sx={{ ml: 2 }}
                  />
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                {investor.brandsSent?.length > 0 ? (
                  <Grid container spacing={2}>
                    {investor.brandsSent.map((brand, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card variant="outlined">
                          <CardContent sx={{ p: 2 }}>
                            <Typography variant="subtitle2" fontWeight="bold" noWrap>
                              {brand.brandName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 1 }}>
                              {brand.brandEmail}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                              <Chip
                                label={brand.emailSent ? 'Email Sent' : 'Pending'}
                                size="small"
                                color={brand.emailSent ? 'success' : 'warning'}
                                variant="filled"
                              />
                            </Box>
                            {brand.emailSentAt && (
                              <Typography variant="caption" color="text.secondary">
                                Sent: {formatDate(brand.emailSentAt)}
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography color="text.secondary">No brands contacted yet</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Timestamps */}
          <Grid item xs={12}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" color="text.dark" gutterBottom>
                  Timeline
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Created At</Typography>
                    <Typography variant="body1">{formatDate(investor.createdAt)}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Last Updated</Typography>
                    <Typography variant="body1">{formatDate(investor.updatedAt)}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
      <Divider sx={{mb:2}} />   
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button 
          onClick={onClose} 
          variant="contained"
          color="error"
          size="large"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InvestorDetailsDialog;
