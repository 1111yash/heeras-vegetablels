import { useState } from "react";
import { ref, get } from "firebase/database";
import { db } from "../src/firebase";
import { Link } from "react-router-dom";

function MyOrders() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchOrders = async () => {
    if (!phone.trim()) {
      alert("Enter Mobile Number");
      return;
    }

    setLoading(true);

    try {
      const snapshot = await get(ref(db, "orders"));

      if (!snapshot.exists()) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const data = snapshot.val();

      const result = Object.entries(data)
        .filter(([id, order]) => order.phone === phone.trim())
        .map(([id, order]) => ({
          id,
          ...order,
        }))
        .sort((a, b) => b.timestamp - a.timestamp);

      setOrders(result);
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }

    setLoading(false);
  };

  const getStatus = (status) => {
    switch (Number(status)) {
      case 1:
        return {
          text: "Confirmed",
          bg: "bg-blue-100",
          color: "text-blue-700",
        };

      case 2:
        return {
          text: "Packing",
          bg: "bg-yellow-100",
          color: "text-yellow-700",
        };

      case 3:
        return {
          text: "Out For Delivery",
          bg: "bg-orange-100",
          color: "text-orange-700",
        };

      case 4:
        return {
          text: "Delivered",
          bg: "bg-green-100",
          color: "text-green-700",
        };

      default:
        return {
          text: "Pending",
          bg: "bg-gray-100",
          color: "text-gray-700",
        };
    }
  };
    return (
    <div className="max-w-5xl mx-auto p-6">

      <h1 className="text-3xl font-bold text-center text-green-700 mb-8">
        📦 My Orders
      </h1>

      <div className="flex gap-3 mb-8">
        <input
          type="text"
          placeholder="Enter Mobile Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="flex-1 border rounded-lg p-3"
        />

        <button
          onClick={searchOrders}
          className="bg-green-600 hover:bg-green-700 text-white px-6 rounded-lg"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">
          No Orders Found
        </p>
      ) : (
        orders.map((order) => {
          const status = getStatus(order.status);

          return (
            <div
              key={order.id}
              className="bg-white border rounded-2xl shadow-lg p-6 mb-8"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-green-700">
                  📦 Order #{order.id}
                </h2>

                <span
                  className={`px-4 py-1 rounded-full text-sm font-bold ${status.bg} ${status.color}`}
                >
                  {status.text}
                </span>
              </div>

              <p className="mb-1">
                <strong>👤 Customer :</strong> {order.customerName}
              </p>

              <p className="mb-3">
                <strong>📞 Mobile :</strong> {order.phone}
              </p>

              <hr className="my-4" />

              {/* NEW ORDERS */}
              {Array.isArray(order.items) ? (
                order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border rounded-xl p-4 mb-4"
                  >
                    <div className="flex gap-4 items-center">

                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />

                      <div>
                        <h3 className="font-bold text-lg">
                          {item.name}
                        </h3>

                        <p className="text-gray-500">
                          {item.unitLabel}
                        </p>

                        <p className="text-green-700 font-bold">
                          ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                        </p>
                      </div>

                    </div>

                    <div className="font-bold text-xl">
                      × {item.quantity}
                    </div>
                  </div>
                ))
              ) : (
                /* OLD ORDERS */
                <div className="mb-4">
                  <strong>🛒 Items</strong>

                  {order.items.split(",").map((item, index) => (
                    <p key={index} className="ml-2 mt-2">
                      • {item.trim()}
                    </p>
                  ))}
                </div>
              )}

              <div className="border-t pt-4 mt-4">

                <p className="text-2xl font-bold text-green-700">
                  💰 Total : ₹{order.total}
                </p>

                <p className="text-gray-500 mt-2">
                  📅 {new Date(order.timestamp).toLocaleString("en-IN")}
                </p>

                <div className="mt-5 flex gap-3">

                  <Link
                    to={`/track-order?id=${order.id}`}
                    className="bg-blue-600 hover:bg-yellow-400 hover:text-black text-white px-5 py-3 rounded-xl font-bold transition"
                  >
                    📍 Track Order
                  </Link>

                </div>

              </div>

            </div>
          );
        })
      )}

    </div>
  );
}

export default MyOrders;