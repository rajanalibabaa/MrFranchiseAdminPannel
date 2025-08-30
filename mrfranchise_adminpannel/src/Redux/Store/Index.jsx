import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import filterDropdownReducer from "../Slices/filterDropdownData.jsx"
import filterBrandsReducer from "../Slices/FilterBrandSlice.jsx";
// Import all your reducers
import loadingReducer from "../Slices/LoadingSlice.jsx";

// Combine reducers
const rootReducer = combineReducers({
  loading: loadingReducer,
  filterDropdown: filterDropdownReducer,
      filterBrands: filterBrandsReducer,
    filterDropdown: filterDropdownReducer,
});

// Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "shortlist"], 
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
