import { createContext, useContext, useState, useEffect } from "react";

const LocationContext = createContext();

export const useUserLocation = () => useContext(LocationContext);

export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
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

  useEffect(() => {
  const savedLocation = localStorage.getItem("deliveryLocation");

  if (savedLocation) {
    setLocation(JSON.parse(savedLocation));
  }
}, []);

  const getCurrentLocation = () => {
    setError("");

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          // Free Reverse Geocoding (OpenStreetMap)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
          );

          const data = await response.json();
setLocation({
  latitude: lat,
  longitude: lon,
  address: data.display_name || "",
  city:
    data.address.city ||
    data.address.town ||
    data.address.village ||
    "",
  state: data.address.state || "",
  pincode: data.address.postcode || "",
  country: data.address.country || "",
});

localStorage.setItem(
  "deliveryLocation",
  JSON.stringify({
    latitude: lat,
    longitude: lon,
    address: data.display_name || "",
    city:
      data.address.city ||
      data.address.town ||
      data.address.village ||
      "",
    state: data.address.state || "",
    pincode: data.address.postcode || "",
    country: data.address.country || "",
  })
);
        } catch (err) {
          console.error(err);

          setLocation({

            
            latitude: lat,
            longitude: lon,
            address: "",
            city: "",
            state: "",
            pincode: "",
            country: "",
          });

          setError("Unable to fetch address.");
        }

        setLoading(false);
      },
      (err) => {
        console.log(err);

        switch (err.code) {
          case 1:
            setError("Location permission denied.");
            break;

          case 2:
            setError("Location unavailable.");
            break;

          case 3:
            setError("Location request timed out.");
            break;

          default:
            setError("Unable to get your location.");
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

  const clearLocation = () => {
    setLocation({

        
      latitude: null,
      longitude: null,
      address: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
    });

    setError("");
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        loading,
        error,
        getCurrentLocation,
        clearLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}