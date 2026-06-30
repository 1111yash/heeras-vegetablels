import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Delivery from "./pages/Delivery";
import TrackOrder from "./pages/TrackOrder";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/ErrorPage";
import MyOrders from "./pages/MyOrders";


function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/my-orders" element={<MyOrders />} />
        

        {/* Admin Dashboard */}
        <Route
          path="/heera-admin-dashboard"
          element={<AdminPanel />}
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;