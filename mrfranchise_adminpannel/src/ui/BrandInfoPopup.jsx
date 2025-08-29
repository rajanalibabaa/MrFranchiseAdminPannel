import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Avatar,
  Divider,
  Chip,
  Box,
  Link,
  useTheme,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Paper,
  Card,
  CardContent,
  IconButton,
  alpha,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import {
  LocationOn,
  Business,
  Language,
  Phone,
  Email,
  CalendarToday,
  Store,
  TrendingUp,
  VideoLibrary,
  Description,
  EmojiEvents,
  Close,
  ExpandMore,
  Image,
  PictureAsPdf,
  CorporateFare,
  Public,
  Payments,
  SupportAgent,
  Sell,
  ArrowOutward,
} from "@mui/icons-material";

// Create a custom theme with orange and light green colors
const customTheme = createTheme({
  palette: {
    primary: {
      main: '#ff9800', // Orange
      light: '#ffb74d',
      dark: '#f57c00',
    },
    secondary: {
      main: '#8bc34a', // Light Green
      light: '#aed581',
      dark: '#689f38',
    },
  },
});

// TabPanel component for organized content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`brand-info-tabpanel-${index}`}
      aria-labelledby={`brand-info-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const BrandInfoPopup = ({ open, onClose, brandDetails }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [tabValue, setTabValue] = useState(0);
  const [expandedAccordion, setExpandedAccordion] = useState(false);
  
  if (!brandDetails) return null;

  const { brandDetails: bd, franchiseDetails, uploads, expansionlocationdata } = brandDetails;

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

  // Helper function to render array data
  const renderArrayData = (data, title, icon) => {
    if (!data || data.length === 0) return null;
    
    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1.5, display: 'flex', alignItems: 'center' }}>
          {icon && React.cloneElement(icon, { sx: { mr: 1, fontSize: 20 } })}
          {title}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {data.map((item, index) => (
            <Chip 
              key={index} 
              label={item} 
              size="small" 
              color="primary" 
              variant="outlined" 
              sx={{ borderRadius: 1 }}
            />
          ))}
        </Box>
      </Box>
    );
  };

  // Helper function to render expansion locations safely
  // const renderExpansionLocations = (locations, title, type) => {
  //   if (!locations || locations.length === 0) return null;
    
  //   return (
  //     <Accordion 
  //       elevation={2} 
  //       sx={{ mb: 2, borderRadius: 1, overflow: 'hidden' }}
  //       expanded={expandedAccordion === `${title}-${type}`}
  //       onChange={handleAccordionChange(`${title}-${type}`)}
  //     >
  //       <AccordionSummary expandIcon={<ExpandMore />}>
  //         <Typography fontWeight="medium" sx={{ display: 'flex', alignItems: 'center' }}>
  //           <Public sx={{ mr: 1, fontSize: 20 }} />
  //           {title} ({locations.length} {locations.length === 1 ? 'Location' : 'Locations'})
  //         </Typography>
  //       </AccordionSummary>
  //       <AccordionDetails>
  //         {locations.map((location, index) => (
  //           <Box key={index} sx={{ mb: index < locations.length - 1 ? 2 : 0, pb: index < locations.length - 1 ? 2 : 0, 
  //                 borderBottom: index < locations.length - 1 ? '1px solid' : 'none', 
  //                 borderColor: 'divider' }}>
  //             <Typography variant="body2" fontWeight="medium" color="primary" sx={{ mb: 1 }}>
  //               {location.state || location.country}
  //             </Typography>
  //             {location.districts && location.districts.length > 0 ? (
  //               <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
  //                 {location.districts.map((district, idx) => (
  //                   <Chip 
  //                     key={idx} 
  //                     label={district.district} 
  //                     size="small" 
  //                     variant="outlined" 
  //                     sx={{ borderRadius: 0.5 }}
  //                   />
  //                 ))}
  //               </Box>
  //             ) : location.states && location.states.length > 0 ? (
  //               <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
  //                 {location.states.map((state, idx) => (
  //                   <Chip 
  //                     key={idx} 
  //                     label={state.state} 
  //                     size="small" 
  //                     variant="outlined" 
  //                     sx={{ borderRadius: 0.5 }}
  //                   />
  //                 ))}
  //               </Box>
  //             ) : (
  //               <Typography variant="body2" color="text.secondary">
  //                 No specific areas defined
  //               </Typography>
  //             )}
  //           </Box>
  //         ))}
  //       </AccordionDetails>
  //     </Accordion>
  //   );
  // };
 const renderCurrentOutletLocations = () => {
    if (!expansionlocationdata?.currentOutletLocations) return null;
    
    const { domestic, international } = expansionlocationdata.currentOutletLocations;
    
    return (
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <Store sx={{ mr: 1, fontSize: 20 }} />
          Current Outlet Locations
        </Typography>
        
        {domestic?.locations && domestic.locations.length > 0 && (
          <Accordion 
            elevation={2} 
            sx={{ mb: 2, borderRadius: 1, overflow: 'hidden' }}
            expanded={expandedAccordion === 'domestic-current'}
            onChange={handleAccordionChange('domestic-current')}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography fontWeight="medium">
                Domestic ({domestic.locations.length} {domestic.locations.length === 1 ? 'Location' : 'Locations'})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {domestic.locations.map((location, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="body2" fontWeight="medium" color="primary" sx={{ mb: 1 }}>
                    {location.state}
                  </Typography>
                  {location.districts && location.districts.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {location.districts.map((district, idx) => (
                        <Chip 
                          key={idx} 
                          label={district.district} 
                          size="small" 
                          variant="outlined" 
                          color="primary" 
                          sx={{ borderRadius: 0.5 }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        )}
        
        {international?.locations && international.locations.length > 0 && (
          <Accordion 
            elevation={2} 
            sx={{ borderRadius: 1, overflow: 'hidden' }}
            expanded={expandedAccordion === 'international-current'}
            onChange={handleAccordionChange('international-current')}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography fontWeight="medium">
                International ({international.locations.length} {international.locations.length === 1 ? 'Location' : 'Locations'})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {international.locations.map((location, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="body2" fontWeight="medium" color="secondary" sx={{ mb: 1 }}>
                    {location.country}
                  </Typography>
                  {location.states && location.states.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {location.states.map((state, idx) => (
                        <Chip 
                          key={idx} 
                          label={state.state} 
                          size="small" 
                          variant="outlined" 
                          color="secondary" 
                          sx={{ borderRadius: 0.5 }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        )}
      </Box>
    );
  };

  // Safely render expansion locations
  const renderExpansionLocations = () => {
    if (!expansionlocationdata?.expansionLocations) return null;

    const { domestic, international } = expansionlocationdata.expansionLocations;

    return (
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <Store sx={{ mr: 1, fontSize: 20 }} />
          Expansion Locations
        </Typography>
        
        {domestic?.locations && domestic.locations.length > 0 && (
          <Accordion 
            elevation={2} 
            sx={{ mb: 2, borderRadius: 1, overflow: 'hidden' }}
            expanded={expandedAccordion === 'domestic-current'}
            onChange={handleAccordionChange('domestic-current')}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography fontWeight="medium">
                Domestic ({domestic.locations.length} {domestic.locations.length === 1 ? 'Location' : 'Locations'})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {domestic.locations.map((location, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="body2" fontWeight="medium" color="primary" sx={{ mb: 1 }}>
                    {location.state}
                  </Typography>
                  {location.districts && location.districts.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {location.districts.map((district, idx) => (
                        <Chip 
                          key={idx} 
                          label={district.district} 
                          size="small" 
                          variant="outlined" 
                          color="primary" 
                          sx={{ borderRadius: 0.5 }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        )}
        
        {international?.locations && international.locations.length > 0 && (
          <Accordion 
            elevation={2} 
            sx={{ borderRadius: 1, overflow: 'hidden' }}
            expanded={expandedAccordion === 'international-current'}
            onChange={handleAccordionChange('international-current')}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography fontWeight="medium">
                International ({international.locations.length} {international.locations.length === 1 ? 'Location' : 'Locations'})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {international.locations.map((location, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="body2" fontWeight="medium" color="secondary" sx={{ mb: 1 }}>
                    {location.country}
                  </Typography>
                  {location.states && location.states.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {location.states.map((state, idx) => (
                        <Chip 
                          key={idx} 
                          label={state.state} 
                          size="small" 
                          variant="outlined" 
                          color="secondary" 
                          sx={{ borderRadius: 0.5 }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        )}
      </Box>
    );
  };

  return (
    <ThemeProvider theme={customTheme}>
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="md" 
        fullWidth 
        scroll="paper"
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: fullScreen ? 0 : 2,
            background: fullScreen ? 'white' : 'linear-gradient(to bottom, #f9fafb, #ffffff)',
          },
          ml: { xs: 0, sm: 40 }
        }}
      >
        {/* Header */}
        <DialogTitle sx={{ 
          background: `linear-gradient(135deg, ${customTheme.palette.primary.main} 0%, ${alpha(customTheme.palette.primary.dark, 0.8)} 100%)`,
          color: 'white',
          py: 2,
          position: 'relative',
          boxShadow: 2,
        }}>
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 12,
              top: 12,
              color: 'white',
              backgroundColor: alpha('#fff', 0.1),
              '&:hover': {
                backgroundColor: alpha('#fff', 0.2),
              }
            }}
          >
            <Close />
          </IconButton>
          
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <Avatar
                src={uploads?.logo}
                alt={bd?.brandName}
                sx={{ 
                  width: 70, 
                  height: 70, 
                  border: '3px solid white',
                  boxShadow: theme.shadows[3],
                }}
              />
            </Grid>
            <Grid item xs>
              <Typography variant="h5" fontWeight="bold">{bd?.brandName}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                {bd?.tagLine}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
                <Chip 
                  icon={<Business />} 
                  label={franchiseDetails?.brandCategories?.main} 
                  size="small" 
                  sx={{ 
                    color: 'white', 
                    backgroundColor: alpha('#fff', 0.2),
                    fontWeight: 'medium',
                  }} 
                />
                <Chip 
                  label={franchiseDetails?.brandCategories?.sub} 
                  size="small" 
                  sx={{ 
                    color: 'white', 
                    backgroundColor: alpha('#fff', 0.2),
                    fontWeight: 'medium',
                  }} 
                />
                <Chip 
                  label={franchiseDetails?.brandCategories?.child} 
                  size="small" 
                  sx={{ 
                    color: 'white', 
                    backgroundColor: alpha('#fff', 0.2),
                    fontWeight: 'medium',
                  }} 
                />
              </Box>
            </Grid>
            <Grid item>
              <Chip 
                label={`Brand ID: ${brandDetails.brandID}`} 
                size="small" 
                sx={{ 
                  color: 'white', 
                  backgroundColor: alpha('#fff', 0.2),
                  fontWeight: 'medium',
                }} 
              />
            </Grid>
          </Grid>
        </DialogTitle>

        {/* Tabs Navigation */}
        <Paper square elevation={0} sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant={fullScreen ? "scrollable" : "standard"}
            scrollButtons={fullScreen ? "auto" : false}
            allowScrollButtonsMobile
            sx={{
              '& .MuiTab-root': {
                minHeight: 48,
                fontWeight: 'medium',
              }
            }}
          >
            <Tab icon={<Business />} label="Brand Details" />
            <Tab icon={<Store />} label="Franchise Details" />
            <Tab icon={<Public />} label="Expansion Plans" />
            <Tab icon={<Image />} label="Media & Docs" />
          </Tabs>
        </Paper>

        {/* Content */}
        <DialogContent dividers sx={{ py: 0, px: fullScreen ? 1 : 3 }}>
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              {/* Company Info */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'primary.main', mb: 2 }}>
                      <Business sx={{ mr: 1 }} /> Company Information
                    </Typography>
                    
                    <Box sx={{ pl: 1 }}>
                      <InfoRow label="Company Name" value={bd?.companyName} />
                      <InfoRow label="Contact Person" value={bd?.fullName} />
                      <InfoRow label="Email" value={bd?.email} icon={<Email />} isLink linkType="mailto" />
                      <InfoRow label="Mobile" value={bd?.mobileNumber} icon={<Phone />} isLink linkType="tel" />
                      <InfoRow label="WhatsApp" value={bd?.whatsappNumber} />
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <InfoRow label="CEO" value={bd?.ceoName} />
                      <InfoRow label="CEO Email" value={bd?.ceoEmail} icon={<Email />} isLink linkType="mailto" />
                      <InfoRow label="CEO Mobile" value={bd?.ceoMobile} icon={<Phone />} isLink linkType="tel" />
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <InfoRow label="Office Email" value={bd?.officeEmail} />
                      <InfoRow label="Office Mobile" value={bd?.officeMobile} />
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <InfoRow label="GST Number" value={bd?.gstNumber} />
                      <InfoRow label="PAN Card Number" value={bd?.pancardNumber} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Location Info */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'primary.main', mb: 2 }}>
                      <LocationOn sx={{ mr: 1 }} /> Location Information
                    </Typography>
                    
                    <Box sx={{ pl: 1 }}>
                      <InfoRow label="Address" value={bd?.headOfficeAddress} multiline />
                      <InfoRow value={`${bd?.city}, ${bd?.district}, ${bd?.state}, ${bd?.country} - ${bd?.pincode}`} multiline />
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <InfoRow label="Website" value={bd?.website} icon={<Language />} isLink />
                      <InfoRow label="Facebook" value={bd?.facebook} isLink />
                      <InfoRow label="Instagram" value={bd?.instagram} isLink />
                      <InfoRow label="LinkedIn" value={bd?.linkedin} isLink />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              {/* Franchise Basic Details */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'primary.main', mb: 2 }}>
                      <Store sx={{ mr: 1 }} /> Franchise Overview
                    </Typography>
                    
                    <InfoRow label="Established" value={franchiseDetails?.establishedYear} icon={<CalendarToday />} />
                    <InfoRow label="Franchising Since" value={franchiseDetails?.franchiseSinceYear} icon={<CalendarToday />} />
                    <InfoRow label="Total Outlets" value={franchiseDetails?.totalOutlets} icon={<Store />} />
                    <InfoRow label="Franchise Outlets" value={franchiseDetails?.franchiseOutlets} />
                    <InfoRow label="Company Owned Outlets" value={franchiseDetails?.companyOwnedOutlets} />
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <InfoRow label="AID Financing" value={franchiseDetails?.aidFinancing} icon={<Payments />} />
                    <InfoRow label="Franchise Development" value={franchiseDetails?.franchiseDevelopment} icon={<TrendingUp />} />
                    <InfoRow label="Consultation/Assistance" value={franchiseDetails?.consultationOrAssistance} icon={<SupportAgent />} />
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="body2" sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                      <strong>Brand Description:</strong> {franchiseDetails?.brandDescription}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Investment Details */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'primary.main', mb: 2 }}>
                      <Payments sx={{ mr: 1 }} /> Investment Options
                    </Typography>
                    
                    {franchiseDetails?.fico && franchiseDetails.fico.length > 0 ? (
                      franchiseDetails.fico.map((fico, index) => (
                        <Box key={index} sx={{ 
                          mb: index < franchiseDetails.fico.length - 1 ? 2 : 0, 
                          pb: index < franchiseDetails.fico.length - 1 ? 2 : 0,
                          borderBottom: index < franchiseDetails.fico.length - 1 ? '1px dashed' : 'none', 
                          borderColor: 'divider'
                        }}>
                          <InfoRow label="Franchise Model" value={fico.franchiseModel} icon={<Store />} />
                          <InfoRow label="Franchise Type" value={fico.franchiseType} icon={<Sell />} />
                          <InfoRow label="Investment Range" value={fico.investmentRange} />
                          <InfoRow label="Franchise Fee" value={`₹${fico.franchiseFee}`} />
                          <InfoRow label="Royalty Fee" value={`${fico.royaltyFee}${fico.royaltyFeeUnit}`} />
                          <InfoRow label="Area Required" value={fico.areaRequired} />
                          <InfoRow label="Agreement Period" value={`${fico.agreementPeriod} years`} />
                          <InfoRow label="ROI" value={`${fico.roi}%`} />
                          <InfoRow label="Payback Period" value={fico.payBackPeriod} />
                          <InfoRow label="Break Even" value={fico.breakEven} />
                          <InfoRow label="Margin on Sales" value={`${fico.marginOnSales}%`} />
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                        No investment details available
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Unique Selling Points & Training */}
              <Grid item xs={12} md={6}>
                {renderArrayData(franchiseDetails?.uniqueSellingPoints, "Unique Selling Points", <Sell />)}
              </Grid>

              <Grid item xs={12} md={6}>
                {renderArrayData(franchiseDetails?.trainingSupport, "Training & Support", <SupportAgent />)}
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            {expansionlocationdata ? (
              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'primary.main', mb: 3 }}>
                    <TrendingUp sx={{ mr: 1 }} /> Expansion Plans
                  </Typography>
                  
                  <Grid container spacing={3}>
                
                    
                    <Grid item xs={12} md={6}>
                      {renderExpansionLocations(
                        expansionlocationdata.expansionLocations?.domestic?.locations, 
                        "Domestic Expansion",
                        "domestic"
                      )}
                    </Grid>
                    
                    <Grid item xs={12}>
                      {renderCurrentOutletLocations()}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No expansion data available
              </Typography>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Card variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'primary.main', mb: 3 }}>
                  <Image sx={{ mr: 1 }} /> Media & Documents
                </Typography>
                
                <Grid container spacing={3}>
                  {/* Brand Logo */}
                  {uploads?.logo && (
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                        Brand Logo
                      </Typography>
                      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 1.5, display: 'inline-block' }}>
                        <Avatar
                          src={uploads.logo}
                          alt="Brand Logo"
                          variant="rounded"
                          sx={{ width: 120, height: 120 }}
                        />
                      </Box>
                    </Grid>
                  )}
                  
                  {/* Exterior Outlet Images */}
                  {uploads?.exteriorOutlet && uploads.exteriorOutlet.length > 0 && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                        Exterior Outlet Images ({uploads.exteriorOutlet.length})
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        {uploads.exteriorOutlet.map((img, index) => (
                          <Box key={index} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 1.5 }}>
                            <Avatar
                              src={img}
                              alt="Exterior Outlet"
                              variant="rounded"
                              sx={{ width: 100, height: 100 }}
                            />
                          </Box>
                        ))}
                      </Box>
                    </Grid>
                  )}
                  
                  {/* Interior Outlet Images */}
                  {uploads?.interiorOutlet && uploads.interiorOutlet.length > 0 && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                        Interior Outlet Images ({uploads.interiorOutlet.length})
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        {uploads.interiorOutlet.map((img, index) => (
                          <Box key={index} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 1.5 }}>
                            <Avatar
                              src={img}
                              alt="Interior Outlet"
                              variant="rounded"
                              sx={{ width: 100, height: 100 }}
                            />
                          </Box>
                        ))}
                      </Box>
                    </Grid>
                  )}
                  
                  {/* Franchise Videos */}
                  {uploads?.franchiseVideos && (
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                        <VideoLibrary sx={{ mr: 1 }} /> Franchise Video
                      </Typography>
                      <Button
                        variant="outlined"
                        color="primary"
                        href={uploads.franchiseVideos}
                        target="_blank"
                        rel="noopener"
                        startIcon={<VideoLibrary />}
                        endIcon={<ArrowOutward />}
                      >
                        Watch Franchise Video
                      </Button>
                    </Grid>
                  )}
                  
                  {/* Documents */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                      <Description sx={{ mr: 1 }} /> Documents
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {uploads?.gstCertificate && (
                        <DocLink label="GST Certificate" url={uploads.gstCertificate} icon={<PictureAsPdf />} />
                      )}
                      
                      {uploads?.pancard && (
                        <DocLink label="PAN Card" url={uploads.pancard} icon={<PictureAsPdf />} />
                      )}
                      
                      {uploads?.businessPlan && (
                        <DocLink label="Business Plan" url={uploads.businessPlan} icon={<Description />} />
                      )}
                    </Box>
                  </Grid>
                  
                  {/* Awards */}
                  {uploads?.awards && uploads.awards.length > 0 && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                        <EmojiEvents sx={{ mr: 1 }} /> Awards & Recognitions ({uploads.awards.length})
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        {uploads.awards.map((award, index) => (
                          <Box key={index} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 1.5 }}>
                            <Avatar
                              src={award}
                              alt="Award"
                              variant="rounded"
                              sx={{ width: 100, height: 100 }}
                            />
                          </Box>
                        ))}
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </TabPanel>
        </DialogContent>

        {/* Footer */}
        <DialogActions sx={{ px: 3, py: 2, background: alpha(customTheme.palette.secondary.light, 0.1) }}>
          <Button 
            onClick={onClose} 
            variant="contained" 
            color="primary"
            size="large"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

// Helper component for consistent info row styling
const InfoRow = ({ label, value, icon, isLink = false, linkType, multiline = false }) => {
  if (!value) return null;
  
  let content = value;
  if (isLink) {
    let href = value;
    if (linkType === 'mailto') href = `mailto:${value}`;
    if (linkType === 'tel') href = `tel:${value}`;
    
    content = (
      <Link href={href} target={!linkType ? "_blank" : undefined} rel="noopener" sx={{ display: 'inline-flex', alignItems: 'center' }}>
        {value} {!linkType && <ArrowOutward sx={{ fontSize: 14, ml: 0.5 }} />}
      </Link>
    );
  }
  
  return (
    <Box sx={{ mb: 1.5, display: 'flex', alignItems: multiline ? 'flex-start' : 'center' }}>
      {icon && React.cloneElement(icon, { sx: { fontSize: 18, mr: 1, color: 'primary.main', flexShrink: 0, mt: multiline ? 0.5 : 0 } })}
      <Box>
        {label && <Typography variant="subtitle2" component="span" fontWeight="bold" sx={{ mr: 0.5 }}>{label}:</Typography>}
        <Typography variant="body2" component="span" sx={{ wordBreak: 'break-word' }}>{content}</Typography>
      </Box>
    </Box>
  );
};

// Helper component for document links
const DocLink = ({ label, url, icon }) => (
  <Button
    variant="outlined"
    size="small"
    href={url}
    target="_blank"
    rel="noopener"
    startIcon={icon}
    endIcon={<ArrowOutward />}
    sx={{ 
      justifyContent: 'flex-start', 
      textTransform: 'none',
      borderRadius: 1,
    }}
  >
    {label}
  </Button>
);

export default BrandInfoPopup;