import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { GetApiCall } from "../../../api/default/GetApi";
import { PostApiCall } from "../../../api/default/PostApi";
import { Api } from "../../../api/apiurl";
import {
  TableContainer,
  Paper,
  Typography,
  Tabs,
  Tab,
  Box,
  Badge,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  List as ListIcon,
  Add as AddIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';
import InstantApplyFilters from "../../../ui/InstantApplyUI/InstantApplyFilters";
import InstantApplyTable from "../../../ui/InstantApplyUI/InstantApplyTable";
import InstantApplyDialog from "../../../ui/InstantApplyUI/InstantApplyDialog";

// Import the new components we created
import ManualSubmissionForm from "../../InstantapplyFunctions/InstantapplyManualFunction";
import ExcelUploadForm from "../../InstantapplyFunctions/ExcelUploadInstantApplyForm";

const InstantApplyLayout = () => {
  const { adminData } = useSelector((state) => state.admin);
  
  // Tab state
  const [tabValue, setTabValue] = useState(0);

  // Existing states
  const [instantApplyList, setInstantApplyList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);

  // Error and loading states
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clearFilterLoading, setClearFilterLoading] = useState(false);

  // Dropdown arrays
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [investmentRanges, setInvestmentRanges] = useState([]);
  const [states, setStates] = useState([]);

  // Selected filters
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedRange, setSelectedRange] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplyBy, setSelectedApplyBy] = useState("");
  const [clearFilter, setClearFilter] = useState(true);

  // Dynamic schema name based on admin data or fallback options
  const getSchemaName = () => {
    // You can customize this based on your admin data structure
    const industry = adminData?.adminData?.industry;
    const category = adminData?.adminData?.category;
    
    // Try different schema names based on available data
    if (industry === "Food & Beverages" || category === "Food") {
      return "FoodAndBeverageLeads";
    }
    
    // Add more schema mappings as needed
    // return "GeneralLeads"; // fallback
    return "FoodAndBeverageLeads"; // current fallback
  };

  const SCHEMA_NAME = getSchemaName();

  // Mock selected brand for forms
  const [selectedBrand] = useState([
    {
      uuid: adminData?.adminData?.uuid,
      brandDetails: {
        brandName: adminData?.adminData?.brandName || 'Admin Brand'
      }
    }
  ]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Custom TabPanel component
  const TabPanel = ({ children, value, index, ...other }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`instant-apply-tabpanel-${index}`}
      aria-labelledby={`instant-apply-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  // Tab props for accessibility
  const a11yProps = (index) => ({
    id: `instant-apply-tab-${index}`,
    'aria-controls': `instant-apply-tabpanel-${index}`,
  });

  // Fetch leads with filters
  const fetchLeads = async (pageNum = 1, isLoadMore = false) => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const queryParams = new URLSearchParams({
        page: pageNum.toString(),
        limit: limit.toString(),
        sortBy: "createdAt",
        sortOrder: "desc"
      });

      // Add brand filter - this is crucial
      if (adminData?.adminData?.uuid) {
        queryParams.append('brandId', adminData.adminData.uuid);
      }

      // Add other filters if selected
      if (selectedState) queryParams.append('state', selectedState);
      if (selectedCity) queryParams.append('city', selectedCity);
      if (selectedRange) queryParams.append('investmentRange', selectedRange);
      if (selectedApplyBy) queryParams.append('applyBy', selectedApplyBy);
      if (searchTerm) queryParams.append('investorEmail', searchTerm);

      const apiUrl = `${Api.admin.get.instantApply.data}/${SCHEMA_NAME}?${queryParams.toString()}`;
      console.log("Making API call to:", apiUrl);
      console.log("Query params:", Object.fromEntries(queryParams));

      const response = await GetApiCall(
        apiUrl,
        adminData?.adminAccessToken
      );

      console.log("Full API Response:", response);

      if (response?.data?.success) {
        const responseData = response.data.data;
        const newLeads = responseData.data || [];
        const pagination = responseData.pagination || {};

        console.log("New leads data:", newLeads);
        console.log("Pagination info:", pagination);

        if (isLoadMore) {
          setInstantApplyList(prev => [...prev, ...newLeads]);
        } else {
          setInstantApplyList(newLeads);
          // Extract unique values for dropdowns from the data
          if (newLeads.length > 0) {
            extractDropdownValues(newLeads);
          }
        }

        setTotalPages(pagination.totalPages || 0);
        setTotalCount(pagination.totalCount || 0);
        setHasNextPage(pagination.hasNextPage || false);
        setPage(pagination.currentPage || pageNum);
        
      } else {
        // Handle 404 or no data scenarios
        if (response?.data?.statuscode === 404) {
          console.log("No data found for schema:", SCHEMA_NAME);
          setError(`No leads found for ${SCHEMA_NAME}. This could mean:
            1. No leads have been submitted yet
            2. The schema name might be incorrect
            3. All leads are filtered out by the current filters`);
        } else {
          setError(response?.data?.message || "Failed to fetch leads");
        }
        
        if (!isLoadMore) {
          setInstantApplyList([]);
          setTotalCount(0);
          setTotalPages(0);
        }
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
      setError(`Network error: ${error.message}`);
      if (!isLoadMore) {
        setInstantApplyList([]);
        setTotalCount(0);
        setTotalPages(0);
      }
    } finally {
      setLoading(false);
      setClearFilterLoading(false);
    }
  };

  // Extract unique values for dropdowns from API data
  const extractDropdownValues = (data) => {
    const uniqueStates = [...new Set(data.map(item => item.state).filter(Boolean))];
    const uniqueCities = [...new Set(data.map(item => item.city).filter(Boolean))];
    const uniqueDistricts = [...new Set(data.map(item => item.district).filter(Boolean))];
    const uniqueRanges = [...new Set(data.map(item => item.investmentRange).filter(Boolean))];

    setStates(uniqueStates.map(state => ({ name: state, value: state })));
    setCities(uniqueCities.map(city => ({ name: city, value: city })));
    setDistricts(uniqueDistricts.map(district => ({ name: district, value: district })));
    setInvestmentRanges(uniqueRanges.map(range => ({ name: range, value: range })));

    console.log("Extracted dropdown values:", {
      states: uniqueStates,
      cities: uniqueCities,
      districts: uniqueDistricts,
      ranges: uniqueRanges
    });
  };

  // Initial load
  useEffect(() => {
    console.log("Initial useEffect triggered");
    console.log("Admin data:", adminData);
    
    if (adminData?.adminData?.uuid && adminData?.adminAccessToken && clearFilter) {
      console.log("Conditions met, fetching leads...");
      setClearFilter(false);
      fetchLeads(1, false);
    }
  }, [adminData, clearFilter]);

  // Handle filter changes
  const handleChange = async (label, value, setter) => {
    try {
      console.log(`Filter changed - ${label}: ${value}`);
      setter(value);
      
      // Update the relevant state immediately
      const updates = {
        searchTerm: () => setSearchTerm(value),
        state: () => setSelectedState(value),
        city: () => setSelectedCity(value),
        district: () => setSelectedDistrict(value),
        investmentRange: () => setSelectedRange(value),
        applyBy: () => setSelectedApplyBy(value),
      };

      if (updates[label]) {
        updates[label]();
      }
      
      // Reset page to 1 when filters change
      setPage(1);
      
      // Small delay to ensure state is updated
      setTimeout(() => {
        fetchLeads(1, false);
      }, 100);
    } catch (error) {
      console.error("Error in handleChange:", error);
    }
  };

  // Handle clear filters
  const handleClear = () => {
    console.log("Clearing all filters");
    setSelectedCity("");
    setSelectedDistrict("");
    setSelectedRange("");
    setSelectedState("");
    setSearchTerm("");
    setSelectedApplyBy("");
    setError(null);
    setClearFilterLoading(true);
    setClearFilter(true);
  };

  // Handle pagination (load more)
  const handlePagination = () => {
    if (hasNextPage && !loading) {
      console.log("Loading more data, page:", page + 1);
      fetchLeads(page + 1, true);
    }
  };

  // Function to refresh the list after successful submission
  const handleRefreshList = () => {
    console.log("Refreshing list");
    setError(null);
    setClearFilter(true);
    setTabValue(0); // Switch back to list view
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper elevation={2} sx={{ margin: 2 }}>
        {/* Header */}
        <Box sx={{ p: 2, pb: 0 }}>
          <Typography variant="h5" textAlign={'center'} color="warning" sx={{ mb: 1 }}>
            Instant Apply Management ({SCHEMA_NAME})
          </Typography>
          
          {/* Debug info in development */}
          {process.env.NODE_ENV === 'development' && (
            <Typography variant="caption" display="block" textAlign="center" sx={{ mb: 1, color: 'text.secondary' }}>
              Brand ID: {adminData?.adminData?.uuid} | Schema: {SCHEMA_NAME}
            </Typography>
          )}
        </Box>

        {/* Error Alert */}
        {error && (
          <Box sx={{ px: 2, pb: 2 }}>
            <Alert 
              severity="warning" 
              sx={{ mb: 2 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          </Box>
        )}

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="instant apply tabs"
            sx={{ px: 2 }}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab 
              icon={<ListIcon />} 
              label={
                <Badge 
                  badgeContent={totalCount}
                  color="warning" 
                  max={999}
                >
                  Direct Leads List 
                </Badge>
              }
              iconPosition="start"
              {...a11yProps(0)} 
            />
            <Tab 
              icon={<AddIcon />} 
              label="Manual Lead Submission"
              iconPosition="start"
              {...a11yProps(1)} 
            />
            <Tab 
              icon={<CloudUploadIcon />} 
              label="Lead Bulk Upload"
              iconPosition="start"
              {...a11yProps(2)} 
            />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <TabPanel value={tabValue} index={0}>
          {/* List View */}
          <Box sx={{ px: 2 }}>
            {loading && !clearFilterLoading && instantApplyList.length === 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            )}
            
            <InstantApplyFilters
              cities={cities}
              districts={districts}
              investmentRanges={investmentRanges}
              states={states}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              selectedDistrict={selectedDistrict}
              setSelectedDistrict={setSelectedDistrict}
              selectedRange={selectedRange}
              setSelectedRange={setSelectedRange}
              selectedState={selectedState}
              setSelectedState={setSelectedState}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedApplyBy={selectedApplyBy}
              setSelectedApplyBy={setSelectedApplyBy}
              handleChange={handleChange}
              handleClear={handleClear}
              clearFilterloading={clearFilterLoading}
              loading={loading}
            />

            <Divider sx={{ my: 2 }} />

            <InstantApplyTable
              instantApplyList={instantApplyList}
              setSelectedItem={setSelectedItem}
              page={page}
              setPage={setPage}
              totalPages={totalPages}
              totalCount={totalCount}
              hasNextPage={hasNextPage}
              handlePagination={handlePagination}
              loading={loading}
            />
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {/* Manual Form */}
          <Box sx={{ px: 2 }}>
            <ManualSubmissionForm 
              selectedBrand={selectedBrand}
              onClose={handleRefreshList}
              onSuccess={handleRefreshList}
            />
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {/* Bulk Upload */}
          <Box sx={{ px: 2 }}>
            <ExcelUploadForm 
              selectedBrand={selectedBrand}
              onSuccess={handleRefreshList}
            />
          </Box>
        </TabPanel>
      </Paper>

      {/* Dialogs */}
      <InstantApplyDialog
        selectedItem={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </Box>
  );
};

export default InstantApplyLayout;
