import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import TableOutlet from "../../ui/TableOutlet";
import { GetApiCall } from "../../api/default/GetApi";
import { Api } from "../../api/apiurl";
import BrandInfoPopup from "../../ui/BrandInfoPopup";
import DeletePopup from "../../ui/DeletePopup";

const NewIncomingBrands = () => {
  const navigate = useNavigate();

  // Local states
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    hasNext: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [brandDetails, setBrandDetails] = useState(null);
  const [openBrandInfo, setOpenBrandInfo] = useState(false);

  // ✅ Delete popup states
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState(null);

  const LIMIT = 10;

  // ✅ Fetch first page on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await GetApiCall(
          `${Api.admin.brand.getNewIncomingBrands}?page=1&limit=${LIMIT}`
        );
        const data = res?.data?.data;

        setBrands(data?.brands || []);
        setPagination({
          currentPage: 1,
          hasNext: data?.hasNext || false,
        });
      } catch (error) {
        console.error("Error fetching new incoming brands:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Approve brand
  const handleApprove = useCallback(async (brandId) => {
    try {
      console.log("✅ Approve brand:", brandId);
      setBrands((prev) => prev.filter((brand) => brand.uuid !== brandId));
    } catch (error) {
      console.error("Error approving brand:", error);
    }
  }, []);

  // Info popup
  const handleInfoOpen = useCallback(async (brandId) => {
    try {
      const res = await GetApiCall(
        `${Api.admin.brand.getNewIncomingBrandById}/${brandId}`
      );
      setBrandDetails(res?.data?.data);
      setOpenBrandInfo(true);
    } catch (error) {
      console.error("Error fetching brand details:", error);
    }
  }, []);

  // Edit handler
  const handleEdit = useCallback(
    (brandId) => {
      navigate(`/dashboard/edit-brand/${brandId}`);
    },
    [navigate]
  );

  // ✅ Delete handler
  const handleDelete = useCallback((brandId) => {
    setSelectedBrandId(brandId);
    setOpenDelete(true);
  }, []);

  // ✅ After confirming delete
  const confirmDelete = useCallback(() => {

    console.log("Confirmed delete for brand ID:", selectedBrandId);
    if (selectedBrandId) {
      setBrands((prev) => prev.filter((brand) => brand.uuid !== selectedBrandId));
      setSelectedBrandId(null);
      setOpenDelete(false);
    }
  }, [selectedBrandId]);

  // Load more handler
  const loadMore = async () => {
    if (!loading && pagination.hasNext) {
      try {
        setLoading(true);
        const nextPage = pagination.currentPage + 1;

        const res = await GetApiCall(
          `${Api.admin.brand.getNewIncomingBrands}?page=${nextPage}&limit=${LIMIT}`
        );
        const data = res?.data?.data;

        setBrands((prev) => [...prev, ...(data?.brands || [])]);
        setPagination({
          currentPage: nextPage,
          hasNext: data?.hasNext || false,
        });
      } catch (error) {
        console.error("Error loading more brands:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <TableOutlet
        filteredBrands={brands}
        searchTerm={searchTerm}
        handleApprove={handleApprove}
        handleInfoOpen={handleInfoOpen}
        handleEdit={handleEdit}
        handleDelete={handleDelete} // ✅ Pass delete handler to table
        editShow={false}
        loadMore={loadMore}
        hasMore={pagination.hasNext}
        loading={loading}
        pagination={pagination}
      />

      {/* Info Popup */}
      {openBrandInfo && (
        <BrandInfoPopup
          open={openBrandInfo}
          onClose={() => setOpenBrandInfo(false)}
          brandDetails={brandDetails}
        />
      )}

      {/* Delete Popup */}
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
