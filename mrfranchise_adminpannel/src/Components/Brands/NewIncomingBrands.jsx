import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNewIncomingBrands,
  fetchBrandById,
  approveBrand,
  deleteBrand,
  clearBrandDetails,
  resetBrands,
} from "../../Redux/Slices/newIncomingSlice";

import TableOutlet from "../../ui/TableOutlet";
import BrandInfoPopup from "../../ui/BrandInfoPopup";
import DeletePopup from "../../ui/DeletePopup";
import { Api } from "../../api/apiurl";
import { PostApiCall } from "../../api/default/PostApi";

import { TextField, Box, Button } from "@mui/material";
import { DeleteApiCall } from "../../api/default/DeleteApi";

const debounce = (func, delay) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
};

const NewIncomingBrands = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const [searchTerm, setSearchTerm] = useState("");
  const [openBrandInfo, setOpenBrandInfo] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { brands, loading, pagination, brandDetails } = useSelector(
    (state) => state.brands
  );

  useEffect(() => {
    dispatch(fetchNewIncomingBrands({ page: 1 }));
  }, [dispatch]);

  const handleApprove = useCallback(
    async (brandId) => {
      const res = await PostApiCall(`${Api.admin.brand.brandApprove}/${brandId}`);
      // console.log("Approve response:", res.data);
      dispatch(approveBrand(brandId));
    },
    [dispatch]
  );

  const handleInfoOpen = useCallback(
    async (brandId) => {
      await dispatch(fetchBrandById(brandId));
      setOpenBrandInfo(true);
    },
    [dispatch]
  );

  const handleEdit = useCallback(
    (brandId) => {
      navigate(`/dashboard/edit-brand/${brandId}`);
    },
    [navigate]
  );

  const handleDelete = (brandId) => {
    setSelectedBrandId(brandId);
    setOpenDelete(true);
  };

  const confirmDelete = useCallback(async() => {
    const deleteIncomingBrand = await DeleteApiCall(`${Api.admin.delete.newIncomingBrand}/${selectedBrandId}`);

    if (deleteIncomingBrand?.data?.statuscode === 200) {
      dispatch(deleteBrand(selectedBrandId));
    setSelectedBrandId(null);
    setOpenDelete(false);
    }
    
  }, [dispatch, selectedBrandId]);

  const loadMore = useCallback(
    debounce(() => {
      if (pagination.hasNext && !loading) {
        dispatch(fetchNewIncomingBrands({
          page: pagination.currentPage + 1,
          startDate,
          endDate,
        }));
      }
    }, 300),
    [dispatch, pagination, startDate, endDate, loading]
  );

  const applyDateFilter = () => {
    dispatch(resetBrands());
    dispatch(fetchNewIncomingBrands({ page: 1, startDate, endDate }));
  };

  return (
    <div>
      {/* 🔍 Filter Controls */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 ,justifyContent: "flex-end" }}>
        <TextField
          label="Start Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField
          label="End Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <Button variant="contained" onClick={applyDateFilter}>
          Filter
        </Button>
      </Box>

      {/* 📦 Table Data */}
      <TableOutlet
        filteredBrands={brands}
        // searchTerm={searchTerm}
        handleApprove={handleApprove}
        handleInfoOpen={handleInfoOpen}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        editShow={false}
        loadMore={loadMore}
        hasMore={pagination.hasNext}
        loading={loading}
        pagination={pagination}
      />

      {/* 🔍 Brand Info */}
      {openBrandInfo && (
        <BrandInfoPopup
          open={openBrandInfo}
          onClose={() => {
            dispatch(clearBrandDetails());
            setOpenBrandInfo(false);
          }}
          brandDetails={brandDetails}
        />
      )}

      {/* 🗑️ Delete Popup */}
      {openDelete && (
        <DeletePopup
          open={openDelete}
          onClose={() => setOpenDelete(false)}
          onConfirm={confirmDelete}
          newIncomingDeleteId={selectedBrandId}
        />
      )}
    </div>
  );
};

export default NewIncomingBrands;
  