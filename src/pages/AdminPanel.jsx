import { useState, useEffect } from "react";
import { ref, onValue, update, remove, get, set } from "firebase/database";
import { db } from "../src/firebase";

function AdminPanel() {
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    const ordersRef = ref(db, "orders");
    onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      setOrders(data || {});
    });
  }, []);

  const updateStatus = (orderId, newStatus) => {
    update(ref(db, `orders/${orderId}`), { status: newStatus })
      .catch((err) => alert("Error: " + err.message));
  };

  const cancelOrder = (orderId) => {
    if (window.confirm("क्या आप वाकई यह ऑर्डर कैंसिल करना चाहते हैं?")) {
      update(ref(db, `orders/${orderId}`), { status: 0 })
        .catch((err) => alert("Error: " + err.message));
    }
  };

  const archiveOrders = async () => {
    if (window.confirm("आज के सभी ऑर्डर्स को 'Archive' करके डैशबोर्ड साफ करें?")) {
      const ordersRef = ref(db, "orders");
      const snapshot = await get(ordersRef);
      if (snapshot.exists()) {
        const historyRef = ref(db, "history/" + new Date().toDateString());
        await set(historyRef, snapshot.val());
        await remove(ordersRef);
        alert("डैशबोर्ड साफ हो गया!");
      }
    }
  };

  if (orders === null) return <div className="p-10 text-center text-xl">Loading...</div>;

  const sortedOrderIds = Object.keys(orders).sort((a, b) => (orders[b].timestamp || 0) - (orders[a].timestamp || 0));
  const totalSales = Object.values(orders).reduce((sum, order) => sum + (order.status !== 0 ? (order.total || 0) : 0), 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🏪 Admin Dashboard</h1>
        <div className="text-lg font-bold text-green-700">Total: ₹{totalSales}</div>
        <button onClick={archiveOrders} className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold">🌙 Archive</button>
      </div>

      {Object.keys(orders).length === 0 ? (
        <div className="p-10 text-center text-gray-500">कोई नया ऑर्डर नहीं है।</div>
      ) : (
        <div className="grid gap-6">
          {sortedOrderIds.map((id) => (
            <div key={id} className={`bg-white p-6 rounded-2xl shadow-md border-l-8 ${orders[id].status === 0 ? 'border-red-500' : 'border-green-500'}`}>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-lg font-bold">#{id}</h2>
                  <p className="font-semibold">{orders[id].customerName} | 📞 {orders[id].phone}</p>
                  <p className="text-xs text-gray-500">{new Date(orders[id].timestamp).toLocaleTimeString()}</p>
                </div>
                <div className={`px-3 py-1 rounded-full font-bold text-xs text-white ${
                  orders[id].status === 0 ? 'bg-red-500' :
                  orders[id].status === 1 ? 'bg-orange-500' : 
                  orders[id].status === 2 ? 'bg-yellow-500' : 
                  orders[id].status === 3 ? 'bg-blue-500' : 'bg-green-600'
                }`}>
                  {orders[id].status === 0 ? 'Cancelled' : orders[id].status === 1 ? 'Received' : orders[id].status === 2 ? 'Packing' : orders[id].status === 3 ? 'Out' : 'Delivered'}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {orders[id].status !== 0 && (
                  <>
                    <button onClick={() => updateStatus(id, 1)} className="bg-orange-500 text-white px-3 py-1 rounded text-sm">Recv</button>
                    <button onClick={() => updateStatus(id, 2)} className="bg-yellow-500 text-white px-3 py-1 rounded text-sm">Pack</button>
                    <button onClick={() => updateStatus(id, 3)} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">Out</button>
                    <button onClick={() => updateStatus(id, 4)} className="bg-green-600 text-white px-3 py-1 rounded text-sm">Done</button>
                    <button onClick={() => cancelOrder(id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Cancel</button>
                  </>
                )}
                <a href={`https://wa.me/91${orders[id].phone}`} target="_blank" rel="noreferrer" className="bg-green-500 text-white px-3 py-1 rounded text-sm">WhatsApp</a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminPanel;