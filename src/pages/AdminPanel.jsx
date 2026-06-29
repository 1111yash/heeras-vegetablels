import { useState, useEffect } from "react";
import { ref, onValue, update, remove, get, set } from "firebase/database";
import { db } from "../src/firebase";

function HeeraAdminDashboard() {
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    const ordersRef = ref(db, "orders");
    onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      setOrders(data || {});
    });
  }, []);

  // 🌙 रात के 10 बजे के बाद काम आने वाला फंक्शन
  const archiveOrders = async () => {
    if (window.confirm("क्या आप आज के सभी ऑर्डर्स को 'Archive' करके डैशबोर्ड साफ करना चाहते हैं?")) {
      const ordersRef = ref(db, "orders");
      const snapshot = await get(ordersRef);
      
      if (snapshot.exists()) {
        // डेटा को 'history' में डाल दिया
        const historyRef = ref(db, "history/" + new Date().toDateString());
        await set(historyRef, snapshot.val());
        // पुराने ऑर्डर्स हटा दिए
        await remove(ordersRef);
        alert("डैशबोर्ड साफ हो गया! कल के लिए तैयार।");
      } else {
        alert("कोई ऑर्डर नहीं है जिसे आर्काइव किया जाए।");
      }
    }
  };

  const updateStatus = (orderId, newStatus) => {
    update(ref(db, `orders/${orderId}`), { status: newStatus })
      .catch((err) => alert("Error: " + err.message));
  };

  if (orders === null) return <div className="p-10 text-center text-xl">Loading Orders...</div>;

  // सबसे नया ऑर्डर ऊपर लाने का सॉर्टिंग
  const sortedOrderIds = Object.keys(orders).sort((a, b) => {
    return (orders[b].timestamp || 0) - (orders[a].timestamp || 0);
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-black">
      {/* हेडर और आर्काइव बटन */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">🏪 Admin Dashboard</h1>
        <button 
          onClick={archiveOrders}
          className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 shadow-lg"
        >
          🌙 Archive & Clear
        </button>
      </div>

      {Object.keys(orders).length === 0 ? (
        <div className="p-10 text-center text-xl text-gray-500">कोई नया ऑर्डर नहीं है।</div>
      ) : (
        <div className="grid gap-6">
          {sortedOrderIds.map((id) => (
            <div key={id} className="bg-white p-6 rounded-2xl shadow-md border-l-8 border-green-500">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-bold">Order ID: {id}</h2>
                  <p>ग्राहक: {orders[id].customerName || "Unknown"}</p>
                  <p className="text-sm text-gray-500">
                    {orders[id].timestamp ? new Date(orders[id].timestamp).toLocaleString() : "N/A"}
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-full font-bold text-white ${
                  orders[id].status === 1 ? 'bg-orange-500' : 
                  orders[id].status === 2 ? 'bg-yellow-500' : 
                  orders[id].status === 3 ? 'bg-blue-500' : 'bg-green-600'
                }`}>
                  {orders[id].status === 1 ? 'Confirmed' : orders[id].status === 2 ? 'Packing' : orders[id].status === 3 ? 'Out for Delivery' : 'Delivered'}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button onClick={() => updateStatus(id, 2)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Packing</button>
                <button onClick={() => updateStatus(id, 3)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Out for Delivery</button>
                <button onClick={() => updateStatus(id, 4)} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Delivered</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HeeraAdminDashboard;