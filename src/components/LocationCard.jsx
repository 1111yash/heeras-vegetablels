import {
  MapPin,
  LocateFixed,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useUserLocation } from "../context/LocationContext";




export default function LocationCard() {
  const {
  location,
  loading,
  error,
  getCurrentLocation,
} = useUserLocation();

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-2xl border border-green-100 bg-white shadow-lg transition-all duration-300 hover:shadow-xl">

        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-5 py-4 text-white">
          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">
              <div className="rounded-full bg-white/20 p-2">
                <MapPin size={22} />
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-green-100">
                  Delivering To
                </p>

                <h2 className="text-lg font-bold">
                  Current Location
                </h2>
              </div>
            </div>

            {location.latitude && (
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-green-700">
                LIVE
              </span>
            )}

          </div>
        </div>

        {/* Body */}

        <div className="p-5">

          {/* Loading */}

          {loading && (
            <div className="flex flex-col items-center py-10">

              <RefreshCw
                size={42}
                className="animate-spin text-green-600"
              />

              <p className="mt-4 text-gray-600">
                Detecting your location...
              </p>

            </div>
          )}

          {/* No Location */}

          {!loading && !location.latitude && (
            <div className="flex flex-col items-center text-center">

              <div className="mb-5 rounded-full bg-green-100 p-5">

                <LocateFixed
                  className="text-green-600"
                  size={38}
                />

              </div>

              <h3 className="text-xl font-bold text-gray-800">
                Detect Your Current Location
              </h3>

              <p className="mt-2 max-w-md text-sm text-gray-500">
                Allow location permission to automatically detect your address
                for faster delivery.
              </p>

              <button
                onClick={getCurrentLocation}
                className="mt-6 flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 active:scale-95"
              >
                <LocateFixed size={20} />
                Detect Location
              </button>

            </div>
          )}

          {/* Success */}

          {!loading && location.latitude && (
            <div>

              <div className="rounded-xl border border-green-100 bg-green-50 p-4">

                <div className="flex items-start gap-3">

                  <CheckCircle2
                    size={24}
                    className="mt-1 text-green-600"
                  />

                  <div className="flex-1">

                    <p className="font-semibold text-green-700">
                      Delivery Address
                    </p>

                    <p className="mt-2 text-sm leading-6 text-gray-700 break-words">
                      {location.address}
                    </p>

                  </div>

                </div>

              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">

                <div className="rounded-xl border bg-gray-50 p-4">

                  <p className="text-xs uppercase text-gray-500">
                    City
                  </p>

                  <p className="mt-1 font-semibold">
                    {location.city || "-"}
                  </p>

                </div>

                <div className="rounded-xl border bg-gray-50 p-4">

                  <p className="text-xs uppercase text-gray-500">
                    State
                  </p>

                  <p className="mt-1 font-semibold">
                    {location.state || "-"}
                  </p>

                </div>

                <div className="rounded-xl border bg-gray-50 p-4">

                  <p className="text-xs uppercase text-gray-500">
                    Pincode
                  </p>

                  <p className="mt-1 font-semibold">
                    {location.pincode || "-"}
                  </p>

                </div>

                <div className="rounded-xl border bg-gray-50 p-4">

                  <p className="text-xs uppercase text-gray-500">
                    Country
                  </p>

                  <p className="mt-1 font-semibold">
                    {location.country || "-"}
                  </p>

                </div>

              </div>

              <div className="mt-5 flex flex-wrap gap-3">

                <button
                  onClick={getCurrentLocation}
                  className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700 active:scale-95"
                >
                  <RefreshCw size={18} />
                  Refresh Location
                </button>

                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                  ✅ Delivery Available
                </div>

              </div>

            </div>
          )}

          {/* Error */}

          {error && (
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4">

              <AlertCircle className="text-red-600" />

              <p className="text-sm text-red-700">
                {error}
              </p>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}