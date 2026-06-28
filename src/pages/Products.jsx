import products from "../data/products";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import { useState } from "react";

function Products() {
  const { addToCart } = useCart();

  const [search, setSearch] = useState("");
  const [selectedWeight, setSelectedWeight] = useState({});
  const [category, setCategory] = useState("All");

  const calculatePrice = (pricePerKg, weight) => {
    switch (weight) {
      case "250":
        return Math.round(pricePerKg * 0.25);

      case "500":
        return Math.round(pricePerKg * 0.5);

      case "1000":
        return pricePerKg;

      case "2000":
        return pricePerKg * 2;

      default:
        return pricePerKg;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-green-700 mb-8">
        🥬 Fresh Products
      </h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search Products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 border rounded-lg mb-6"
      />

      {/* Category */}
      <div className="flex flex-wrap gap-3 mb-6">
        {["All", "Vegetables", "Dairy", "Eggs", "Bakery"].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-lg ${
              category === cat
                ? "bg-green-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products
          .filter((item) =>
            item.name.toLowerCase().includes(search.toLowerCase())
          )
          .filter((item) =>
            category === "All" ? true : item.category === category
          )
          .map((item) => {
            const weight = selectedWeight[item.id] || "1000";
            const price = calculatePrice(item.price, weight);

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-52 object-cover"
                />

                <div className="p-4">
                  <h2 className="text-xl font-bold">{item.name}</h2>

                  <p className="text-green-700 font-semibold mt-2">
                    ₹{price}
                  </p>

                  <div className="mt-3">
                    <label className="text-sm font-medium">
                      Select Weight
                    </label>

                    <select
                      value={weight}
                      onChange={(e) =>
                        setSelectedWeight({
                          ...selectedWeight,
                          [item.id]: e.target.value,
                        })
                      }
                      className="w-full mt-1 border rounded-lg p-2"
                    >
                      <option value="250">250 g</option>
                      <option value="500">500 g</option>
                      <option value="1000">1 kg</option>
                      <option value="2000">2 kg</option>
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      addToCart({
                        ...item,
                        weight,
                        price,
                      });

                      toast.success(
                        `${item.name} (${weight}g) added to cart!`
                      );
                    }}
                    className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Products;