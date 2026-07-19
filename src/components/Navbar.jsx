
import { Link, NavLink } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import { auth } from "../src/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";



function Navbar() {
  const { cart } = useCart();

  const [user, setUser] = useState(null);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  return () => unsubscribe();
}, []);

const handleLogout = async () => {
  await signOut(auth);
};

  const [menuOpen, setMenuOpen] = useState(false);

  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-green-700/95 backdrop-blur-md text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">

        {/* Top Row */}
        <div className="flex justify-between items-center">

          <div className="flex items-center gap-3">

            <img
              src="/Logos.png"
              alt="Hira's Veg Mart"
              className="w-12 h-12 object-cover rounded-full"
            />
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-white"
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            <h1 className="text-xl md:text-2xl font-bold tracking-wide">
              Hira's Veg Mart
            </h1>

          </div>

          <div className="flex items-center gap-4">

  {user ? (
  <div className="relative">

    <img
      src={user.photoURL}
      alt="Profile"
      onClick={() => setProfileOpen(!profileOpen)}
      className="w-11 h-11 rounded-full border-2 border-white cursor-pointer hover:scale-105 transition"
    />

    {profileOpen && (
      <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl overflow-hidden text-black z-50">

        <div className="p-5 border-b">

          <img
            src={user.photoURL}
            className="w-16 h-16 rounded-full mx-auto"
          />

          <h2 className="text-center font-bold mt-3">
            {user.displayName}
          </h2>

          <p className="text-center text-sm text-gray-500">
            {user.email}
          </p>

        </div>

        <Link
          to="/profile"
          className="block px-5 py-3 hover:bg-green-50"
        >
          👤 My Profile
        </Link>

        <Link
          to="/my-orders"
          className="block px-5 py-3 hover:bg-green-50"
        >
          📦 My Orders
        </Link>

        <button
          onClick={handleLogout}
          className="w-full text-left px-5 py-3 text-red-600 hover:bg-red-50"
        >
          🚪 Logout
        </button>

      </div>
    )}

  </div>
) : (

    <Link
      to="/login"
      className="hidden md:block bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300"
    >
      Login
    </Link>
  )}

  <Link
    to="/cart"
    className="relative transition-transform duration-300 hover:scale-110"
  >
    <ShoppingCart size={28} />

    {cart.length > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
        {cart.length}
      </span>
    )}
  </Link>

</div>

        </div>



        {/* Navigation */}
        <ul className="hidden md:flex flex-wrap justify-center gap-4 mt-4 text-sm md:text-base">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `relative transition ${isActive
                ? "text-yellow-300 font-bold"
                : "hover:text-yellow-300"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              `relative transition ${isActive
                ? "text-yellow-300 font-bold"
                : "hover:text-yellow-300"
              }`
            }
          >
            Products
          </NavLink>

          <NavLink
            to="/Delivery"
            className={({ isActive }) =>
              `relative transition ${isActive
                ? "text-yellow-300 font-bold"
                : "hover:text-yellow-300"
              }`
            }
          >
            Delivery
          </NavLink>

          <NavLink
            to="/Contact"
            className={({ isActive }) =>
              `relative transition ${isActive
                ? "text-yellow-300 font-bold"
                : "hover:text-yellow-300"
              }`
            }

          >
            Contact
          </NavLink>

          <NavLink
            to="/MyOrders"
            className={({ isActive }) =>
              `relative transition ${isActive
                ? "text-yellow-300 font-bold"
                : "hover:text-yellow-300"
              }`
            }
          >
            My Orders
          </NavLink>

          {/* 🚚 यहाँ नया Track Order बटन जोड़ दिया गया है */}
          <NavLink
            to="/TrackOrders"
            className={({ isActive }) =>
              `relative transition ${isActive
                ? "text-yellow-300 font-bold"
                : "hover:text-yellow-300"
              }`
            }
          >
            Track Orders
          </NavLink>
        </ul>

        {menuOpen && (
          <div className="md:hidden mt-4 bg-green-800 rounded-xl p-4">

            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="block py-3 border-b border-green-600"
            >
              🏠 Home
            </Link>

            <Link
              to="/products"
              onClick={() => setMenuOpen(false)}
              className="block py-3 border-b border-green-600"
            >
              🥬 Products
            </Link>

            <Link
              to="/delivery"
              onClick={() => setMenuOpen(false)}
              className="block py-3 border-b border-green-600"
            >
              🚚 Delivery
            </Link>

            <Link
              to="/my-orders"
              onClick={() => setMenuOpen(false)}
              className="block py-3 border-b border-green-600"
            >
              📦 My Orders
            </Link>

            <Link
              to="/track-order"
              onClick={() => setMenuOpen(false)}
              className="block py-3 border-b border-green-600"
            >
              📍 Track Order
            </Link>

            <Link
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className="block py-3"
            >
              📞 Contact
            </Link>

          </div>
        )}

      </div>
    </nav>
  );
}

export default Navbar;