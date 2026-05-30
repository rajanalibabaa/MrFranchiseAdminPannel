import React, { useEffect, useState, useCallback } from "react";
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
import axios from "axios";

const InstantApplyLayout = () => {
  const { adminData } = useSelector((state) => state.admin);
  
  // Tab state
  const [tabValue, setTabValue] = useState(0);

  // Existing states
  const [instantApplyList, setInstantApplyList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100); // Updated to 100 as per backend
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);

  // Error and loading states
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clearFilterLoading, setClearFilterLoading] = useState(false);

  // Dropdown arrays - Fixed structure
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [investmentRanges, setInvestmentRanges] = useState([]);
  const [categories, setCategories] = useState([]); // Added categories
  const [industries, setIndustries] = useState([]); // Added industries
  const [states, setStates] = useState([]);

  // Selected filters - Added all filters
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedRange, setSelectedRange] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(""); // Added category filter
  const [selectedIndustry, setSelectedIndustry] = useState(""); // Added industry filter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplyBy, setSelectedApplyBy] = useState("");

  const SCHEMA_NAME = 'FoodAndBeverageLeads';

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

  // Fixed fetch function with proper filter handling including all filters
  const fetchLeads = useCallback(async (pageNum = 1, isLoadMore = false) => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters with proper encoding
      const queryParams = new URLSearchParams();
      
      // Always add pagination and sorting
      queryParams.append('page', pageNum.toString());
      queryParams.append('limit', limit.toString());
      queryParams.append('sortBy', 'createdAt');
      queryParams.append('sortOrder', 'desc');

      // Add filters only if they have values
      if (selectedState?.trim()) {
        queryParams.append('state', selectedState.trim());
      }
      if (selectedCity?.trim()) {
        queryParams.append('city', selectedCity.trim());
      }
      if (selectedDistrict?.trim()) {
        queryParams.append('district', selectedDistrict.trim());
      }
      if (selectedRange?.trim()) {
        queryParams.append('investmentRange', selectedRange.trim());
      }
      if (selectedCategory?.trim()) {
        queryParams.append('category', selectedCategory.trim());
      }
      if (selectedIndustry?.trim()) {
        queryParams.append('industry', selectedIndustry.trim());
      }
      if (selectedApplyBy?.trim()) {
        queryParams.append('applyBy', selectedApplyBy.trim());
      }
      
      // Use fullName for search
      if (searchTerm?.trim()) {
        queryParams.append('fullName', searchTerm.trim());
      }

      const apiUrl = `${Api.admin.get.instantApply.data}/${SCHEMA_NAME}?${queryParams.toString()}`;

      const response = await axios.get(apiUrl);

      if (response?.data?.success) {
        const responseData = response.data.data;
        const newLeads = responseData.data || [];
        const pagination = responseData.pagination || {};


        // Handle duplicate keys by ensuring unique identification
        if (isLoadMore) {
          setInstantApplyList(prev => {
            const existingIds = new Set(prev.map(item => item._id));
            const uniqueNewLeads = newLeads.filter(lead => !existingIds.has(lead._id));
            return [...prev, ...uniqueNewLeads];
          });
        } else {
          setInstantApplyList(newLeads);
          // Extract unique values for dropdowns from the data
          if (newLeads.length > 0) {
            extractDropdownValues(newLeads);
          } else {
            // Clear dropdown options if no data
            resetDropdownValues();
          }
        }

        setTotalPages(pagination.totalPages || 0);
        setTotalCount(pagination.totalCount || 0);
        setHasNextPage(pagination.hasNextPage || false);
        setPage(pagination.currentPage || pageNum);
        
      } else {
        // Handle no data scenarios
        
        if (!isLoadMore) {
          setInstantApplyList([]);
          setTotalCount(0);
          setTotalPages(0);
          resetDropdownValues();
        }

        // Set appropriate error message
        const hasActiveFilters = selectedState || selectedCity || selectedDistrict || 
                                selectedRange || selectedCategory || selectedIndustry || 
                                selectedApplyBy || searchTerm;

        if (hasActiveFilters) {
          setError("No leads found matching the applied filters.");
        } else {
          setError(`No leads available for ${SCHEMA_NAME}.`);
        }
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
      let errorMessage = "Network error occurred";
      
      if (error.response) {
        console.log("Error response:", error.response);
        if (error.response.status === 404) {
          errorMessage = "No leads found matching the current filters.";
        } else if (error.response.status === 400) {
          errorMessage = error.response.data?.message || "Invalid request parameters.";
        } else if (error.response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        } else {
          errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage = "Network connection error. Please check your internet connection.";
      } else {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      
      if (!isLoadMore) {
        setInstantApplyList([]);
        setTotalCount(0);
        setTotalPages(0);
        resetDropdownValues();
      }
    } finally {
      setLoading(false);
      setClearFilterLoading(false);
    }
  }, [selectedState, selectedCity, selectedDistrict, selectedRange, selectedCategory, selectedIndustry, selectedApplyBy, searchTerm, limit]);

  // Reset dropdown values
  const resetDropdownValues = () => {
    setStates([]);
    setCities([]);
    setDistricts([]);
    setInvestmentRanges([]);
    setCategories([]);
    setIndustries([]);
  };

  // Extract unique values as simple string arrays including all fields
  const extractDropdownValues = (data) => {
    const uniqueStates = [...new Set(data.map(item => item.state).filter(Boolean))];
    const uniqueCities = [...new Set(data.map(item => item.city).filter(Boolean))];
    const uniqueDistricts = [...new Set(data.map(item => item.district).filter(Boolean))];
    const uniqueRanges = [...new Set(data.map(item => item.investmentRange).filter(Boolean))];
    const uniqueCategories = [...new Set(data.map(item => item.category).filter(Boolean))];
    const uniqueIndustries = [...new Set(data.map(item => item.industry).filter(Boolean))];

    // Set as simple string arrays, not objects
    setStates(uniqueStates.sort());
    setCities(uniqueCities.sort());
    setDistricts(uniqueDistricts.sort());
    setInvestmentRanges(uniqueRanges.sort());
    setCategories(uniqueCategories.sort());
    setIndustries(uniqueIndustries.sort());

    // console.log("Extracted dropdown values:", {
    //   states: uniqueStates,
    //   cities: uniqueCities,
    //   districts: uniqueDistricts,
    //   ranges: uniqueRanges,
    //   categories: uniqueCategories,
    //   industries: uniqueIndustries
    // });
  };

  // Initial load
  useEffect(() => {
   
    
    if (adminData?.adminData?.uuid && adminData?.adminAccessToken) {
      fetchLeads(1, false);
    }
  }, [adminData?.adminData?.uuid, adminData?.adminAccessToken, fetchLeads]);

  // Improved filter change handler including all filters
  const handleChange = useCallback((label, value, setter) => {
    
    // Update the relevant state
    switch (label) {
      case 'searchTerm':
        setSearchTerm(value);
        break;
      case 'state':
        setSelectedState(value);
        // Reset dependent filters
        setSelectedCity("");
        setSelectedDistrict("");
        break;
      case 'city':
        setSelectedCity(value);
        break;
      case 'district':
        setSelectedDistrict(value);
        break;
      case 'investmentRange':
        setSelectedRange(value);
        break;
      case 'category':
        setSelectedCategory(value);
        break;
      case 'industry':
        setSelectedIndustry(value);
        break;
      case 'applyBy':
        setSelectedApplyBy(value);
        break;
      default:
        console.warn(`Unknown filter label: ${label}`);
    }
    
    // Reset page to 1 when filters change
    setPage(1);
  }, []);

  // Trigger fetch when filter states change (with debounce)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (adminData?.adminData?.uuid) {
        fetchLeads(1, false);
      }
    }, 500); // Increased debounce to 500ms for better UX

    return () => clearTimeout(timeoutId);
  }, [
    selectedState, 
    selectedCity, 
    selectedDistrict, 
    selectedRange, 
    selectedCategory, 
    selectedIndustry, 
    selectedApplyBy, 
    searchTerm, 
    fetchLeads, 
    adminData?.adminData?.uuid
  ]);

  // Clear filters handler
  const handleClear = useCallback(() => {
    
    // Clear all filter states
    setSelectedCity("");
    setSelectedDistrict("");
    setSelectedRange("");
    setSelectedState("");
    setSelectedCategory("");
    setSelectedIndustry("");
    setSearchTerm("");
    setSelectedApplyBy("");
    setError(null);
    setPage(1);
    setClearFilterLoading(true);
    
    // Fetch all data without filters after a short delay
    setTimeout(() => {
      fetchLeads(1, false);
    }, 100);
  }, [fetchLeads]);

  // Handle pagination (load more)
  const handlePagination = useCallback(() => {
    if (hasNextPage && !loading) {
      fetchLeads(page + 1, true);
    }
  }, [hasNextPage, loading, page, fetchLeads]);

  // Function to refresh the list after successful submission
  const handleRefreshList = useCallback(() => {
    setError(null);
    setPage(1);
    fetchLeads(1, false);
    setTabValue(0); // Switch back to list view
  }, [fetchLeads]);

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
              Brand ID: {adminData?.adminData?.uuid} | Schema: {SCHEMA_NAME} | Limit: {limit}
            </Typography>
          )}
        </Box>

        {/* Error Alert */}
        {error && (
          <Box sx={{ px: 2, pb: 2 }}>
            <Alert 
              severity={error.includes('No leads found') || error.includes('No leads available') ? 'info' : 'warning'}
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
            {/* <Tab 
              icon={<ListIcon />} 
              label={
                <Badge 
                  badgeContent={totalCount || 0}
                  color="warning" 
                  max={9999}
                >
                  Food & Beverages Leads
                </Badge>
              }
              iconPosition="start"
              {...a11yProps(0)} 
            /> */}
            <Tab 
              icon={<AddIcon />} 
              label="Manual Lead Submission"
              iconPosition="start"
              {...a11yProps(0)} 
            />
            <Tab 
              icon={<CloudUploadIcon />} 
              label="Lead Bulk Upload"
              iconPosition="start"
              {...a11yProps(1)} 
            />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        {/* <TabPanel value={tabValue} index={0}>
          {/* List View 
          <Box sx={{ px: 2 }}>
            {loading && !clearFilterLoading && instantApplyList.length === 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading leads...</Typography>
              </Box>
            )}
            
            <InstantApplyFilters
              cities={cities}
              districts={districts}
              investmentRanges={investmentRanges}
              categories={categories} // Added categories
              industries={industries} // Added industries
              states={states}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              selectedDistrict={selectedDistrict}
              setSelectedDistrict={setSelectedDistrict}
              selectedRange={selectedRange}
              setSelectedRange={setSelectedRange}
              selectedCategory={selectedCategory} // Added category props
              setSelectedCategory={setSelectedCategory}
              selectedIndustry={selectedIndustry} // Added industry props
              setSelectedIndustry={setSelectedIndustry}
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
        </TabPanel> */}

        <TabPanel value={tabValue} index={0}>
          {/* Manual Form */}
          <Box sx={{ px: 2 }}>
            <ManualSubmissionForm 
              selectedBrand={selectedBrand}
              onClose={handleRefreshList}
              onSuccess={handleRefreshList}
            />
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
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
