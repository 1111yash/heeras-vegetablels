
import { Link, NavLink } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import { auth } from "../src/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useUserLocation } from "../context/LocationContext";
import { MapPin } from "lucide-react";

function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);

  const { location, getCurrentLocation } = useUserLocation();

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

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

  const searchAddress = async (value) => {
  setSearch(value);

  if (value.length < 3) {
    setResults([]);
    return;
  }

  setSearchLoading(true);

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(value)}&limit=5`
    );

    const data = await res.json();

    setResults(data);
  } catch (err) {
    console.error(err);
  }

  setSearchLoading(false);
};



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

            <button
  onClick={() => setLocationOpen(true)}
  className="hidden md:flex items-center gap-2 ml-5 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl transition"
>
  <MapPin size={18} />
  <div className="text-left">
    <p className="text-xs text-gray-200">
      Deliver To
    </p>

    <p className="text-sm font-semibold">
      {location.city || "Choose Location"}
    </p>
  </div>
</button>

            {/* Current Location */}
            <div className="hidden lg:flex items-center gap-2 ml-5 bg-white/10 px-3 py-2 rounded-xl">

              <MapPin size={18} className="text-yellow-300" />

              <div className="leading-tight">
                <p className="text-[11px] text-green-100">
                  Delivering To
                </p>

                <p className="text-sm font-semibold text-white">
                  {location.city || "Choose Location"}
                </p>
              </div>

            </div>

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

            <div className="mb-4 rounded-xl bg-green-700 border border-green-600 p-3">
              <div className="flex items-center gap-3">
                <MapPin size={20} className="text-yellow-300" />

                <div>
                  <p className="text-xs text-green-200">
                    Delivering To
                  </p>

                <button
  onClick={getCurrentLocation}
  className="text-sm font-semibold text-white hover:text-yellow-300 transition"
>
  {location.city || "Choose Location"}
</button>
                </div>
              </div>
            </div>


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

            {!user ? (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block py-3 border-t border-green-600"
              >
                🔐 Login
              </Link>
            ) : (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="block py-3 border-t border-green-600"
                >
                  👤 My Profile
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left py-3 text-red-300"
                >
                  🚪 Logout
                </button>
              </>
            )}

          </div>
        )}

      </div>
       {locationOpen && (
  <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center">
    <div className="bg-white w-[95%] max-w-md rounded-2xl p-6">

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-black">
          Choose Delivery Location
        </h2>

        <button onClick={() => setLocationOpen(false)}>
          <X className="text-black" />
        </button>
      </div>

      <input
  type="text"
  value={search}
  onChange={(e) => searchAddress(e.target.value)}
  placeholder="Search address..."
  className="w-full border rounded-xl px-4 py-3 text-black"
/>

      <button
  onClick={async () => {
    await getCurrentLocation();
    setLocationOpen(false);
  }}
  className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl transition"
>
  📍 Use Current Location
</button>

    </div>
  </div>
)}

    </nav>
  );
}

export default Navbar;