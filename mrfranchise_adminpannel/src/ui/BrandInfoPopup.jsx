import React, { useState, useEffect } from "react";
import {
  TextField,
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
  AppBar,
  Toolbar,
  Drawer,
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
      main: "#ff9800",
      light: "#ffb74d",
      dark: "#f57c00",
    },
    secondary: {
      main: "#8bc34a",
      light: "#aed581",
      dark: "#689f38",
    },
  },
});

// TabPanel component for organized content
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const BrandInfoDrawer = ({ open, onClose, brandDetails }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [tabValue, setTabValue] = useState(0);
  const [expandedAccordion, setExpandedAccordion] = useState(false);

  if (!brandDetails) return null;

  // Normalize variations in API field names and nested shapes to be defensive
  const bd = brandDetails.brandDetails || brandDetails;
  const franchiseDetails =
    brandDetails.franchiseDetails || bd.franchiseDetails || null;
  const uploads = brandDetails.uploads || bd.uploads || null;
  const expansionlocationdata =
    brandDetails.expansionlocationdata ||
    brandDetails.expansionLocationData ||
    bd.expansionlocationdata ||
    bd.expansionLocations ||
    null;

  useEffect(() => {
    if (open && brandDetails) {
      // Debug logs if needed
      // console.log('Full brandDetails object:', brandDetails);
    }
  }, [open, brandDetails]);

  const handleTabChange = (event, newValue) => setTabValue(newValue);
  const handleAccordionChange = (panel) => (e, isExpanded) =>
    setExpandedAccordion(isExpanded ? panel : false);

  const renderArrayData = (data, title, icon) => {
    if (!Array.isArray(data) || data.length === 0) return null;
    return (
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          sx={{ mb: 1.5, display: "flex", alignItems: "center" }}
        >
          {icon && React.cloneElement(icon, { sx: { mr: 1, fontSize: 20 } })}
          {title}
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
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

  const renderCurrentOutletLocations = () => {
    if (!expansionlocationdata?.currentOutletLocations) return null;
    const { domestic, international } =
      expansionlocationdata.currentOutletLocations;

    return (
      <Box sx={{ mt: 3 }}>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          sx={{ mb: 2, display: "flex", alignItems: "center" }}
        >
          <Store sx={{ mr: 1, fontSize: 20 }} />
          Current Outlet Locations
        </Typography>

        {domestic?.locations?.length > 0 && (
          <Accordion
            elevation={2}
            sx={{ mb: 2, borderRadius: 1, overflow: "hidden" }}
            expanded={expandedAccordion === "domestic-expansion"}
            onChange={handleAccordionChange("domestic-expansion")}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography fontWeight="medium">
                Domestic ({domestic.locations.length}{" "}
                {domestic.locations.length === 1 ? "Location" : "Locations"})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {domestic.locations.map((location, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    fontWeight="medium"
                    color="primary"
                    sx={{ mb: 1 }}
                  >
                    {location.state}
                  </Typography>
                  {location.districts?.length > 0 && (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
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

        {international?.locations?.length > 0 && (
          <Accordion
            elevation={2}
            sx={{ borderRadius: 1, overflow: "hidden" }}
            expanded={expandedAccordion === "international-expansion"}
            onChange={handleAccordionChange("international-expansion")}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography fontWeight="medium">
                International ({international.locations.length}{" "}
                {international.locations.length === 1 ? "Location" : "Locations"}
                )
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {international.locations.map((location, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    fontWeight="medium"
                    color="secondary"
                    sx={{ mb: 1 }}
                  >
                    {location.country}
                  </Typography>
                  {location.states?.length > 0 && (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
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

  const renderExpansionLocations = () => {
    if (!expansionlocationdata?.expansionLocations) return null;
    const { domestic, international } = expansionlocationdata.expansionLocations;

    return (
      <Box sx={{ mt: 3 }}>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          sx={{ mb: 2, display: "flex", alignItems: "center" }}
        >
          <Store sx={{ mr: 1, fontSize: 20 }} />
          Expansion Locations
        </Typography>

        {domestic?.locations?.length > 0 && (
          <Accordion
            elevation={2}
            sx={{ mb: 2, borderRadius: 1, overflow: "hidden" }}
            expanded={expandedAccordion === "domestic-current"}
            onChange={handleAccordionChange("domestic-current")}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography fontWeight="medium">
                Domestic ({domestic.locations.length}{" "}
                {domestic.locations.length === 1 ? "Location" : "Locations"})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {domestic.locations.map((location, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    fontWeight="medium"
                    color="primary"
                    sx={{ mb: 1 }}
                  >
                    {location.state}
                  </Typography>
                  {location.districts?.length > 0 && (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
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

        {international?.locations?.length > 0 && (
          <Accordion
            elevation={2}
            sx={{ borderRadius: 1, overflow: "hidden" }}
            expanded={expandedAccordion === "international-current"}
            onChange={handleAccordionChange("international-current")}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography fontWeight="medium">
                International ({international.locations.length}{" "}
                {international.locations.length === 1 ? "Location" : "Locations"}
                )
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {international.locations.map((location, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    fontWeight="medium"
                    color="secondary"
                    sx={{ mb: 1 }}
                  >
                    {location.country}
                  </Typography>
                  {location.states?.length > 0 && (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
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
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: "100%",
            height: "100vh",
            borderRadius: 0,
            background: fullScreen
              ? "white"
              : "linear-gradient(to bottom, #f9fafb, #ffffff)",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* Top AppBar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            background: `linear-gradient(135deg, ${customTheme.palette.primary.main} 0%, ${alpha(
              customTheme.palette.primary.dark,
              0.8
            )} 100%)`,
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#fff" }}>
              Brand Information
            </Typography>
            <IconButton onClick={onClose} sx={{ color: "#fff" }}>
              <Close />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Scrollable Content */}
        <Box sx={{ flex: 1, overflowY: "auto" }}>
          {/* Brand Header */}
          <Box
            sx={{
              px: { xs: 1, md: 3 },
              py: 2,
              background: alpha("#000", 0.02),
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Grid container alignItems="center" spacing={2}>
              <Grid item>
                <Avatar
                  src={uploads?.logo}
                  alt={bd?.brandName}
                  sx={{
                    width: 70,
                    height: 70,
                    border: "3px solid white",
                    boxShadow: theme.shadows[3],
                  }}
                />
              </Grid>
              <Grid item xs>
                <Typography variant="h5" fontWeight="bold">
                  {bd?.brandName}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                  {bd?.tagLine}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 1,
                    mt: 1.5,
                  }}
                >
                  <Chip
                    icon={<Business />}
                    label={franchiseDetails?.brandCategories?.main}
                    size="small"
                    sx={{
                      color: "white",
                      backgroundColor: alpha("#000", 0.4),
                      fontWeight: "medium",
                    }}
                  />
                  <Chip
                    label={franchiseDetails?.brandCategories?.sub}
                    size="small"
                    sx={{
                      color: "white",
                      backgroundColor: alpha("#000", 0.4),
                      fontWeight: "medium",
                    }}
                  />
                  <Chip
                    label={franchiseDetails?.brandCategories?.child}
                    size="small"
                    sx={{
                      color: "white",
                      backgroundColor: alpha("#000", 0.4),
                      fontWeight: "medium",
                    }}
                  />
                </Box>
              </Grid>
              <Grid item>
                <Chip
                  label={`Brand ID: ${brandDetails.brandID}`}
                  size="small"
                  sx={{
                    color: "white",
                    backgroundColor: alpha("#000", 0.4),
                    fontWeight: "medium",
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Tabs */}
          <Paper square elevation={0} sx={{ borderBottom: 1, borderColor: "divider", px: { xs: 1, md: 2 } }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant={fullScreen ? "scrollable" : "standard"}
              scrollButtons={fullScreen ? "auto" : false}
              allowScrollButtonsMobile
              sx={{
                "& .MuiTab-root": {
                  minHeight: 48,
                  fontWeight: "medium",
                },
              }}
            >
              <Tab icon={<Business />} label="Brand Details" />
              <Tab icon={<Store />} label="Franchise Details" />
              <Tab icon={<Public />} label="Expansion Plans" />
              <Tab icon={<Image />} label="Media & Docs" />
            </Tabs>
          </Paper>

          {/* Content */}
          <Box sx={{ px: { xs: 1, md: 3 } }}>
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
                {/* Company Info */}
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          color: "primary.main",
                          mb: 2,
                        }}
                      >
                        <Business sx={{ mr: 1 }} /> Company Information
                      </Typography>

                      <Box sx={{ pl: 1 }}>
                        <InfoRow label="Company Name" value={bd?.companyName} />
                        <InfoRow label="Contact Person" value={bd?.fullName} />
                        <InfoRow
                          label="Email"
                          value={bd?.email}
                          icon={<Email />}
                          isLink
                          linkType="mailto"
                        />
                        <InfoRow
                          label="Mobile"
                          value={bd?.mobileNumber}
                          icon={<Phone />}
                          isLink
                          linkType="tel"
                        />
                        <InfoRow label="WhatsApp" value={bd?.whatsappNumber} />

                        <Divider sx={{ my: 2 }} />

                        <InfoRow label="CEO" value={bd?.ceoName} />
                        <InfoRow
                          label="CEO Email"
                          value={bd?.ceoEmail}
                          icon={<Email />}
                          isLink
                          linkType="mailto"
                        />
                        <InfoRow
                          label="CEO Mobile"
                          value={bd?.ceoMobile}
                          icon={<Phone />}
                          isLink
                          linkType="tel"
                        />

                        <Divider sx={{ my: 2 }} />

                        <InfoRow label="Office Email" value={bd?.officeEmail} />
                        <InfoRow
                          label="Office Mobile"
                          value={bd?.officeMobile}
                        />

                        <Divider sx={{ my: 2 }} />

                        <InfoRow label="GST Number" value={bd?.gstNumber} />
                        <InfoRow
                          label="PAN Card Number"
                          value={bd?.pancardNumber}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Location Info */}
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          color: "primary.main",
                          mb: 2,
                        }}
                      >
                        <LocationOn sx={{ mr: 1 }} /> Location Information
                      </Typography>

                      <Box sx={{ pl: 1 }}>
                        <InfoRow
                          label="Address"
                          value={bd?.headOfficeAddress}
                          multiline
                        />
                        <InfoRow
                          value={`${bd?.city}, ${bd?.district}, ${bd?.state}, ${bd?.country} - ${bd?.pincode}`}
                          multiline
                        />

                        <Divider sx={{ my: 2 }} />

                        <InfoRow
                          label="Website"
                          value={bd?.website}
                          icon={<Language />}
                          isLink
                        />
                        <InfoRow label="Facebook" value={bd?.facebook} isLink />
                        <InfoRow
                          label="Instagram"
                          value={bd?.instagram}
                          isLink
                        />
                        <InfoRow label="LinkedIn" value={bd?.linkedin} isLink />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={3}>
                {/* Franchise Overview */}
                <Grid item xs={12} md={6}>
                  <Card
                    variant="outlined"
                    sx={{ borderRadius: 2, height: "100%" }}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          color: "primary.main",
                          mb: 2,
                        }}
                      >
                        <Store sx={{ mr: 1 }} /> Franchise Overview
                      </Typography>

                      <InfoRow
                        label="Established"
                        value={franchiseDetails?.establishedYear}
                        icon={<CalendarToday />}
                      />
                      <InfoRow
                        label="Franchising Since"
                        value={franchiseDetails?.franchiseSinceYear}
                        icon={<CalendarToday />}
                      />
                      <InfoRow
                        label="Total Outlets"
                        value={franchiseDetails?.totalOutlets}
                        icon={<Store />}
                      />
                      <InfoRow
                        label="Franchise Outlets"
                        value={franchiseDetails?.franchiseOutlets}
                      />
                      <InfoRow
                        label="Company Owned Outlets"
                        value={franchiseDetails?.companyOwnedOutlets}
                      />

                      <Divider sx={{ my: 2 }} />

                      <InfoRow
                        label="AID Financing"
                        value={franchiseDetails?.aidFinancing}
                        icon={<Payments />}
                      />
                      <InfoRow
                        label="Franchise Development"
                        value={franchiseDetails?.franchiseDevelopment}
                        icon={<TrendingUp />}
                      />
                      <InfoRow
                        label="Consultation/Assistance"
                        value={franchiseDetails?.consultationOrAssistance}
                        icon={<SupportAgent />}
                      />

                      <Divider sx={{ my: 2 }} />

                      <Typography
                        variant="body2"
                        sx={{
                          p: 2,
                          backgroundColor: "grey.50",
                          borderRadius: 1,
                        }}
                      >
                        <strong>Brand Description:</strong>{" "}
                        {franchiseDetails?.brandDescription}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Service Tags Card */}
                {franchiseDetails?.franchiseTags && (
                  <Grid item xs={12}>
                    <Card variant="outlined" sx={{ borderRadius: 2, mb: 2 }}>
                      <CardContent>
                        <Typography
                          variant="h6"
                          sx={{
                            mb: 2,
                            color: "primary.main",
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Sell sx={{ mr: 1 }} />
                          Service Tags
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 3,
                            rowGap: 2,
                          }}
                        >
                          {Object.entries(
                            franchiseDetails.franchiseTags
                          ).map(([group, tags]) =>
                            Array.isArray(tags) && tags.length > 0 ? (
                              <Box key={group} sx={{ minWidth: 160 }}>
                                <Typography
                                  variant="subtitle2"
                                  fontWeight="bold"
                                  sx={{ mb: 0.4 }}
                                >
                                  {group
                                    .replace(/([A-Z])/g, " $1")
                                    .replace(/^./, (str) => str.toUpperCase())
                                    .replace("Classifications", "Classification")}
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 1,
                                  }}
                                >
                                  {tags.map((tag) => (
                                    <Chip
                                      key={tag}
                                      label={tag}
                                      size="small"
                                      color="secondary"
                                      variant="outlined"
                                      sx={{ borderRadius: 1, mb: 0.3 }}
                                    />
                                  ))}
                                </Box>
                              </Box>
                            ) : null
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {/* Investment Options */}
                <Grid item xs={12} md={6}>
                  <Card
                    variant="outlined"
                    sx={{ borderRadius: 2, height: "100%" }}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          color: "primary.main",
                          mb: 2,
                        }}
                      >
                        <Payments sx={{ mr: 1 }} /> Investment Options
                      </Typography>

                      {franchiseDetails?.fico?.length > 0 ? (
                        franchiseDetails.fico.map((fico, index) => (
                          <Box
                            key={index}
                            sx={{
                              mb:
                                index < franchiseDetails.fico.length - 1
                                  ? 2
                                  : 0,
                              pb:
                                index < franchiseDetails.fico.length - 1
                                  ? 2
                                  : 0,
                              borderBottom:
                                index < franchiseDetails.fico.length - 1
                                  ? "1px dashed"
                                  : "none",
                              borderColor: "divider",
                            }}
                          >
                            <InfoRow
                              label="Franchise Model"
                              value={fico.franchiseModel}
                              icon={<Store />}
                            />
                            <InfoRow
                              label="Franchise Type"
                              value={fico.franchiseType}
                              icon={<Sell />}
                            />
                            <InfoRow
                              label="Investment Range"
                              value={fico.investmentRange}
                            />
                            <InfoRow
                              label="Franchise Fee"
                              value={`₹${fico.franchiseFee}`}
                            />
                            <InfoRow
                              label="Royalty Fee"
                              value={`${fico.royaltyFee}${fico.royaltyFeeUnit}`}
                            />
                            <InfoRow
                              label="Area Required"
                              value={fico.areaRequired}
                            />
                            <InfoRow
                              label="Agreement Period"
                              value={`${fico.agreementPeriod} years`}
                            />
                            <InfoRow label="ROI" value={`${fico.roi}%`} />
                            <InfoRow
                              label="Payback Period"
                              value={fico.payBackPeriod}
                            />
                            <InfoRow
                              label="Break Even"
                              value={fico.breakEven}
                            />
                            <InfoRow
                              label="Margin on Sales"
                              value={`${fico.marginOnSales}%`}
                            />
                          </Box>
                        ))
                      ) : (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ textAlign: "center", py: 3 }}
                        >
                          No investment details available
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                {/* USPs and Training */}
                <Grid item xs={12} md={6}>
                  {renderArrayData(
                    franchiseDetails?.uniqueSellingPoints,
                    "Unique Selling Points",
                    <Sell />
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  {renderArrayData(
                    franchiseDetails?.trainingSupport,
                    "Training & Support",
                    <SupportAgent />
                  )}
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              {expansionlocationdata ? (
                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "primary.main",
                        mb: 3,
                      }}
                    >
                      <TrendingUp sx={{ mr: 1 }} /> Expansion Plans
                    </Typography>

                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        {renderExpansionLocations()}
                      </Grid>
                      <Grid item xs={12}>
                        {renderCurrentOutletLocations()}
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: "center", py: 4 }}
                >
                  No expansion data available
                </Typography>
              )}
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "primary.main",
                      mb: 3,
                    }}
                  >
                    <Image sx={{ mr: 1 }} /> Media & Documents
                  </Typography>

                  <Grid container spacing={3}>
                    {/* Brand Logo */}
                    {uploads?.logo && (
                      <Grid item xs={12} sm={6} md={4}>
                        <Typography
                          variant="subtitle2"
                          fontWeight="bold"
                          sx={{ mb: 1 }}
                        >
                          Brand Logo
                        </Typography>
                        <Box
                          sx={{
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 2,
                            p: 1.5,
                            display: "inline-block",
                          }}
                        >
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
                    {uploads?.exteriorOutlet?.length > 0 && (
                      <Grid item xs={12}>
                        <Typography
                          variant="subtitle2"
                          fontWeight="bold"
                          sx={{ mb: 1 }}
                        >
                          Exterior Outlet Images (
                          {uploads.exteriorOutlet.length})
                        </Typography>
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}
                        >
                          {uploads.exteriorOutlet.map((img, index) => (
                            <Box
                              key={index}
                              sx={{
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 2,
                                p: 1.5,
                              }}
                            >
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
                    {uploads?.interiorOutlet?.length > 0 && (
                      <Grid item xs={12}>
                        <Typography
                          variant="subtitle2"
                          fontWeight="bold"
                          sx={{ mb: 1 }}
                        >
                          Interior Outlet Images (
                          {uploads.interiorOutlet.length})
                        </Typography>
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}
                        >
                          {uploads.interiorOutlet.map((img, index) => (
                            <Box
                              key={index}
                              sx={{
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 2,
                                p: 1.5,
                              }}
                            >
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
                        <Typography
                          variant="subtitle2"
                          fontWeight="bold"
                          sx={{
                            mb: 1,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
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
                      <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        sx={{
                          mb: 1,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Description sx={{ mr: 1 }} /> Documents
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        {uploads?.gstCertificate && (
                          <DocLink
                            label="GST Certificate"
                            url={uploads.gstCertificate}
                            icon={<PictureAsPdf />}
                          />
                        )}

                        {uploads?.pancard && (
                          <DocLink
                            label="PAN Card"
                            url={uploads.pancard}
                            icon={<PictureAsPdf />}
                          />
                        )}

                        {uploads?.businessPlan && (
                          <DocLink
                            label="Business Plan"
                            url={uploads.businessPlan}
                            icon={<Description />}
                          />
                        )}
                      </Box>
                    </Grid>

                    {/* Awards */}
                    {uploads?.awards?.length > 0 && (
                      <Grid item xs={12}>
                        <Typography
                          variant="subtitle2"
                          fontWeight="bold"
                          sx={{
                            mb: 1,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <EmojiEvents sx={{ mr: 1 }} /> Awards & Recognitions (
                          {uploads.awards.length})
                        </Typography>
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}
                        >
                          {uploads.awards.map((award, index) => (
                            <Box
                              key={index}
                              sx={{
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 2,
                                p: 1.5,
                              }}
                            >
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
          </Box>
        </Box>

        {/* Bottom bar (optional) */}
        <Box
          sx={{
            px: 3,
            py: 2,
            borderTop: "1px solid",
            borderColor: "divider",
            background: alpha(customTheme.palette.secondary.light, 0.1),
          }}
        >
          <Button
            onClick={onClose}
            variant="contained"
            color="primary"
            size="large"
            sx={{ borderRadius: 2, px: 3 }}
            fullWidth={fullScreen}
          >
            Close
          </Button>
        </Box>
      </Drawer>
    </ThemeProvider>
  );
};

// Helper component for consistent info row styling
const InfoRow = ({
  label,
  value,
  icon,
  isLink = false,
  linkType,
  multiline = false,
}) => {
  if (!value) return null;

  let content = value;
  if (isLink) {
    let href = value;
    if (linkType === "mailto") href = `mailto:${value}`;
    if (linkType === "tel") href = `tel:${value}`;

    content = (
      <Link
        href={href}
        target={!linkType ? "_blank" : undefined}
        rel="noopener"
        sx={{ display: "inline-flex", alignItems: "center" }}
      >
        {value} {!linkType && <ArrowOutward sx={{ fontSize: 14, ml: 0.5 }} />}
      </Link>
    );
  }

  return (
    <Box
      sx={{
        mb: 1.5,
        display: "flex",
        alignItems: multiline ? "flex-start" : "center",
      }}
    >
      {icon &&
        React.cloneElement(icon, {
          sx: {
            fontSize: 18,
            mr: 1,
            color: "primary.main",
            flexShrink: 0,
            mt: multiline ? 0.5 : 0,
          },
        })}
      <Box>
        {label && (
          <Typography
            variant="subtitle2"
            component="span"
            fontWeight="bold"
            sx={{ mr: 0.5 }}
          >
            {label}:
          </Typography>
        )}
        <Typography
          variant="body2"
          component="span"
          sx={{ wordBreak: "break-word" }}
        >
          {content}
        </Typography>
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
      justifyContent: "flex-start",
      textTransform: "none",
      borderRadius: 1,
    }}
  >
    {label}
  </Button>
);

export default BrandInfoDrawer;
