import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { GetApiCall } from "../../../api/default/GetApi";
import { PostApiCall } from "../../../api/default/PostApi";
import { Api } from "../../../api/apiurl";
import {
  TableContainer,
  Paper,
  Typography,
  TablePagination,
} from "@mui/material";
import InstantApplyFilters from "../../../ui/InstantApplyUI/InstantApplyFilters";
import InstantApplyTable from "../../../ui/InstantApplyUI/InstantApplyTable";
import InstantApplyDialog from "../../../ui/InstantApplyUI/InstantApplyDialog";

const InstantApplyLayout = () => {
  const { adminData } = useSelector((state) => state.admin);
  const [instantApplyList, setInstantApplyList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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

  useEffect(() => {
    const fetchInstantApply = async () => {
      try {
        if (adminData?.adminData?.uuid && adminData?.adminAccessToken) {
          const resdata = await GetApiCall(
            `${Api.admin.get.instantApply.data}/${adminData?.adminData?.uuid}`,
            adminData?.adminAccessToken,
            {}
          );

          const dropdownres = await GetApiCall(
            `${Api.admin.get.instantApply.dropdown}/${adminData?.adminData?.uuid}`,
            adminData?.adminAccessToken,
            {}
          );

          setInstantApplyList(resdata.data?.data?.data || []);

          if (dropdownres.data.success) {
            const dropdownData = dropdownres.data.data || {};
            setCities(dropdownData.cities || []);
            setDistricts(dropdownData.districts || []);
            setInvestmentRanges(dropdownData.investmentRanges || []);
            setStates(dropdownData.states || []);
          }
        }
      } catch (error) {
        console.error("Error fetching Instant Apply:", error);
      }
    };

    fetchInstantApply();
  }, [adminData]);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = instantApplyList.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChange = async (label, value, setter) => {
    try {
      console.log(`${label}:`, value);

      // Update local state first
      setter(value);

      const payload = {
        searchTerm: label === "searchTerm" ? value : searchTerm,
        city: label === "city" ? value : selectedCity,
        district: label === "district" ? value : selectedDistrict,
        state: label === "state" ? value : selectedState,
        investmentRange: label === "investmentRange" ? value : selectedRange,
      };

      const resdata = await PostApiCall(
        `${Api.admin.get.instantApply.filterandsearch}/${adminData?.adminData?.uuid}`,
        adminData?.adminAccessToken,
        { payload }
      );

      console.log("Filter Response:", resdata.data);

      
      if (resdata?.data?.success && resdata?.data?.data) {
        setInstantApplyList(resdata.data.data);
        setPage(0); 
      }
    } catch (error) {
      console.error("Error in handleChange:", error);
    }
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ margin: 2, p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Instant Apply List
        </Typography>

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
        />

        <InstantApplyTable
          paginatedData={paginatedData}
          setSelectedItem={setSelectedItem}
        />

        <TablePagination
          component="div"
          count={instantApplyList.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>

      <InstantApplyDialog
        selectedItem={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </>
  );
};

export default InstantApplyLayout;
