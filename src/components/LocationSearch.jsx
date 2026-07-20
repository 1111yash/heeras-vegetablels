
import { useState } from "react";

function LocationSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const searchLocation = async (text) => {
    setQuery(text);

    if (text.length < 3) {
      setResults([]);
      return;
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${text}&limit=5`
      );

      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="relative w-full">

      <input
        type="text"
        value={query}
        onChange={(e) => searchLocation(e.target.value)}
        placeholder="Search address..."
        className="w-full p-3 border rounded-xl"
      />

      {results.length > 0 && (
        <div className="absolute w-full bg-white shadow-lg rounded-xl mt-2 z-50 max-h-60 overflow-y-auto">

          {results.map((item) => (
            <div
              key={item.place_id}
              className="p-3 border-b cursor-pointer hover:bg-gray-100"
            >
              {item.display_name}
            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default LocationSearch;