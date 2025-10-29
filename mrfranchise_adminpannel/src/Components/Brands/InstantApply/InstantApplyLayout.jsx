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
} from "@mui/material";
import {
  List as ListIcon,
  Add as AddIcon,
  CloudUpload as CloudUploadIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';
import InstantApplyFilters from "../../../ui/InstantApplyUI/InstantApplyFilters";
import InstantApplyTable from "../../../ui/InstantApplyUI/InstantApplyTable";
import InstantApplyDialog from "../../../ui/InstantApplyUI/InstantApplyDialog";
import InstantApplyForm from "../../../ui/InstantApplyUI/InstantApplyForm";
import dayjs from "dayjs";

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
  const [page, setPage] = useState(0);
  const [limit, setlimit] = useState(10);
  const [totalPages, settotalPages] = useState(0);

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
  const [toDate, setToDate] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [clearFilter, setclearFilter] = useState(true);
  const [clearFilterloading, setclearFilterloading] = useState(false);

  // Mock selected brand for forms - you might want to get this from props or context
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

  // Existing useEffect and functions remain the same
  useEffect(() => {
    const fetchInstantApply = async () => {
      try {
        if (
          adminData?.adminData?.uuid &&
          adminData?.adminAccessToken &&
          clearFilter
        ) {
          setclearFilter(false);

          const resdata = await GetApiCall(
            `${Api.admin.get.instantApply.data}/${adminData?.adminData?.uuid}`,
            adminData?.adminAccessToken
          );

          const dropdownres = await GetApiCall(
            `${Api.admin.get.instantApply.dropdown}/${adminData?.adminData?.uuid}`,
            adminData?.adminAccessToken
          );

          console.log("Initial API Response:", resdata?.data);

          const listData = resdata?.data?.data?.data;
          setInstantApplyList(Array.isArray(listData) ? listData : []);

          if (dropdownres?.data?.success) {
            const dropdownData = dropdownres.data.data || {};
            setCities(dropdownData.cities || []);
            setDistricts(dropdownData.districts || []);
            setInvestmentRanges(dropdownData.investmentRanges || []);
            setStates(dropdownData.states || []);
            setclearFilterloading(false);
            setPage(
              (resdata?.data?.data?.pagination?.page ||
                resdata?.data?.data?.pagination?.currentPage ||
                1) + 1
            );
            settotalPages(
              resdata?.data?.data?.pagination?.totalPages ||
                resdata?.data?.data?.pagination?.total
            );
            setlimit(
              resdata?.data?.data?.pagination?.limit ||
                resdata?.data?.data?.pagination?.limit
            );
          }
        }
      } catch (error) {
        console.error("Error fetching Instant Apply:", error);
      }
    };

    fetchInstantApply();
  }, [adminData, clearFilter]);

  const handleChange = async (label, value, setter) => {
    try {
      setter(value);

      let payload = {
        city: label === "city" ? value : selectedCity,
        district: label === "district" ? value : selectedDistrict,
        state: label === "state" ? value : selectedState,
        investmentRange: label === "investmentRange" ? value : selectedRange,
      };

      let resdata;

      if (label === "searchTerm") {
        payload = {
          searchTerm: label === "searchTerm" ? value : searchTerm,
        };
        resdata = await PostApiCall(
          `${Api.admin.get.instantApply.filterandsearch}/${adminData?.adminData?.uuid}`,
          adminData?.adminAccessToken,
          { payload }
        );
      } else if (label === "fromDate" || label === "toDate") {
        setSearchTerm("");
        payload = {
          fromDate:
            label === "fromDate"
              ? dayjs(value).format("YYYY-MM-DD")
              : fromDate
              ? dayjs(fromDate).format("YYYY-MM-DD")
              : null,
          toDate:
            label === "toDate"
              ? dayjs(value).format("YYYY-MM-DD")
              : toDate
              ? dayjs(toDate).format("YYYY-MM-DD")
              : null,
        };
        resdata = await PostApiCall(
          `${Api.admin.get.instantApply.filterandsearch}/${adminData?.adminData?.uuid}`,
          adminData?.adminAccessToken,
          { payload }
        );
      } else {
        setSearchTerm("");
        resdata = await PostApiCall(
          `${Api.admin.get.instantApply.filterandsearch}/${adminData?.adminData?.uuid}`,
          adminData?.adminAccessToken,
          { payload }
        );
      }

      const data = resdata?.data?.data;
      console.log("Filter/Search API Response:", data);
      if (resdata?.data?.success && data) {
        setInstantApplyList(Array.isArray(data?.data) ? data?.data : []);
        setPage(
          (resdata?.data?.data?.pagination?.page ||
            resdata?.data?.data?.pagination?.currentPage ||
            1) + 1
        );
        settotalPages(
          resdata?.data?.data?.pagination?.totalPages ||
            resdata?.data?.data?.pagination?.total
        );
        setlimit(
          resdata?.data?.data?.pagination?.limit ||
            resdata?.data?.data?.pagination?.limit
        );
      }
      if (resdata?.data?.success && data?.districts?.length > 0) {
        setDistricts(data?.districts);
      }
      if (resdata?.data?.success && data?.investmentRanges?.length > 0) {
        setInvestmentRanges(data?.investmentRanges);
      }
      if (resdata?.data?.success && data?.states?.length > 0) {
        setStates(data?.states);
      }
      if (resdata?.data?.success && data?.cities?.length > 0) {
        setCities(data?.cities);
      }
    } catch (error) {
      console.error("Error in handleChange:", error);
    }
  };

  const handleClear = async () => {
    setSelectedCity("");
    setSelectedDistrict("");
    setSelectedRange("");
    setSelectedState("");
    setSearchTerm("");
    setFromDate(null);
    setToDate(null);
    setclearFilterloading(true);
    setclearFilter(true);
  };

  const handlePagination = async () => {
    try {
      let payload = {
        city: selectedCity,
        district: selectedDistrict,
        state: selectedState,
        investmentRange: selectedRange,
        page: page,
      };

      let resdata;

      if (searchTerm) {
        payload = {
          searchTerm: searchTerm,
          page: page,
        };
        resdata = await PostApiCall(
          `${Api.admin.get.instantApply.filterandsearch}/${adminData?.adminData?.uuid}`,
          adminData?.adminAccessToken,
          { payload }
        );
      } else if (fromDate || toDate) {
        payload = {
          fromDate: dayjs(fromDate).format("YYYY-MM-DD"),
          toDate: dayjs(toDate).format("YYYY-MM-DD"),
          page: page,
        };

        resdata = await PostApiCall(
          `${Api.admin.get.instantApply.filterandsearch}/${adminData?.adminData?.uuid}`,
          adminData?.adminAccessToken,
          { payload }
        );
      } else {
        payload = {
          page: page,
        };
        setSearchTerm("");
        resdata = await PostApiCall(
          `${Api.admin.get.instantApply.filterandsearch}/${adminData?.adminData?.uuid}`,
          adminData?.adminAccessToken,
          { payload }
        );
      }

      const data = resdata?.data?.data;
      if (resdata?.data?.success && data) {
        setInstantApplyList([
          ...instantApplyList,
          ...(Array.isArray(data?.data) ? data?.data : []),
        ]);
        setPage(
          (resdata?.data?.data?.pagination?.page ||
            resdata?.data?.data?.pagination?.currentPage ||
            1) + 1
        );
        settotalPages(
          resdata?.data?.data?.pagination?.totalPages ||
            resdata?.data?.data?.pagination?.total
        );
        setlimit(
          resdata?.data?.data?.pagination?.limit ||
            resdata?.data?.data?.pagination?.limit
        );
      }
    } catch (error) {
      console.log("error in pagination", error);
    }
  };

  // Function to refresh the list after successful submission
  const handleRefreshList = () => {
    setclearFilter(true);
    setTabValue(0); // Switch back to list view
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper elevation={2} sx={{ margin: 2 }}>
        {/* Header */}
        <Box sx={{ p: 2, pb: 0 }}>
          <Typography variant="h5" sx={{ mb: 1 }}>
            Instant Apply Management
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Manage investment applications, add new entries, and bulk upload data
          </Typography>
        </Box>

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
                <Badge badgeContent={instantApplyList.length} color="primary" max={999}>
                  Applications List
                </Badge>
              }
              iconPosition="start"
              {...a11yProps(0)} 
            />
            <Tab 
              icon={<AddIcon />} 
              label="Add New Application"
              iconPosition="start"
              {...a11yProps(1)} 
            />
            <Tab 
              icon={<CloudUploadIcon />} 
              label="Bulk Upload"
              iconPosition="start"
              {...a11yProps(2)} 
            />
            {/* <Tab 
              icon={<AnalyticsIcon />} 
              label="Analytics"
              iconPosition="start"
              {...a11yProps(3)} 
            /> */}
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <TabPanel value={tabValue} index={0}>
          {/* Existing List View */}
          <Box sx={{ px: 2 }}>
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
              handleChange={handleChange}
              fromDate={fromDate}
              setFromDate={setFromDate}
              setToDate={setToDate}
              toDate={toDate}
              handleClear={handleClear}
              clearFilterloading={clearFilterloading}
            />

            <Divider sx={{ my: 2 }} />

            <InstantApplyTable
              instantApplyList={instantApplyList}
              setSelectedItem={setSelectedItem}
              page={page}
              setPage={setPage}
              handlePagination={handlePagination}
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

        {/* <TabPanel value={tabValue} index={3}>
          {/* Analytics/Stats View 
          <Box sx={{ px: 2 }}>
            <Typography variant="h6" gutterBottom>
              Application Analytics
            </Typography>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: 2, 
              mb: 3 
            }}>
              <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {instantApplyList.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Applications
                </Typography>
              </Paper>
              <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="success.main">
                  {states.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  States Covered
                </Typography>
              </Paper>
              <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main">
                  {cities.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cities Covered
                </Typography>
              </Paper>
              <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="info.main">
                  {investmentRanges.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Investment Ranges
                </Typography>
              </Paper>
            </Box>
            
            {/* You can add more analytics components here *
            <Typography variant="body1" color="text.secondary" sx={{ mt: 4 }}>
              📊 More detailed analytics coming soon...
            </Typography>
          </Box>
        </TabPanel> */}
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
