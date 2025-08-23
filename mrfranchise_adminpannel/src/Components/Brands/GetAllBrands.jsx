import React, { useEffect, useState } from "react";
import TableOutlet from "../../ui/TableOutlet";
import { GetApiCall } from "../../api/default/GetApi";
import { Api } from "../../api/apiurl";

const GetAllBrands = () => {
  const [brands, setBrands] = useState([]);     
  const [searchTerm, setSearchTerm] = useState(""); 

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

  // const filteredBrands = brands

  const handleEdit = (uuid) => {
    console.log("Edit brand:", uuid);
  };

  const handleDelete = (uuid) => {
    console.log("Delete brand:", uuid);
  };

  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => console.log("Fetching all brands...")}>All Brands</button>
        <button onClick={() => console.log("Fetching new incoming brands...")}>
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
      />
    </div>
  );
};

export default GetAllBrands;
