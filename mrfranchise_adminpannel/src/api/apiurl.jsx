
const BASE_URL = "http://localhost:5000/api/v1/admin" 
const BASE_URL_2 = "http://localhost:5000/api/v1" 

export const Api = {
  admin: {
    brand: {
      getNewIncomingBrands: `${BASE_URL}/getNewIncomingBrands`,
      getAllBrands: `${BASE_URL_2}/brandlisting/getAllBrandListing`,
      brandApprove: `${BASE_URL}/brandApprove`,
      getNewIncomingBrandById: `${BASE_URL}/getNewIncomingBrandById`,
      getBrandByID:`${BASE_URL_2}/brandlisting/getBrandById`
    },
  },
};
