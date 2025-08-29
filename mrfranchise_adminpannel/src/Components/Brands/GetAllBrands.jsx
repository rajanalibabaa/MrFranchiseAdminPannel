import React, { useCallback, useEffect, useState } from "react";
import TableOutlet from "../../ui/TableOutlet";
import { GetApiCall } from "../../api/default/GetApi";
import { Api } from "../../api/apiurl";
import DeletePopup from "../../ui/DeletePopup";
import { PostApiCall } from "../../api/default/PostApi";
import BrandInfoPopup from "../../ui/BrandInfoPopup";
import { useNavigate } from "react-router-dom";

const GetAllBrands = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [open, setOpen] = useState(false);
  const [openBrandInfo, setOpenBrandInfo] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [brandDetails, setBrandDetails] = useState(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await GetApiCall(Api.admin.brand.getAllBrands);
        console.log("Fetched brands:", response.data);
        setBrands(response.data.data || []); 
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();
  }, []); 

  

  const handleDelete = useCallback((brandId) => {
    setSelectedBrandId(brandId);  
    setOpen(true);
  }, []);


  const handleEdit = useCallback((brandId) => {
    console.log("Edit brand:", brandId);
    navigate(`/dashboard/edit-brand/${brandId}`);
  }, [navigate]);

  const newIncomingBrands = async() => {
    try {
    const newIncomingData = await GetApiCall(Api.admin.brand.getNewIncomingBrands)

    console.log(newIncomingData.data.data);
    setBrands(newIncomingData?.data?.data)
      } catch(error){
        console.log("Error fetching brands :",error);
        
      }
  }


  const getAllBrands =async() => {
    try{
      console.log("All Brands clicked");
      const getAllBrands =await GetApiCall(Api.admin.brand.getAllBrands)
      console.log(getAllBrands?.data?.data);
      setBrands(getAllBrands?.data?.data)
      
    }catch(error){
      console.log("Error fetching brands :",error);
      
    }
  }

const handleApprove = useCallback(async(brandId) =>{
  
  const updated = brands.brands.filter(brand => brand.uuid !== brandId)
  setBrands({ brands: updated })
  // const data = await PostApiCall(`${Api.admin.brand.brandApprove}/${brandId}`)

},[brands])

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
  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={getAllBrands}>All Brands</button>
        <button onClick={newIncomingBrands}>
          New Incoming Brands
        </button>
        <input
          type="text"
          placeholder="Search brands..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginLeft: "1rem", padding: "5px" }}
        />
      </div>

      <TableOutlet
        filteredBrands={brands}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        searchTerm={searchTerm}
        handleApprove={handleApprove}
        handleInfoOpen={handleInfoOpen}
      />

      {open && (
        <div>
          <DeletePopup
            open={open}
            onClose={() => setOpen(false)}
            brands={brands}
            setBrands={setBrands}
            selectedBrandId={selectedBrandId}
          />
        </div>
      )}

      {openBrandInfo && (
        <div>
          <BrandInfoPopup
            open={openBrandInfo}
            onClose={() => setOpenBrandInfo(false)}
            brandDetails={brandDetails}
            
            
          />
        </div>
      )}
    </div>
  );
};

export default GetAllBrands;
