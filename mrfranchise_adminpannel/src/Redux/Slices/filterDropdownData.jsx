import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
 
const API_BASE_URL = 'http://localhost:5000/api/v1/';
 
// Async thunk for fetching all filter options
export const fetchFilterOptions = createAsyncThunk(
  'filterDropdown/fetchFilterOptions',
  
  async (filters = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();

      // Only append parameters if they exist (similar to filterBrandSlice pattern)
      if (filters.maincat) queryParams.append('maincat', filters.maincat);
      if (filters.sub) queryParams.append('sub', filters.sub);
      if (filters.state) queryParams.append('state', filters.state);
      if (filters.district) queryParams.append('district', filters.district);
      
      console.log('Filters passed:', filters);
      console.log('Query params:', queryParams.toString());
 
      // Determine if this is a parameterized request or initial load
      const hasFilters = filters.maincat || filters.sub || filters.state || filters.district;
      
      let endpoint;
      let response;
      
      if (hasFilters) {
        // Use GET with getAllBrandsAndFilter when filters are provided
        endpoint = `${API_BASE_URL}filter/getAllBrandsAndFilter?${queryParams.toString()}`;
        console.log('API Endpoint (GET):', endpoint);
        response = await axios.get(endpoint);
      } else {
        // Use POST with getAllBrandFiltersdata for initial filter data
        endpoint = `${API_BASE_URL}filter/getAllBrandFiltersdata`;
        console.log('API Endpoint (POST):', endpoint);
        response = await axios.post(endpoint);
      }
      
      console.log('Response keys:', Object.keys(response.data.data || {}));
      return { data: response.data.data, filters };
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
 
const initialState = {
  // Main filter options
  mainCategories: [],
  subCategories: [],
  childCategories: [],
  investmentRanges: [],
  franchiseModels: [],
  states: [],
  districts: [],
  cities: [],
 
  // Loading states
  loading: false,
  loadingSubCategories: false,
  loadingChildCategories: false,
  loadingDistricts: false,
  loadingCities: false,
 
  // Error states
  error: null,
  subCategoriesError: null,
  childCategoriesError: null,
  districtsError: null,
  citiesError: null,
};
 
const filterDropdownSlice = createSlice({
  name: 'filterDropdown',
  initialState,
  reducers: {
    resetSubCategories: (state) => {
      state.subCategories = [];
    },
    resetChildCategories: (state) => {
      state.childCategories = [];
    },
    resetDistricts: (state) => {
      state.districts = [];
    },
    resetCities: (state) => {
      state.cities = [];
    },
    clearErrors: (state) => {
      state.error = null;
      state.subCategoriesError = null;
      state.childCategoriesError = null;
      state.districtsError = null;
      state.citiesError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initial load of all filters
      .addCase(fetchFilterOptions.pending, (state, action) => {
        const filters = action.meta.arg || {};
        if (!filters || Object.keys(filters).length === 0) {
          // Initial load of all filters
          state.loading = true;
        } else if (filters.maincat) {
          state.loadingSubCategories = true;
        } else if (filters.sub) {
          state.loadingChildCategories = true;
        } else if (filters.state) {
          state.loadingDistricts = true;
        } else if (filters.district) {
          state.loadingCities = true;
        }
      })
      .addCase(fetchFilterOptions.fulfilled, (state, action) => {
        const filters = action.payload?.filters || {};
        const data = action.payload?.data || {};
       
        if (filters.maincat) {
          // Response from getAllBrandsAndFilter - extract subcategories and child categories
          // Try multiple possible response structures
          let brandCategories = data.brandCategories || data.categories || data.categorydata || [];
          
          // If brandCategories is still empty, try extracting from brands
          if (!Array.isArray(brandCategories) || brandCategories.length === 0) {
            if (Array.isArray(data.brands)) {
              brandCategories = data.brands;
            } else if (Array.isArray(data)) {
              brandCategories = data;
            }
          }
          
          console.log('Extracted brandCategories for maincat:', brandCategories);
          
          // Extract unique subcategories
          const uniqueSubCategories = [];
          const subCatSet = new Set();
          
          if (Array.isArray(brandCategories)) {
            brandCategories.forEach(cat => {
              const subKey = cat.sub || cat.child || cat.subCategory;
              if (subKey && !subCatSet.has(subKey)) {
                subCatSet.add(subKey);
                uniqueSubCategories.push({
                  main: cat.main || cat.mainCategory || filters.maincat,
                  sub: cat.sub || cat.subCategory,
                  child: cat.child || cat.childCategory,
                  name: cat.sub || cat.subCategory || cat.child || cat.childCategory,
                  _id: cat.sub || cat.subCategory || cat.child || cat.childCategory
                });
              }
            });
          }
          
          // Extract unique child categories
          const uniqueChildCategories = [];
          const childCatSet = new Set();
          
          if (Array.isArray(brandCategories)) {
            brandCategories.forEach(cat => {
              const childKey = cat.child || cat.childCategory;
              if (childKey && !childCatSet.has(childKey)) {
                childCatSet.add(childKey);
                uniqueChildCategories.push({
                  sub: cat.sub || cat.subCategory,
                  child: childKey,
                  name: childKey,
                  _id: childKey
                });
              }
            });
          }
          
          console.log('Unique SubCategories:', uniqueSubCategories);
          console.log('Unique ChildCategories:', uniqueChildCategories);
          
          state.subCategories = uniqueSubCategories;
          state.childCategories = uniqueChildCategories;
          state.loadingSubCategories = false;
        }
        else if (filters.sub) {
          // Response from getAllBrandsAndFilter - extract child categories and tags
          let brandCategories = data.brandCategories || data.categories || data.categorydata || [];
          
          // If brandCategories is still empty, try extracting from brands
          if (!Array.isArray(brandCategories) || brandCategories.length === 0) {
            if (Array.isArray(data.brands)) {
              brandCategories = data.brands;
            } else if (Array.isArray(data)) {
              brandCategories = data;
            }
          }
          
          console.log('Extracted brandCategories for subcat:', brandCategories);
          
          // Extract unique child categories
          const uniqueChildCategories = [];
          const childCatSet = new Set();
          
          if (Array.isArray(brandCategories)) {
            brandCategories.forEach(cat => {
              const childKey = cat.child || cat.childCategory;
              if (childKey && !childCatSet.has(childKey)) {
                childCatSet.add(childKey);
                uniqueChildCategories.push({
                  sub: cat.sub || cat.subCategory,
                  child: childKey,
                  name: childKey,
                  _id: childKey,
                  tag: cat.tag // Include product tag
                });
              }
            });
          }
          
          console.log('Unique ChildCategories for subcat:', uniqueChildCategories);
          
          state.childCategories = uniqueChildCategories;
          state.loadingChildCategories = false;
        }
        else if (filters.state) {
          // Districts response
          state.districts = data.district || data;
          state.loadingDistricts = false;
        }
        else if (filters.district) {
          // Cities response
          state.cities = data.city || data;
          state.loadingCities = false;
        }
        else {
          // Initial full filters response
          state.mainCategories = data.maincat || [];
          state.subCategories = data.subcat || [];
          state.investmentRanges = data.investmentRange || [];
          state.franchiseModels = data.franchiseModel || [];
          state.states = data.states || [];
          state.loading = false;
        }
      })
      .addCase(fetchFilterOptions.rejected, (state, action) => {
        const filters = action.meta.arg || {};
       
        if (filters.maincat) {
          state.subCategoriesError = action.payload;
          state.loadingSubCategories = false;
        }
        else if (filters.sub) {
          state.childCategoriesError = action.payload;
          state.loadingChildCategories = false;
        }
        else if (filters.state) {
          state.districtsError = action.payload;
          state.loadingDistricts = false;
        }
        else if (filters.district) {
          state.citiesError = action.payload;
          state.loadingCities = false;
        }
        else {
          state.error = action.payload;
          state.loading = false;
        }
      });
  }
});
 
export const {
  resetSubCategories,
  resetChildCategories,
  resetDistricts,
  resetCities,
  clearErrors
} = filterDropdownSlice.actions;
 
export default filterDropdownSlice.reducer;
 