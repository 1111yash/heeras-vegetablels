import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "leaflet/dist/leaflet.css";

import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { LocationProvider } from "./context/LocationContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <LocationProvider>
          <App />
        </LocationProvider>
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);