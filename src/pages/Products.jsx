import { useEffect } from "react";
import { ref, onValue, get } from "firebase/database";
import { db } from "../src/firebase";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import { useState } from "react";


function Products() {
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedQty, setSelectedQty] = useState({});
  const [category, setCategory] = useState("All");
  const [shopOpen, setShopOpen] = useState(true);

  useEffect(() => {
    const productRef = ref(db, "products");



    onValue(productRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();

        const productArray = Object.entries(data).map(([id, product]) => ({
          id,
          ...product,
        }));

        setProducts(productArray);
      } else {
        setProducts([]);
      }
    });
  }, []);

  useEffect(() => {
    const shopRef = ref(db, "shopSettings/isOpen");

    return onValue(shopRef, (snapshot) => {
      setShopOpen(snapshot.val() ?? true);
    });
  }, []);



  // कैटेगरी के आधार पर ऑटोमैटिक सही unitType तय करने वाला हेल्पर फंक्शन
  const determineUnitType = (item) => {
    if (item.unitType) return item.unitType; // अगर डेटा में पहले से है

    // अगर डेटा में नहीं है, तो कैटेगरी से पहचानो
    const cat = item.category?.toLowerCase();
    if (cat === "dairy") return "liquid";
    if (cat === "juices") return "juice";
    if (cat === "eggs") return "pieces";
    return "weight"; // डिफ़ॉल्ट सब्जियां
  };

  // मात्रा (Quantity) और टाइप के हिसाब से कीमत कैलकुलेट करने का फंक्शन
  const calculatePrice = (pricePerUnit, qty, unitType) => {
    const qtyNum = parseFloat(qty);

    if (unitType === "liquid" || unitType === "juice") {
      // Liquid aur Juice ke liye
      return Math.round((pricePerUnit / 1000) * qtyNum);
    } else if (unitType === "pieces") {
      // Eggs ke liye
      return Math.round(pricePerUnit * qtyNum);
    } else {
      // Vegetables ke liye
      return Math.round((pricePerUnit / 1000) * qtyNum);
    }
  };

  // ड्रॉपडाउन ऑप्शन्स तय करने का फंक्शन
  const getUnitOptions = (unitType) => {
    switch (unitType) {
      case "juice":
        return {
          defaultQty: "125",
          options: [
            { value: "30", label: "30 ml" },
            { value: "60", label: "60 ml" },
            { value: "125", label: "125 ml" },
            { value: "250", label: "250 ml" },
          ],
        };
      case "pieces":
        return {
          defaultQty: "6", // डिफ़ॉल्ट 6 पीस
          options: [
            { value: "1", label: "1 Piece" },
            { value: "6", label: "6 Pieces" },
            { value: "12", label: "12 Pieces (1 Dozen)" },
          ],
        };
      default: // 'weight' यानी सब्जियां
        return {
          defaultQty: "1000", // डिफ़ॉल्ट 1 किलो
          options: [
            { value: "250", label: "250 g" },
            { value: "500", label: "500 g" },
            { value: "1000", label: "1 kg" },
            { value: "2000", label: "2 kg" },
          ],
        };
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
        {["All", "Vegetables", "Dairy", "Eggs", "Juices"].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-lg ${category === cat ? "bg-green-600 text-white" : "bg-gray-200"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products
          .filter((item) =>
            item.name.toLowerCase().includes(search.toLowerCase())
          )
          .filter((item) => item.inStock !== false)
          .filter((item) =>
            category === "All" ? true : item.category === category
          )
          .map((item) => {
            // यहाँ ऑटोमैटिक सही यूनिट टाइप निकाला जा रहा है
            const actualUnitType = determineUnitType(item);
            const { defaultQty, options } = getUnitOptions(actualUnitType);

            const qty = selectedQty[item.id] || defaultQty;
            const price = calculatePrice(item.price, qty, actualUnitType);

            // सही लेबल (जैसे 500 ml या 1 kg) स्क्रीन पर दिखाने के लिए
            const currentOption = options.find((opt) => opt.value === qty);
            const unitLabel = currentOption ? currentOption.label : qty;

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
                      Select Quantity
                    </label>

                    <select
                      value={qty}
                      onChange={(e) =>
                        setSelectedQty({
                          ...selectedQty,
                          [item.id]: e.target.value,
                        })
                      }
                      className="w-full mt-1 border rounded-lg p-2"
                    >
                      {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    disabled={!shopOpen}
                    onClick={() => {
                      if (!shopOpen) {
                        toast.error("🚫 Shop is temporarily closed");
                        return;
                      }

                      addToCart({
                        ...item,
                        quantity: qty,
                        unitLabel,
                        price,
                      });

                      toast.success(`${item.name} (${unitLabel}) added to cart!`);
                    }}
                    className={`mt-4 w-full py-2 rounded-lg text-white ${shopOpen
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-400 cursor-not-allowed"
                      }`}
                  >
                    {shopOpen ? "Add to Cart" : "🚫 Shop Closed"}
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