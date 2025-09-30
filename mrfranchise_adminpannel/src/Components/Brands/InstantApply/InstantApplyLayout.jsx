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
import dayjs from "dayjs";

const InstantApplyLayout = () => {
  const { adminData } = useSelector((state) => state.admin);

  const [instantApplyList, setInstantApplyList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [page, setPage] = useState(0);
  const [limit, setlimit] = useState(10);

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

          // console.log("Initial API Response:", resdata?.data);

          const listData = resdata?.data?.data?.data;
          setInstantApplyList(Array.isArray(listData) ? listData : []);

          if (dropdownres?.data?.success) {
            const dropdownData = dropdownres.data.data || {};
            setCities(dropdownData.cities || []);
            setDistricts(dropdownData.districts || []);
            setInvestmentRanges(dropdownData.investmentRanges || []);
            setStates(dropdownData.states || []);
            setclearFilterloading(false);
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
      setter(value); // update local state

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
        // console.log(payload)
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
        setPage(0);
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
          fromDate={fromDate}
          setFromDate={setFromDate}
          setToDate={setToDate}
          toDate={toDate}
          handleClear={handleClear}
          clearFilterloading={clearFilterloading}
        />

        <InstantApplyTable
          instantApplyList={instantApplyList}
          setSelectedItem={setSelectedItem}
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
