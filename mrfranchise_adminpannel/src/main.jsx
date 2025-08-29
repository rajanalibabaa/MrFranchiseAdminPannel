import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store, persistor } from "./Redux/Store/Index.jsx";
import { PersistGate } from "redux-persist/integration/react";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
