import React, { useCallback, useEffect, useState } from "react";
import TableOutlet from "../../ui/TableOutlet";
import { GetApiCall } from "../../api/default/GetApi";
import { Api } from "../../api/apiurl";
import DeletePopup from "../../ui/DeletePopup";
import BrandInfoPopup from "../../ui/BrandInfoPopup";
import socket from "../../Utils/Socket";
import { Badge, Button ,Box} from "@mui/material";
import { useNavigate } from "react-router-dom";
import BrandFilter from "./BrandFilter/BrandFilter";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchFilteredBrands, 
  setFilter, 
  resetFilters, 
  setPage,
  toggleBrandLikefilter,
  toggleBrandShortListfilter
} from "../../Redux/Slices/FilterBrandSlice";

const GetAllBrands = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

    // Get state from Redux store
  const { brands, loading, error, pagination, filters } = useSelector(
    (state) => state.filterBrands
  );

  console.log("Brands from Redux store:", brands);
  console.log("Filters from Redux store:", pagination);
 


  const [brand, setBrands] = useState(brands || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [openBrandInfo, setOpenBrandInfo] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [brandDetails, setBrandDetails] = useState(null);
  const [brandCount, setBrandCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadings, setLoading] = useState(false);
  const [editShow, setEditShow] = useState(true);


    // Fetch brands when filters change
  useEffect(() => {
    dispatch(fetchFilteredBrands(filters));
  }, [dispatch, filters]);


  useEffect(() => {
    socket.on("recevie", (count) => {
      console.log("📥 Updated brand count:", count);
      setBrandCount(count);
      const audio = new Audio("/ting.mp3");
      audio.play();
    });

    return () => {
      socket.off("receive");
    };
  }, []);


  const fetchBrands = async (pageNum = 1, append = false) => {
    try {
      setLoading(true);
      // const response = await GetApiCall(
      //   `${Api.admin.brand.getAllBrands}?page=${pageNum}&limit=10`
      // );

      // const { brands: newData = [], pagination } = response?.data?.data || {};

      setBrands(brands || []); // Ensure local state is in sync with Redux store
      const newIncomingcount = await GetApiCall(Api.admin.brand.getNewIncomingBrands);
      setBrandCount(newIncomingcount?.data?.data?.totalBrands || 0);
      setEditShow(true)

      
      if (append) {
        // setBrands((prev) => [...prev, ...newData]);
      } else {
        setBrands(newData);
      }

     
      setPage(pagination?.currentPage || pageNum);
      setHasMore(pagination?.hasNext || false);

      // console.log("📄 response?.data?.data:", response?.data?.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchBrands(1, false);
  }, [brands]);


  

  const handleDelete = useCallback((brandId) => {
    setSelectedBrandId(brandId);
    console.log("Selected brand ID for deletion:", brandId);
    setOpen(true);
  }, []);

  const newIncomingBrands = async () => {
    try {
      const res = await GetApiCall(Api.admin.brand.getNewIncomingBrands);
      console.log("New incoming brands fetched:", res?.data?.data);
      setBrands(res?.data?.data?.brands || []);
      setPage(1);
      setHasMore(false); 

      dispatch(resetFilters());
      setEditShow(false);

    } catch (error) {
      console.log("Error fetching new incoming brands:", error);
    }
  };

  const getAllBrands = async () => {
    fetchBrands(1, false);
    setPage(1);
  };

  const handleApprove = useCallback(
    async (brandId) => {
      try {
        const updated = brands.filter((brand) => brand.uuid !== brandId);
        setBrands(updated);
        setBrandCount((prev) => Math.max(prev - 1, 0));
      } catch (error) {
        console.error("Error approving brand:", error);
      }
    },
    [brands]
  );

const handleInfoOpen = useCallback(async(brandId) => {
 
 
  let res = await GetApiCall(`${Api.admin.brand.getNewIncomingBrandById}/${brandId}`);
 
  if (res.data.statuscode !== 200) {
    res = await GetApiCall(`${Api.admin.brand.getBrandByID}/${brandId}`);
    console.log("Brand details fetched successfully");
  }
  console.log("Brand details:", res?.data.data);
  setBrandDetails(res?.data?.data);
  setOpenBrandInfo(true);
},[])


 const handleFilterChange = (filterName, value) => {
    dispatch(setFilter({ filterName, value }));
  };

  const handleEdit = useCallback((brandId) => {
    console.log("Edit brand:", brandId);
    navigate(`/dashboard/edit-brand/${brandId}`);
  }, [navigate]);

  

 
  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      console.log("➡️ Loading page:", nextPage);
      fetchBrands(nextPage, true);
    }
  };

  return (
    <Box>
      {/* Top Controls */}
      {/* <div style={{ marginBottom: "1rem" }}>
        <div style={{ display: "inline-flex", gap: "1rem", alignItems: "center" }}>
          <Button variant="contained" onClick={getAllBrands}>
            All Brands
          </Button>
          </Box>

          <Badge
            badgeContent={brandCount}
            color="error"
            overlap="circular"
            invisible={brandCount === 0}
          >
            <Button variant="contained" onClick={newIncomingBrands}>
              New Incoming Brands
            </Button>
          </Badge>
              
          <Button variant="contained" onClick={newIncomingBrands}>
             All Leads
            </Button>    

             <input
          type="text"
          placeholder="Search brands..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginLeft: "1rem", padding: "5px" }}
        />
      </div> */}
        <Box style={{ marginBottom: "1rem" }}>
        <Box style={{ display: "inline-flex", gap: "1rem", alignItems: "center" }}>
 
          <Box>
          <Button variant="contained" onClick={getAllBrands}>
            All Brands
          </Button>
          </Box>
 
          <Badge
            badgeContent={brandCount}
            color="error"
            overlap="circular"
            invisible={brandCount === 0}
          >
            <Button variant="contained" onClick={newIncomingBrands}>
              New Incoming Brands
            </Button>
          </Badge>
     
 
          <input
            type="text"
            placeholder="Search brands..."
            value={filters.serchterm || ""}
            onChange={(e) => handleFilterChange("serchterm", e.target.value)}
            style={{ marginLeft: "1rem", padding: "5px" }}
          />
        </Box>
 
      <Box sx={{ marginTop: 2 }}>
          <BrandFilter 
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </Box>
 
      </Box>

      {/* Table with Infinite Scroll */}
      <TableOutlet
        filteredBrands={brand}
        handleDelete={handleDelete}
        searchTerm={filters.serchterm || ""}
        handleApprove={handleApprove}
        handleInfoOpen={handleInfoOpen}
        handleEdit={handleEdit}
        editShow={editShow}
        loadMore={loadMore}
        hasMore={hasMore}
        loading={loading}
        pagination={pagination}
      
      />

      {open && (
        <DeletePopup
          open={open}
          onClose={() => setOpen(false)}
          brands={brands}
          setBrands={setBrands}
          selectedBrandId={selectedBrandId}
        />
      )}

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
