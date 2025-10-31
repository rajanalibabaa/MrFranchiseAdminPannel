// components/InvestorTable.jsx
import React, { memo } from 'react';
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Box,
  Typography,
  IconButton,
  Chip,
  Badge,
  Tooltip,
  Collapse,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Visibility as ViewIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import { formatDate } from './dateUtils';

const InvestorRow = memo(({ 
  investor, 
  isExpanded, 
  onToggleExpansion, 
  onViewInvestor 
}) => {
  const handleToggleExpansion = () => onToggleExpansion(investor._id);
  const handleViewInvestor = () => onViewInvestor(investor);

  return (
    <>
      <TableRow 
        hover 
        sx={{ 
          '&:hover': { 
            bgcolor: 'grey.50',
            transform: 'scale(1.001)',
            transition: 'all 0.2s ease'
          },
          cursor: 'pointer'
        }}
      >
        <TableCell sx={{ width: 60 }}>
          <IconButton
            size="small"
            onClick={handleToggleExpansion}
            sx={{
              transition: 'transform 0.2s ease',
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              bgcolor: isExpanded ? 'warning.main' : 'warning.light',
              color: isExpanded ? 'white' : 'text.secondary',
              '&:hover': {
                bgcolor: isExpanded ? 'warning.dark' : 'warning.light'
              }
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </TableCell>
        
        <TableCell sx={{ minWidth: 250 }}>
          <Box>
            <Typography 
              variant="subtitle1" 
              fontWeight="bold"
              sx={{ 
                color: 'success.main',
                mb: 0.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              {investor.investorName}
              <Chip 
                label={investor.apply?.applyBy || 'N/A'} 
                size="small" 
                variant="outlined"
                color="warning"
              />
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <EmailIcon sx={{ fontSize: 16 }} />
                {investor.investorEmail}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <PhoneIcon sx={{ fontSize: 16 }} />
                {investor.investorPhone}
              </Typography>
            </Box>
          </Box>
        </TableCell>
        
        <TableCell sx={{ minWidth: 200 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LocationIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Box>
              <Typography variant="body2" fontWeight="medium">
                {investor.location?.state}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {investor.location?.district}
                {investor.location?.city }
              </Typography>
            </Box>
          </Box>
        </TableCell>
        
        {/* <TableCell sx={{ minWidth: 220 }}>
          <Box>
            {investor.category?.map((cat, index) => (
              <Typography 
                key={index} 
                variant="body2" 
                sx={{ 
                  mb: 0.5,
                  p: 1,
                  bgcolor: 'grey.50',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'grey.200'
                }}
              >
                <strong>{cat.main}</strong>
                <br />
                <Typography variant="caption" color="text.secondary">
                  {cat.sub} → {cat.child}
                </Typography>
              </Typography>
            ))}
          </Box>
        </TableCell> */}
        
        <TableCell sx={{ minWidth: 180 }}>
          <Box>
            <Chip
              label={investor.investmentRange}
              size="small"
              color="success"
              variant="outlined"
              sx={{ mb: 1, fontWeight: 'bold' }}
            />
            <Typography variant="caption" display="block" color="text.secondary">
              Plan: {investor.planToInvest}
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary">
              Status: {investor.readyToInvest}
            </Typography>
          </Box>
        </TableCell>
        
        <TableCell sx={{ minWidth: 120 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Badge 
              badgeContent={investor.totalBrandsSent || investor.brandsSent?.length || 0}
              color="warning"
              max={999}
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }
              }}
            >
              <BusinessIcon color="action" />
            </Badge>
            <Chip 
              label={`${investor.emailsSent || investor.brandsSent?.filter(b => b.emailSent)?.length || 0} sent`}
              size="small"
              color={(investor.emailsSent || 0) > 0 ? 'success' : 'default'}
              variant="filled"
            />
          </Box>
        </TableCell>
        
        <TableCell sx={{ minWidth: 140 }}>
          <Typography variant="body2" fontWeight="medium">
            {formatDate(investor.createdAt)}
          </Typography>
        </TableCell>
        
        <TableCell sx={{ width: 80 }}>
          <Tooltip title="View Full Details">
            <IconButton 
              size="small" 
              onClick={handleViewInvestor}
              color="warning"
              sx={{
                bgcolor: 'warning.50',
                '&:hover': {
                  bgcolor: 'warning.100',
                  transform: 'scale(1.1)'
                }
              }}
            >
              <ViewIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      
      {/* Expandable Row for Brand Details */}
      <TableRow>
        <TableCell colSpan={8} sx={{ py: 0, bgcolor: 'grey.25' }}>
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Box sx={{ p: 3, bgcolor: 'linear-gradient(135deg, #f5f5f5, #ffffff)' }}>
              <Typography 
                variant="h6" 
                gutterBottom 
                color="warning.main"
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  mb: 2 
                }}
              >
                <BusinessIcon />
                Brands Sent ({investor.totalBrandsSent || investor.brandsSent?.length || 0})
              </Typography>
              
              <Grid container  display={'grid'} gridTemplateColumns={'repeat(auto-fill, minmax(250px, 1fr))'} spacing={2}>
                {investor.brandsSent?.length > 0 ? (
                  investor.brandsSent.map((brand, index) => (
                    <Grid item xs={12} sm={6} md={4} key={`brand-${index}`}>
                      <Card 
                        variant="outlined" 
                        sx={{
                          height: '100%',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Typography 
                            variant="subtitle2" 
                            fontWeight="bold"
                            color="success.main"
                            noWrap
                            sx={{ mb: 1 }}
                          >
                            {brand.brandName}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            display="block"
                            sx={{ mb: 1 }}
                            noWrap
                          >
                            {brand.brandEmail}
                          </Typography>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: 1
                          }}>
                            <Chip
                              label={brand.emailSent ? 'Email Sent' : 'Pending'}
                              size="small"
                              color={brand.emailSent ? 'success' : 'warning'}
                              variant="filled"
                            />
                            {brand.emailSentAt && (
                              <Typography variant="caption" color="text.secondary">
                                {formatDate(brand.emailSentAt)}
                              </Typography>
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Box 
                      sx={{ 
                        textAlign: 'center', 
                        py: 4,
                        color: 'text.secondary'
                      }}
                    >
                      <BusinessIcon sx={{ fontSize: 48, opacity: 0.3, mb: 1 }} />
                      <Typography variant="body1">
                        No brands sent yet
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
});

const InvestorTable = ({ 
  investors, 
  expandedRows, 
  onToggleExpansion, 
  onViewInvestor,
  activeFiltersCount 
}) => {
  return (
    <TableContainer 
      component={Paper} 
      elevation={3}
      sx={{ 
        borderRadius: 2,
        overflow: 'hidden',
        
        border: '1px solid',
        borderColor: 'grey.200'
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow sx={{ bgcolor: 'warning.main' }}>
            {[
              { label: 'Lead sent brands', width: 250 },
              { label: 'Investor Details', minWidth: 250 },
              { label: 'Location', minWidth: 200 },
            //   { label: 'Category Interest', minWidth: 220 },
              { label: 'Investment', minWidth: 180 },
              { label: 'Brands', minWidth: 120 },
              { label: 'Created', minWidth: 140 },
              { label: 'Actions', width: 80 }
            ].map((header, index) => (
              <TableCell 
                key={index}
                sx={{ 
                  bgcolor: 'warning.main',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.95rem',
                  py: 2,
                  ...(header.width && { width: header.width }),
                  ...(header.minWidth && { minWidth: header.minWidth })
                }}
              >
                {header.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {investors.map((investor) => (
            <InvestorRow
              key={investor._id}
              investor={investor}
              isExpanded={expandedRows[investor._id]}
              onToggleExpansion={onToggleExpansion}
              onViewInvestor={onViewInvestor}
            />
          ))}
        </TableBody>
      </Table>
      
      {investors.length === 0 && (
        <Box sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No investors found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {activeFiltersCount > 0 
              ? 'Try adjusting your search filters' 
              : 'No investor data available at the moment'
            }
          </Typography>
        </Box>
      )}
    </TableContainer>
  );
};

export default memo(InvestorTable);
