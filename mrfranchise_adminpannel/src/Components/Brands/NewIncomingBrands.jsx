import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNewIncomingBrands,
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
import { DeleteApiCall } from "../../api/default/DeleteApi";
import { GetApiCall } from "../../api/default/GetApi";

import { TextField, Box, Button } from "@mui/material";
import DefaultPopup from "../../ui/DefaultPopup";
import { toggleBrandPausePlay } from "../../Redux/Slices/FilterBrandSlice";

const NewIncomingBrands = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🔹 Local state
  const [openBrandInfo, setOpenBrandInfo] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [brandDetails, setBrandDetails] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [openDefaultBrandPopup, setopenDefaultBrandPopup] = useState(false);
  const [data, setData] = useState(false);
  


  const { brands, loading, pagination } = useSelector((state) => state.brands);

 
  useEffect(() => {
    dispatch(fetchNewIncomingBrands({ page: 1 }));
  }, [dispatch]);


  const handleApprove = useCallback(
    async (brand) => {
      console.log("===brand=== :",brand)
      setData(brand)
      setopenDefaultBrandPopup(true);

      // const res = await PostApiCall(`${Api.admin.brand.brandApprove}/${brandId}`);
      // if (res?.data?.statuscode === 200) {
      //   dispatch(approveBrand(brandId));
      // }

      // dispatch(approveBrand(brandId));
    },
    [dispatch]
  );


  const handleEdit = useCallback(
    (brandId) => {
      navigate(`/dashboard/edit-brand/${brandId}`);
    },
    [navigate]
  );


  const handleInfoOpen = useCallback(async (brandId) => {
    const res = await GetApiCall(`${Api.admin.brand.getBrandByID}/${brandId}`);
    setBrandDetails(res?.data?.data);
    setOpenBrandInfo(true);
  }, []);


  const handleDelete = (brandId) => {
    setSelectedBrandId(brandId);
    setOpenDelete(true);
  };


  const confirmDelete = useCallback(async () => {
    const res = await DeleteApiCall(
      `${Api.admin.delete.newIncomingBrand}/${selectedBrandId}`
    );
    if (res?.data?.statuscode === 200) {
      dispatch(deleteBrand(selectedBrandId));
      setSelectedBrandId(null);
      setOpenDelete(false);
    }
  }, [dispatch, selectedBrandId]);


  const loadMore = useCallback(() => {
    if (!pagination.hasNext || loading) return;
    dispatch(fetchNewIncomingBrands({ page: pagination.currentPage + 1, startDate, endDate }));
  }, [dispatch, pagination, startDate, endDate, loading]);


  const applyDateFilter = () => {
    dispatch(resetBrands());
    dispatch(fetchNewIncomingBrands({ page: 1, startDate, endDate }));
  };

  const handleConformApprove = useCallback(
    async (brandId) => {
      // console.log("===brand=== :",brand)
      // setData(brand)
      // setopenDefaultBrandPopup(true);

      const res = await PostApiCall(`${Api.admin.brand.brandApprove}/${brandId}`);
      if (res?.data?.statuscode === 200) {
        dispatch(approveBrand(brandId));
        // dispatch(toggleBrandPausePlay(data.uuid));
      }
      return res
    },
    [dispatch]
  );
  

  return (
    <div>
     
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 2,
          justifyContent: "flex-end",
          flexWrap: "wrap",
        }}
      >
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

     
     
      <TableOutlet
        filteredBrands={brands}
        handleApprove={handleApprove}
        handleInfoOpen={handleInfoOpen}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        editShow={false}
        editNewincomingShow={true}
        loadMore={loadMore}
        hasMore={pagination.hasNext}
        loading={loading}
        pagination={pagination}
      />

      
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

     
      {openDelete && (
        <DeletePopup
          open={openDelete}
          onClose={() => setOpenDelete(false)}
          onConfirm={confirmDelete}
          newIncomingDeleteId={selectedBrandId}
        />
      )}

      {openDefaultBrandPopup && (
        <DefaultPopup
          open={openDefaultBrandPopup}
          data={data}
          handleConformApprove={handleConformApprove}
          onClose={() => setopenDefaultBrandPopup(false)}
          header={"Approved Brand"}
          // onConfirm={confirmDelete}
          // newIncomingDeleteId={selectedBrandId}
        />
      )}
    </div>
  );
};

export default NewIncomingBrands;
