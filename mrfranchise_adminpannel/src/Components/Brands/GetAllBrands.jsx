import React, { useCallback, useEffect, useState } from "react";
import TableOutlet from "../../ui/TableOutlet";
import { GetApiCall } from "../../api/default/GetApi";
import { Api } from "../../api/apiurl";
import DeletePopup from "../../ui/DeletePopup";
import BrandInfoPopup from "../../ui/BrandInfoPopup";

import { Badge, Box, Tabs, Tab, styled } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BrandFilter from "./BrandFilter/BrandFilter";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchFilteredBrands, 
  setFilter, 
  setPage,
} from "../../Redux/Slices/FilterBrandSlice";



const GetAllBrands = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const { brands, loading, pagination, filters } = useSelector(
    (state) => state.filterBrands
  );

  const [open, setOpen] = useState(false);
  const [openBrandInfo, setOpenBrandInfo] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [brandDetails, setBrandDetails] = useState(null);
  const [activeTab, setActiveTab] = useState(0); // 0 = All Brands, 1 = New Incoming



  // Fetch brands when filters change
  useEffect(() => {
    if (activeTab === 0) {
      dispatch(fetchFilteredBrands(filters));
    }
  }, [dispatch, filters, activeTab]);

  // ✅ Get all brands
  const getAllBrands = async () => {
    dispatch(fetchFilteredBrands(filters));
    setActiveTab(0);
  };

  // ✅ Get new incoming brands
  // const newIncomingBrands = async () => {
  //   try {
  //     const res = await GetApiCall(Api.admin.brand.getNewIncomingBrands);
  //     console.log("New Incoming Brands:", res?.data?.data);
  //     setBrandCount(res?.data?.data?.totalBrands || 0);

  //     dispatch(newIncomingBrandsData(res?.data?.data?.brands || []));
  //     setActiveTab(1);
  //   } catch (error) {
  //     console.log("Error fetching new incoming brands:", error);
  //   }
  // };

  // Delete handler
  const handleDelete = useCallback((brandId) => {
    console.log("Delete ID:", brandId);
    setSelectedBrandId(brandId);
    setOpen(true);
  }, []);

  // Approve handler
  // const handleApprove = useCallback(async (brandId) => {
  //   try {
  //     // your approval logic here
  //   } catch (error) {
  //     console.error("Error approving brand:", error);
  //   }
  // }, []);

  // Info popup handler
  const handleInfoOpen = useCallback(async (brandId) => {
    // let res = await GetApiCall(
    //   `${Api.admin.brand.getNewIncomingBrandById}/${brandId}`
    // );
    // 
    const res = await GetApiCall(`${Api.admin.brand.getBrandByID}/${brandId}`);
    
    setBrandDetails(res?.data?.data);
    setOpenBrandInfo(true);
  }, []);

  // Filter handler
  const handleFilterChange = (filterName, value) => {
    dispatch(setFilter({ filterName, value }));
  };

  // Edit handler
  const handleEdit = useCallback(
    (brandId) => {
      navigate(`/dashboard/edit-brand/${brandId}`);
    },
    [navigate]
  );

  // Infinite scroll load more
  const loadMore = () => {
    if (!loading && pagination.hasNext) {
      const nextPage = pagination.currentPage + 1;
      dispatch(setPage(nextPage));
    }
  };

  // Tab change
  return (
    <Box>
      {/* Tabs */}
     

      {/* Filters */}
      <Box sx={{ mb: 2 }}>
        <BrandFilter filters={filters} onFilterChange={handleFilterChange} />
      </Box>

      {/* Table */}
      <TableOutlet
        filteredBrands={brands}
        handleDelete={handleDelete}
        searchTerm={filters.serchterm || ""}
        // handleApprove={handleApprove}
        handleInfoOpen={handleInfoOpen}
        handleEdit={handleEdit}
        editShow={activeTab === 0}
        loadMore={loadMore}
        hasMore={pagination.hasNext}
        loading={loading}
        pagination={pagination}
      />

      {/* Delete Popup */}
      {open && (
        <DeletePopup
          open={open}
          onClose={() => setOpen(false)}
          brands={brands}
          selectedBrandId={selectedBrandId}
        />
      )}

      {/* Info Popup */}
      {openBrandInfo && (
        <BrandInfoPopup
          open={openBrandInfo}
          onClose={() => setOpenBrandInfo(false)}
          brandDetails={brandDetails}
        />
      )}
    </Box>
  );
};

export default GetAllBrands;
