import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "leaflet/dist/leaflet.css";
import { Toaster } from "react-hot-toast";

import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { LocationProvider } from "./context/LocationContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <LocationProvider>
          <App />
           <Toaster
      position="bottom-center"
      reverseOrder={false}
    />
        </LocationProvider>
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);