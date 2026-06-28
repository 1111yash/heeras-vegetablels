import products from "../data/products";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import { useState } from "react";

function Products() {
  const { addToCart } = useCart();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-green-700 mb-8">
        🥬 Fresh Vegetables
      </h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search Products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 border rounded-lg mb-6"
      />

      {/* Category Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        {["All", "Vegetables", "Dairy", "Eggs", "Bakery"].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-lg ${
              category === cat
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products
          .filter((item) =>
            item.name.toLowerCase().includes(search.toLowerCase())
          )
          .filter((item) =>
            category === "All" ? true : item.category === category
          )
          .map((item) => (
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
                  ₹{item.price}/kg
                </p>

                <button
                  onClick={() => {
                    addToCart(item);
                    toast.success(`${item.name} added to cart!`);
                  }}
                  className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Products;