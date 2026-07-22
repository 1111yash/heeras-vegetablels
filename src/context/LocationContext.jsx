import { createContext, useContext, useState, useEffect } from "react";

const LocationContext = createContext();

export const useUserLocation = () => useContext(LocationContext);

// =============================
// Delivery Distance Calculator
// =============================
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export function LocationProvider({ children }) {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Photon Suggestions
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // =============================
  // Load Saved Location
  // =============================
  useEffect(() => {
    const saved = localStorage.getItem("deliveryLocation");

    if (saved) {
      try {
        setLocation(JSON.parse(saved));
      } catch (err) {
        console.log(err);
      }
    }
  }, []);

  // =============================
  // Save Location
  // =============================
  const saveLocation = (data) => {
    setLocation(data);

    localStorage.setItem(
      "deliveryLocation",
      JSON.stringify(data)
    );
  };

  // =============================
  // Photon Search
  // =============================
  const searchAddress = async (value) => {

    setSearch(value);

    if (value.trim().length < 2) {
      setResults([]);
      return;
    }

    setSearchLoading(true);

    try {

      const response = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(
          value + " Nagpur Maharashtra India"
        )}&limit=8`
      );

      const data = await response.json();

      setResults(data.features || []);

    } catch (err) {

      console.log(err);
      setResults([]);

    }

    setSearchLoading(false);

  };

  // =============================
  // Reverse Geocode
  // =============================
  const reverseGeocode = async (lat, lon) => {

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
    );

    return await response.json();

  };

  // =============================
  // Current Location
  // =============================
  const getCurrentLocation = () => {

    setError("");

    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {

          const data = await reverseGeocode(lat, lon);

          const newLocation = {

            latitude: lat,
            longitude: lon,

            address: data.display_name || "",

            city:
              data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              data.address?.suburb ||
              "",

            state: data.address?.state || "",

            pincode:
              data.address?.postcode || "",

            country:
              data.address?.country || "",

          };

          saveLocation(newLocation);

        } catch (err) {

          console.log(err);

          setError("Unable to fetch address");

        }

        setLoading(false);

      },
            (err) => {

        switch (err.code) {

          case 1:
            setError("Location permission denied.");
            break;

          case 2:
            setError("Location unavailable.");
            break;

          case 3:
            setError("Location timeout.");
            break;

          default:
            setError("Unable to get location.");
        }

        setLoading(false);

      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // =============================
  // Select Photon Result
  // =============================
  const selectLocation = async (item) => {

    try {

      const lat = item.geometry.coordinates[1];
      const lon = item.geometry.coordinates[0];

      const data = await reverseGeocode(lat, lon);

      const newLocation = {

        latitude: lat,
        longitude: lon,

        address: data.display_name || "",

        city:
          data.address?.city ||
          data.address?.town ||
          data.address?.village ||
          data.address?.suburb ||
          item.properties.city ||
          "Nagpur",

        state:
          data.address?.state ||
          item.properties.state ||
          "Maharashtra",

        pincode:
          data.address?.postcode || "",

        country:
          data.address?.country ||
          item.properties.country ||
          "India",

      };

      saveLocation(newLocation);

      setSearch("");
      setResults([]);

    } catch (err) {

      console.log(err);

      setError("Unable to select location");

    }

  };

  // =============================
  // Clear Location
  // =============================
  const clearLocation = () => {

    const empty = {

      latitude: null,
      longitude: null,
      address: "",
      city: "",
      state: "",
      pincode: "",
      country: "",

    };

    setLocation(empty);

    localStorage.removeItem("deliveryLocation");

    setError("");

    setSearch("");

    setResults([]);

  };
    return (
    <LocationContext.Provider
      value={{
        // Current Location
        location,
        loading,
        error,

        // Search
        search,
        setSearch,
        results,
        searchLoading,
        searchAddress,

        // Actions
        getCurrentLocation,
        selectLocation,
        clearLocation,

        // Helpers
        calculateDistance,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export default LocationContext;