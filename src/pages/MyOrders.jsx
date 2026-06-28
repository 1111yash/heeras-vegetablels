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
      } else {
        const data = snapshot.val();
        const result = Object.entries(data)
          .filter(([id, order]) => order.phone === phone.trim())
          .map(([id, order]) => ({ id, ...order }))
          .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        setOrders(result);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
    setLoading(false);
  };

  const getStatus = (status) => {
    const s = Number(status);
    if (s === 0) return { text: "Cancelled", bg: "bg-red-100", color: "text-red-700" };
    if (s === 1) return { text: "Confirmed", bg: "bg-blue-100", color: "text-blue-700" };
    if (s === 2) return { text: "Packing", bg: "bg-yellow-100", color: "text-yellow-700" };
    if (s === 3) return { text: "Out For Delivery", bg: "bg-orange-100", color: "text-orange-700" };
    if (s === 4) return { text: "Delivered", bg: "bg-green-100", color: "text-green-700" };
    return { text: "Pending", bg: "bg-gray-100", color: "text-gray-700" };
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-green-700 mb-8">📦 My Orders</h1>

      <div className="flex gap-3 mb-8">
        <input
          type="text"
          placeholder="Enter Mobile Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="flex-1 border rounded-lg p-3"
        />
        <button onClick={searchOrders} className="bg-green-600 text-white px-6 rounded-lg font-bold">
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No Orders Found</p>
      ) : (
        orders.map((order) => {
          const status = getStatus(order.status);
          return (
            <div key={order.id} className="bg-white border rounded-2xl shadow-lg p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-green-700">Order #{order.id}</h2>
                <span className={`px-4 py-1 rounded-full text-sm font-bold ${status.bg} ${status.color}`}>
                  {status.text}
                </span>
              </div>

              <p><strong>👤 Customer:</strong> {order.customerName}</p>
              <hr className="my-4" />

              {/* SAFE RENDERING: Check if order.items exists */}
              {Array.isArray(order.items) ? (
                order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between border rounded-xl p-4 mb-4">
                    <div className="flex gap-4 items-center">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                      <div>
                        <h3 className="font-bold">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.unitLabel}</p>
                        <p className="text-green-700 font-bold text-sm">₹{item.price} x {item.quantity}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 mb-4">Items: {order.items || "N/A"}</p>
              )}

              <div className="border-t pt-4">
                <p className="text-2xl font-bold text-green-700">💰 Total : ₹{order.total || 0}</p>
                <Link to={`/track-order?id=${order.id}`} className="mt-4 block text-center bg-blue-600 text-white py-3 rounded-xl font-bold">
                  📍 Track Order
                </Link>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default MyOrders;