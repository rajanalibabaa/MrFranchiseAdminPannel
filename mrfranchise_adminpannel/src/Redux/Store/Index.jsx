import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import filterDropdownReducer from "../Slices/filterDropdownData.jsx";
import filterBrandsReducer from "../Slices/FilterBrandSlice.jsx";
// Import all your reducers
import loadingReducer from "../Slices/LoadingSlice.jsx";
import newIncomingReducer from "../Slices/newIncomingSlice.jsx";
import adminReducer from "../Slices/admin/authSlice.jsx";
import applicationReducer from '../Slices/InstantApplyCreationSlice.jsx'
import paymentPackageReducer  from "../Slices/AdvertiseHandlingSlices.jsx";
import NotificationsReducer from "../Slices/NotificationsSlice/notificationsSliceget.jsx";

// Combine reducers
const rootReducer = combineReducers({
  loading: loadingReducer,
  filterDropdown: filterDropdownReducer,
  filterBrands: filterBrandsReducer,
  brands: newIncomingReducer,
  admin: adminReducer,
  applications:applicationReducer,
  paymentPackages:paymentPackageReducer,
  notifications: NotificationsReducer,
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
