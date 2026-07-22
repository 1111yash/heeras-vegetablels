

import { Link, NavLink } from "react-router-dom";
import {
  ShoppingCart,
  Menu,
  X,
  MapPin,
  Search,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import { auth } from "../src/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useUserLocation } from "../context/LocationContext";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);

  const {
  location,
  loading,
  error,

  search,
  setSearch,

  results,
  searchLoading,

  searchAddress,

  getCurrentLocation,
  selectLocation,
} = useUserLocation();

 

  const { cart } = useCart();

  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };



  return (
    <><nav className="sticky top-0 z-50 bg-green-700 text-white shadow-lg">

  <div className="max-w-7xl mx-auto px-4 py-3">

    {/* Top Row */}
    <div className="flex items-center justify-between">

      {/* Left */}
      <div className="flex items-center gap-3">

        {/* Mobile Menu */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3"
        >
          <img
            src="/Logos.png"
            alt="logo"
            className="w-11 h-11 rounded-full"
          />

          <div>
            <h1 className="font-bold text-xl">
              Hira's Veg Mart
            </h1>
          </div>
        </Link>

        {/* Desktop Location */}
        <button
          onClick={() => setLocationOpen(true)}
          className="hidden md:flex items-center gap-3 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl ml-6"
        >
          <MapPin
            size={20}
            className="text-yellow-300"
          />

          <div className="text-left">
            <p className="text-xs text-green-100">
              Delivery To
            </p>

            <p className="font-semibold text-sm max-w-[220px] truncate">
              {location.address || "Choose Location"}
            </p>
          </div>
        </button>

      </div>

      {/* Right */}
      <div className="flex items-center gap-5">

        {!user ? (
          <Link
            to="/login"
            className="hidden md:block bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold"
          >
            Login
          </Link>
        ) : (
          <div className="relative">

            <img
              src={user.photoURL}
              alt=""
              onClick={() =>
                setProfileOpen(!profileOpen)
              }
              className="w-10 h-10 rounded-full cursor-pointer border-2 border-white"
            />

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl text-black overflow-hidden">

                <div className="p-4 border-b">

                  <img
                    src={user.photoURL}
                    className="w-14 h-14 rounded-full mx-auto"
                  />

                  <h3 className="text-center font-bold mt-2">
                    {user.displayName}
                  </h3>

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
                  className="w-full text-left px-5 py-3 hover:bg-red-50 text-red-600"
                >
                  Logout
                </button>

              </div>
            )}

          </div>
        )}

        {/* Cart */}
        <Link
          to="/cart"
          className="relative"
        >
          <ShoppingCart size={28} />

          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 w-5 h-5 rounded-full text-xs flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </Link>

      </div>

    </div>

    {/* Desktop Navigation */}
    <div className="hidden md:flex justify-center gap-8 mt-5">

      <NavLink to="/">Home</NavLink>

      <NavLink to="/products">
        Products
      </NavLink>

      <NavLink to="/delivery">
        Delivery
      </NavLink>

      <NavLink to="/contact">
        Contact
      </NavLink>

      <NavLink to="/my-orders">
        My Orders
      </NavLink>

      <NavLink to="/track-order">
        Track Order
      </NavLink>

    </div>

  </div>
  


  {/* Mobile Menu */}
{menuOpen && (
  <div className="md:hidden bg-green-800 px-4 py-4 space-y-2">

    <button
      onClick={() => {
        setLocationOpen(true);
        setMenuOpen(false);
      }}
      className="w-full flex items-center gap-3 bg-green-700 rounded-xl p-3"
    >
      <MapPin className="text-yellow-300" size={20} />

      <div className="text-left">
        <p className="text-xs text-green-200">
          Delivery To
        </p>

        <p className="font-semibold truncate">
          {location.address || "Choose Location"}
        </p>
      </div>
    </button>

    <Link
      to="/"
      onClick={() => setMenuOpen(false)}
      className="block py-3 border-b border-green-700"
    >
      🏠 Home
    </Link>

    <Link
      to="/products"
      onClick={() => setMenuOpen(false)}
      className="block py-3 border-b border-green-700"
    >
      🥬 Products
    </Link>

    <Link
      to="/delivery"
      onClick={() => setMenuOpen(false)}
      className="block py-3 border-b border-green-700"
    >
      🚚 Delivery
    </Link>

    <Link
      to="/my-orders"
      onClick={() => setMenuOpen(false)}
      className="block py-3 border-b border-green-700"
    >
      📦 My Orders
    </Link>

    <Link
      to="/track-order"
      onClick={() => setMenuOpen(false)}
      className="block py-3 border-b border-green-700"
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
        className="block py-3 border-t border-green-700"
      >
        🔐 Login
      </Link>
    ) : (
      <>
        <Link
          to="/profile"
          onClick={() => setMenuOpen(false)}
          className="block py-3 border-t border-green-700"
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

{/* Location Popup */}
{locationOpen && (
  <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center p-4">

    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b">

        <div>
          <h2 className="text-lg font-bold text-black">
            Choose Delivery Location
          </h2>

          <p className="text-sm text-gray-500">
            Search anywhere in Nagpur
          </p>
        </div>

        <button
          onClick={() => setLocationOpen(false)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <X size={22} className="text-black" />
        </button>

      </div>

      {/* Search */}
      <div className="p-4">

        <div className="flex items-center border rounded-xl px-3 py-3">

          <Search size={18} className="text-gray-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => searchAddress(e.target.value)}
            placeholder="Search area, street..."
            className="flex-1 ml-2 outline-none text-black"
          />

        </div>

        {searchLoading && (
          <div className="text-center py-4 text-gray-500">
            Searching...
          </div>
        )}

        {!searchLoading && results.length > 0 && (

          <div className="mt-3 max-h-72 overflow-y-auto rounded-xl border">

           {results.map((item, index) => {
  const p = item.properties || {};

  const title =
    p.name ||
    p.street ||
    p.suburb ||
    p.city ||
    "Nagpur";

  const subtitle = [
    p.city,
    p.state,
    p.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <button
      key={index}
      onClick={() => {
        selectLocation(item);
        setLocationOpen(false);
      }}
      className="w-full text-left p-4 hover:bg-green-50 border-b"
    >
      <div className="flex gap-3">

        <MapPin
          size={20}
          className="text-green-600 mt-1"
        />

        <div>

          <h3 className="font-semibold text-black">
            {title}
          </h3>

          <p className="text-sm text-gray-500">
            {subtitle}
          </p>

        </div>

      </div>
    </button>
  );
})}

          </div>

        )}

        <button
          onClick={async () => {
            await getCurrentLocation();
            setLocationOpen(false);
          }}
          className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold"
        >
          📍 Use Current Location
        </button>

      </div>

    </div>

  </div>
)}

</nav>
    </>
  );

}


export default Navbar;


