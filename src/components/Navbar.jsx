import { Link } from "react-router-dom";
import { ShoppingCart, Search } from "lucide-react";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { cart } = useCart();

  return (
    <nav className="bg-green-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">

        {/* Top Row */}
        <div className="flex justify-between items-center">

          <h1 className="text-lg md:text-2xl font-bold">
            🥬 Heera's Vegetables
          </h1>

          <Link to="/cart" className="relative">
            <ShoppingCart size={28} />

            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Link>

        </div>

        {/* Search Bar (Desktop Only) */}
        <div className="hidden md:flex items-center bg-white rounded-lg px-3 py-2 w-96 mx-auto mt-4">
          <Search className="text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search Vegetables..."
            className="outline-none w-full px-2 text-black"
          />
        </div>

        {/* Navigation */}
        <ul className="flex flex-wrap justify-center gap-4 mt-4 text-sm md:text-base">
          <li>
            <Link to="/" className="hover:text-yellow-300">
              Home
            </Link>
          </li>

          <li>
            <Link to="/products" className="hover:text-yellow-300">
              Products
            </Link>
          </li>

          <li>
            <Link to="/delivery" className="hover:text-yellow-300">
              Delivery
            </Link>
          </li>

          <li>
            <Link to="/contact" className="hover:text-yellow-300">
              Contact
            </Link>
          </li>

          {/* 🚚 यहाँ नया Track Order बटन जोड़ दिया गया है */}
          <li>
            <Link to="/track-order" className="hover:text-yellow-300 font-medium">
              Track Order
            </Link>
          </li>
          
        </ul>

      </div>
    </nav>
  );
}

export default Navbar;